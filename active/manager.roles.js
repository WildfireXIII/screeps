//tasks:
// - upgrade [0]
// - fillspawn [1]
// - fillextensions [2]
// - build [3]
// - repair [4]

var REPAIR_ROADS = false;

module.exports =
{
	// for now just returns first unfinished construction site it finds
	findUnfinishedConstruction(room)
	{
		var sites = room.find(FIND_CONSTRUCTION_SITES);
		if (sites.length > 0 && sites[0].progress < sites[0].progressTotal) // eventually change back so it does do roads too. 
		{
			return sites[0];
		}
		return -1;
	},

	// only checks for stuff that's under half health 
	findInNeedOfRepair(room)
	{
		var structures = room.find(FIND_STRUCTURES);
		for (var index in structures)
		{
			structure = structures[index];
			//console.log(structure);
			//console.log(structure.type + " " + structure.hits + " " + structure.hitsMax);
			if ((structure.hits < structure.hitsMax / 2 && structure.structureType == STRUCTURE_ROAD) ||
				(structure.hits < 100000 && structure.structureType == STRUCTURE_WALL))
			{
				//if (!REPAIR_ROADS && structure.structureType == STRUCTURE_ROAD) { continue; }
				return structure;
			}
		}
		return -1;
	},

	// for now just returns first unfilled extension it finds 
	// (also checks for unfilled towers)
	findUnfilledExtension(room)
	{
		var structures = room.find(FIND_STRUCTURES);
		for (var structureIndex in structures)
		{
			structure = structures[structureIndex];
			//console.log(structure.structureType + ": " + structure.energy + " " + structure.store);
			if (((structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity) || (structure.structureType == STRUCTURE_STORAGE && structure.store < structure.storeCapacity))
			{
				return structure;
			}
		}
		return -1;
	},

	updateTaskQueue(room)
	{
		// set up task queue data structure
		Memory.TaskQueue = {};
		Memory.TaskQueue.Tasks = [];
		Memory.TaskQueue.TaskWorkerCounts = [];
		Memory.TaskQueue.TaskValues = []; // holds ids as necessary
		Memory.TaskQueue.Priorities = []; // 1 means prioritiy 0 means no

		// can always upgrade if nothing else!
		Memory.TaskQueue.Tasks.push("upgrade");
		Memory.TaskQueue.TaskValues.push(-1);
		Memory.TaskQueue.TaskWorkerCounts.push(0);
		Memory.TaskQueue.Priorities.push(1);
		
		// spawn needs energy?
		Memory.TaskQueue.Tasks.push("fillspawn");
		Memory.TaskQueue.TaskValues.push(-1);
		Memory.TaskQueue.TaskWorkerCounts.push(0);
		if (Game.spawns.AlphaSpawn.energy < Game.spawns.AlphaSpawn.energyCapacity)
		{
			Memory.TaskQueue.Priorities.push(1);
		}
		else { Memory.TaskQueue.Priorities.push(0); } 

		// extensions need energy?
		Memory.TaskQueue.Tasks.push("fillextensions");
		Memory.TaskQueue.TaskWorkerCounts.push(0);
		var extension = this.findUnfilledExtension(room);
		if(extension != -1)
		{
			Memory.TaskQueue.TaskValues.push(extension.id);
			Memory.TaskQueue.Priorities.push(1);
		}
		else 
		{ 
			Memory.TaskQueue.TaskValues.push(-1);
			Memory.TaskQueue.Priorities.push(0); 
		} 
		

		// get any construction sites in the room
		Memory.TaskQueue.Tasks.push("build");
		Memory.TaskQueue.TaskWorkerCounts.push(0);
		var site = this.findUnfinishedConstruction(room);
		if (site != -1)
		{
			Memory.TaskQueue.TaskValues.push(site.id);
			Memory.TaskQueue.Priorities.push(1);
		}
		else 
		{ 
			Memory.TaskQueue.TaskValues.push(-1);
			Memory.TaskQueue.Priorities.push(0); 
		}

		// get any structures in the room
		Memory.TaskQueue.Tasks.push("repair");
		Memory.TaskQueue.TaskWorkerCounts.push(0);
		var repairSite = this.findInNeedOfRepair(room);
		if (repairSite != -1)
		{
			Memory.TaskQueue.TaskValues.push(repairSite.id);
			Memory.TaskQueue.Priorities.push(1);
		}
		else
		{
			Memory.TaskQueue.TaskValues.push(-1);
			Memory.TaskQueue.Priorities.push(0);
		}

		// find worker task counts
		for (var name in Game.creeps)
		{
			var creep = Game.creeps[name];
			if (creep.memory.task == "upgrade") { Memory.TaskQueue.TaskWorkerCounts[0]++; }
			else if (creep.memory.task == "fillspawn") { Memory.TaskQueue.TaskWorkerCounts[1]++; }
			else if (creep.memory.task == "fillextensions") { Memory.TaskQueue.TaskWorkerCounts[2]++; }
			else if (creep.memory.task == "build") { Memory.TaskQueue.TaskWorkerCounts[3]++; }
			else if (creep.memory.task == "repair") { Memory.TaskQueue.TaskWorkerCounts[4]++; }
		}
	},
	
	// returns task for creep
	getNextTask(room)
	{
		this.updateTaskQueue(room);
		// priority 1 - at least one worker on upgrade
		if (Memory.TaskQueue.TaskWorkerCounts[0] == 0) { return "upgrade"; }
		
		// priority 2 - fill spawn if not full (2 workers)
		if (Memory.TaskQueue.Priorities[1] == 1 && Memory.TaskQueue.TaskWorkerCounts[1] < 2) { return "fillspawn" }
		
		// priority 3 - fill extensions (as long as there are available workers)
		if (Memory.TaskQueue.Priorities[2] == 1) { return "fillextensions"; }

		// priority 4 - repair any structures as necessary (2 workers)
		if (Memory.TaskQueue.Priorities[4] == 1 && Memory.TaskQueue.TaskWorkerCounts[4] < 2) { return "repair"; }

		// priority 5 - build stuff (2 workers)
		if (Memory.TaskQueue.Priorities[3] == 1 && Memory.TaskQueue.TaskWorkerCounts[3] < 2) { return "build"; }
		
		// if no building necessary, those 2 workers should help repair
		if (Memory.TaskQueue.Priorities[3] == 0 && Memory.TaskQueue.Priorities[4] == 1 && Memory.TaskQueue.TaskWorkerCounts[4] < 4) { return "repair"; }

		// priority 6 - anyone else just help upgrade
		return "upgrade";
	}
};
