function enterP0()
{
	announce("ENTERING PHASE 0");
	Memory.Cassandra.phase = 0;

	Memory.spawnQueue = [];
	Memory.taskQueue = [];
	Memory.waitFlags = [];
	
	addTask("p0mining", 3, {"m":1}, [findNearestSource()], null);
	addTask("p0upgrade", 1, {"bm":1}, [Game.rooms[rooms[1]], null);

	// check if there's a flag (make this a tier 13 request thing)
}

function findNearestSource()
{
	var source = Game.spawn['Spawn1'].pos.findClosestByRange(FIND_SOURCES);
	return source.pos;
}

function p0Spawner()
{
	
}

// if there are missing slots, add to spawn queue
function p0DetermineTaskFulfillment()
{
	
	for (var i in Memory.taskQueue)
	{
		var task = Memory.taskQueue[i];
		for (var key in task["types"])
		{
			
		}
	}
}

function p0Manager()
{
	// determine state
	
	// determine alive creeps
	var numAlive = Object.keys(Memory.creeps).length;


	
	var isMinerAlive = false;
	var isBuilder0Alive = false;
	var isBuilder1Alive = false;

	for (var creepIndex in Memory.creeps)
	{
		var creep = Memory.creeps[creepIndex];
		if (creep.name == "0_m") { isMinerAlive = true; }
		if (creep.name == "0_bm0") { isMinerAlive = true; }
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

function addTask(name, priority, types, locations, endType)
{
	var active = {};
	for (var key in types) { active[key] = 0; }
	
	var task = {
		"name":name,
		"priority":priority,
		"types":types,
		"active":active,
		"locations":locations,
		"endType":endType
	};
}
