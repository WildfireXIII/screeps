function enterP0()
{
	announce("ENTERING PHASE 0");
	Memory.Cassandra.phase = 0;

	Memory.spawnQueue = [];
	Memory.taskQueue = [];
	Memory.waitFlags = [];
	
	var source = findNearestSource();
	addTask("p0mining", 3, {"m":1}, [source.id, Game.spawns['Spawn1'].id], null, "refill");
	addTask("p0upgrade", 1, {"bm":1}, [source.id, Game.rooms['sim'].controller.id], null, "upgrade");

	// check if there's a flag (make this a tier 13 request thing)
	var storageFlag = findStorageFlag(Game.rooms['sim']);

	if (storageFlag == null)
	{
		submitTier13Request("Phase 0 entry", "Please place a 'Storage' flag in room", "*", {});
	}
}

// returns flag position
function findStorageFlag(room)
{
	var flags = room.find(FIND_FLAGS);

	for (var flagIndex in flags)
	{
		var flag = flags[flagIndex];
		if (flag.name == "Storage")
		{
			return flag;
		}
	}
	return null;
}

function findNearestSource()
{
	var source = Game.spawns['Spawn1'].pos.findClosestByRange(FIND_SOURCES);
	return source;
}

function p0Spawner()
{
	if (Memory.spawnQueue.length == 0) { return; }
	
	// find highest priority spawn
	var maxIndex = 0;
	var maxPriority = Memory.spawnQueue[0].priority;
	for (var i in Memory.spawnQueue)
	{
		var spawn = Memory.spawnQueue[i];	
		if (spawn.priority > maxPriority) { maxIndex = i; maxPriority = spawn.priority; }
	}

	var maxSpawn = Memory.spawnQueue[maxIndex];
	var maxTask = Memory.taskQueue[maxSpawn.taskindex];

	// spawn it if we can
	if (Game.spawns['Spawn1'].canCreateCreep(maxSpawn.body) == OK)
	{
		var type = maxSpawn.memory.type;
		log("Spawning creep of type '" + type + "'...", 2);
		Game.spawns['Spawn1'].createCreep(maxSpawn.body, null, maxSpawn.memory);

		// handle task counters
		maxTask.active[type]++;
		maxTask.spawning[type]--;
		
		// remove from spawn queue
		Memory.spawnQueue.splice(maxIndex, 1);
	}
}

function p0TaskFulfillmentActuator(creep)
{
	var task = Memory.taskQueue[creep.memory.taskindex];

	if (creep.memory.status == "mining")
	{
		// check for full carry
		if (creep.carry[RESOURCE_ENERGY] == creep.carryCapacity)
		{
			if (task.details == "refill") { creep.memory.status = "refilling"; }
			else if (task.details == "upgrade") { creep.memory.status = "upgrading"; }
			else if (task.details == "build") { creep.memory.status = "building"; }
			log(creep.name + " has finished gathering energy, and will now proceed in " + creep.memory.status, 3);
			p0DetermineTaskFulfillment(creep);
			return;
		}

		// get source structure
		var source = Game.getObjectById(task.locations[0]);
		if (creep.harvest(source) == ERR_NOT_IN_RANGE)
		{
			creep.moveTo(source.pos); // TODO: inefficient
		}
	}
	else
	{
		// check if empty
		if (creep.carry[RESOURCE_ENERGY] == 0) 
		{ 
			creep.memory.status = "mining";
			log(creep.name + " has no energy, going to mine...", 3);
			p0DetermineTaskFulfillment(creep);
			return; 
		}

		if (creep.memory.status == "refilling")
		{
			var spawn = Game.getObjectById(task.locations[1]);
			if (creep.transfer(spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
			{ 
				creep.moveTo(spawn.pos); 
			}
		}
		else if (creep.memory.status == "upgrading")
		{
			var controller = Game.getObjectById(task.locations[1]);
			if (creep.upgradeController(controller) == ERR_NOT_IN_RANGE) { creep.moveTo(controller.pos); }
		}
		
	}
}

// if there are missing slots, add to spawn queue
function p0DetermineTaskFulfillment()
{
	for (var i in Memory.taskQueue)
	{
		var task = Memory.taskQueue[i];
		for (var key in task["types"])
		{
			var required = task["types"][key];
			var fulfillment = task["active"][key] + task["spawning"][key];

			if (fulfillment < required)
			{
				log("Task " + task["name"] + " lacking a '" + key + "', adding to spawn queue");
				addSpawn([MOVE,MOVE,CARRY,WORK], task["priority"], {"type":key, "task":i}, i);
				task["spawning"][key]++;
			}
		}
	}
}

function p0Manager()
{
	// determine state
	
	// determine alive creeps
	var numAlive = Object.keys(Memory.creeps).length;


	
	/*var isMinerAlive = false;
	var isBuilder0Alive = false;
	var isBuilder1Alive = false;

	for (var creepIndex in Memory.creeps)
	{
		var creep = Memory.creeps[creepIndex];
		if (creep.name == "0_m") { isMinerAlive = true; }
		if (creep.name == "0_bm0") { isMinerAlive = true; }
	}*/

	p0DetermineTaskFulfillment();
	p0Spawner();
	
	for (var creepName in Memory.creeps)
	{
		var creep = Game.creeps[creepName];
		p0TaskFulfillmentActuator(creep);
	}

	// determine number alive of each type


	// spawn 0_m if nobody alive
	/*if (numAlive == 0)
	{
		log("No workers found, adding miner and two builder miners to spawn queue");

		Memory.spawnQueue.push_back("m");
		Memory.spawnQueue.push_back("bm");
		Memory.spawnQueue.push_back("bm");
		
		//log("Spawning phase 0 miner...", 2);
		//Game.spawns['Spawn1'].createCreep([MOVE,MOVE,WORK,CARRY], "0_m");
	}*/
}

function addTask(name, priority, types, locations, endType, details)
{
	var active = {};
	for (var key in types) { active[key] = 0; }
	var spawning = {};
	for (var key in types) { spawning[key] = 0; }
	
	var task = {
		"name":name,
		"priority":priority,
		"types":types,
		"active":active,
		"spawning":spawning,
		"locations":locations,
		"endType":endType,
		"details":details
	};
	Memory.taskQueue.push(task);
}

function addSpawn(body, priority, memory, taskindex)
{
	memory.taskindex = taskindex;
	var spawn = {
		"body":body,
		"priority":priority,
		"memory":memory,
		"taskindex":taskindex
	};
	Memory.spawnQueue.push(spawn);
}
