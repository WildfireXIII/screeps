function enterP0()
{
	announce("ENTERING PHASE 0");
	Memory.Cassandra.phase = 0;

	Memory.spawnQueue = [];
	Memory.taskQueue = [];
	Memory.waitFlags = {};
	
	var source = findNearestSource();
	addTask("p0mining", 2, {"bm":1}, [source.id, Game.spawns['Spawn1'].id], null, false, "refill");
	addTask("p0upgrade", 1, {"bm":1}, [source.id, Game.rooms['sim'].controller.id], null, false, "upgrade");

	// check if there's a flag (make this a tier 13 request thing)
	var storageFlag = findStorageFlag(Game.rooms['sim']);

	if (storageFlag == null)
	{
		submitTier13Request("P0", "Please place a 'Storage' flag in room", "*", "storage", {});
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

function planBasicStorage()
{
	log("Placing container construction site");
	var storageFlag = findStorageFlag(Game.rooms['sim']);
	debug(storageFlag, "");

	// create the construction site
	var result = Game.rooms['sim'].createConstructionSite(storageFlag.pos.x, storageFlag.pos.y, STRUCTURE_CONTAINER, "rstore_0");  // NOTE: it auto gets pos from storageflag
	debug("Result: " + result, "");

	
	Memory.waitFlags.storageConstructionSite = false;
	
}

// NOTE: watches always run every tick, even if the handlers don't
function p0WaitFlagsWatch()
{
	if (Memory.waitFlags.storageConstructionSite != undefined)
	{
		var storageFlag = findStorageFlag(Game.rooms['sim']);
		var site = Game.rooms['sim'].lookForAt(LOOK_CONSTRUCTION_SITES, storageFlag.pos.x, storageFlag.pos.y)[0];
		if (site != undefined) { Memory.waitFlags.storageConstructionSite = true; }
	}
}

function p0WaitFlags()
{
	if (Memory.waitFlags.storageConstructionSite)
	{
		log("Storage construction site wait flag handled");
		
		// get construction site's ID
		var storageFlag = findStorageFlag(Game.rooms['sim']);
		var site = Game.rooms['sim'].lookForAt(LOOK_CONSTRUCTION_SITES, storageFlag.pos.x, storageFlag.pos.y)[0];
		debug(site, "");
		
		// add the task 
		var source = findNearestSource();
		addTask("p0BuildStorage0", 3, {"bm":1}, [source.id, site.id], null, false, "build");

		Memory.waitFlags.storageConstructionSite = undefined;
	}
}

// TODO: it looks like this doesn't have handling for if the highest priority
// creep can't be spawned
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

function p0Tier13Completion(tag)
{
	if (tag == "storage")
	{
		log("Tier 13 has granted storage flag");
		planBasicStorage();
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
			var transferAttempt = creep.transfer(spawn, RESOURCE_ENERGY);
			if (transferAttempt == ERR_NOT_IN_RANGE) { creep.moveTo(spawn.pos); }
			else if (transferAttempt == ERR_FULL)
			{
				task.blocked = true;
				//creep.task
			}
		}
		else if (creep.memory.status == "upgrading")
		{
			var controller = Game.getObjectById(task.locations[1]);
			if (creep.upgradeController(controller) == ERR_NOT_IN_RANGE) { creep.moveTo(controller.pos); }
		}
		else if (creep.memory.status == "building")
		{
			var site = Game.getObjectById(task.locations[1]);
			if (creep.build(site) == ERR_NOT_IN_RANGE) { creep.moveTo(site.pos); }
		}
	}
}

/*function p0ReassignCreep(creep)
{
	// first check for any jobs missing
}*/

function findCreepsOfTask(taskindex)
{
	var creeps = [];
	for (var creepName in Memory.creeps)
	{
		var creep = Memory.creeps[creepName];
		if (creep.taskindex == i)
		{
			creeps.push(creep);
		}
	}
	return creeps;
}

// if there are missing slots, add to spawn queue (or divert from tasks with
// extra, if possible)
function p0DetermineTaskFulfillment()
{
	var prioritySurplus = {}; // ones who don't have a job to do at all (MUST be assigned to something else)
	var surplus = {}; // optionally can draw from, if task priority is higher

	var demand = {};
	var demandPriority = [];
	
	// surplus scan
	for (var i in Memory.taskQueue)
	{
		var task = Memory.taskQueue[i];

		if (task.blocked)
		{
			var hasSurplus = false;
			for (var key in task.active)
			{
				if (task.active[key] > 0)
				{
					log("Active '" + key + "' workers found on a blocked task...");
					hasSurplus = true;
				}
			}
			
			if (hasSurplus)
			{
				// find all creeps associated with this task
				/*for (var creepName in Memory.creeps)
				{
					creep = Memory.creeps[creepName];
					if (creep.taskindex == i)
					{
						var type = creep.type;
						if (prioritySurplus[type] == undefined) { prioritySurplus[type] == []; }
						prioritySurplus[type].push(creep);
						log(creepName + " added to priority surplus list", 3);
						task.active[type]--;
					}
				}*/
				var creeps = findCreepsOfTask(i);
				for (var j in creeps)
				{ 
					var creep = creeps[j];
					
					var type = creep.type;
					if (prioritySurplus[type] == undefined) { prioritySurplus[type] == []; }
					prioritySurplus[type].push(creep);
					log(creepName + " added to priority surplus list", 3);
					task.active[type]--;
				}
			}
			continue;	
		}

		for (var key in task["types"])
		{
			var required = task["types"][key];
			var fulfillment = task["active"][key] + task["spawning"][key];
			
			// check if this task has regular surplus on it
			if (fulfillment > required)
			{
				var creeps = findCreepsOfTask(i);

				for (var j in creeps)
				{
					var creep = creeps[j];
					var type = creep.type;
					if (surplus[type] == undefined) { surplus[type] == []; }
					surplus[type].push(creep);
				}
			}
			
			// add demand
			if (fulfillment < required)
			{
				//log("Task " + task["name"] + " lacking a '" + key + "', adding to spawn queue");
				log("Task " + task["name"] + " lacking a '" + key + "'");
				//if (demand[i] == undefined) { demand[i] = {"PRIORITY":task.priority}; }
				if (demand[i] == undefined) { demand[i] = {}; }
				// find place in demand priorites list
				for (var j = 0; j < demandPriority.length; j++)
				{
					if (task.priority >= demandPriority[j].priority)
					{
						demandPriority.splice(j, 0, {"priority":task.priority, "id":i});
						break;
					}
				}
				// if demand priorities list is empty, just add it?
				if (demandPriority.length == 0) { demandPriority = [{"priority":task.priority, "id":i}]; }
				
				demand[i][key] = required - fulfillment;

				
				/*addSpawn([MOVE,MOVE,CARRY,WORK], task["priority"], {"type":key, "task":i}, i);
				task["spawning"][key]++;*/
			}
		}
	}

	// fulfill demand
	debug("About to fill demand");
	for (var i = 0; i < demandPriority.length; i++)
	{
		var taskID = demandPriority[i].id
		var taskDemand = demand[taskID];
		var task = Memory.taskQueue[taskID];

		// find out how much of each type of creep this task needs
		for (var key in taskDemand)
		{
			var count = taskDemand[key];
			log("Task " + task.name + " is lacking " + count + " '" + key + "'...");

			while (count > 0)
			{
				// check prioritySurplus first
				if (prioritySurplus[key] != undefined)
				{
					var creep = prioritySurplus[key][0];
					creep.taskindex = taskID;
					task.active[key]++;
					prioritySurplus.splice(0, 1);
					log(creep.name + " reassigned from priority surplus to task " + task.name, 3);
					count--;
					continue;
				}

				// TODO: assign from surplus
				//if (surplus
				

				log("No surplus found to fulfill task " + task.name + " role '" + key + "', adding to spawn queue");
				addSpawn([MOVE,MOVE,CARRY,WORK], task.priority, {"type":key, "task":taskID}, taskID);
				task.spawning[key]++;
				count--;
			}
		}
	}
	
	/*var highestTask = Memory.taskQueue[0];
	var highestPriority = highestTask.priority;
	// find highest priority demand
	for (var i = 1; i < Memory.taskQueue.length; i++)
	{
		if (Memory.taskQueue[i].priority > highestPriority)
		{
			highestTask = Memory.taskQueue[i];
			highestPriority = highestTask.priority;
		}
	}*/
	
	// assign any remaining priority surplus (to priority demands)
	for (var key in prioritySurplus)
	{
		for (var i = 0; i < prioritySurplus[key].length; i++)
		{
			var creep = prioritySurplus[key];
			for (var j in Memory.taskQueue)
			{
				var task = Memory.taskQueue[j];
				if (task.types.indexOf(key) != -1 && !task.blocked)
				{
					creep.taskindex = j;
					creep.task.active[key]++;
					log(creep.name + " reassigned from priority surplus to task " + task.name, 3);
					continue;
				}
			}
		}
	}
}

// TODO: check blocks function

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
	
	p0WaitFlagsWatch();
	p0WaitFlags();
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

function addTask(name, priority, types, locations, endType, blocked, details)
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
		"blocked":blocked,
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
