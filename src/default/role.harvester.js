// tasks:
// - NOTASK
// - harvest
// - fillspawn
// - upgrade

module.exports = 
{
	run(creep) 
	{
		// if no task assigned, assign a task
		if (creep.memory.task == "NOTASK")
		{
			/*if (creep.carry.energy < creep.carryCapacity) { creep.memory.task = "harvest"; }
			else if (Game.spawns.AlphaSpawn.energy < Game.spawns.AlphaSpawn.energyCapacity) { creep.memory.task = "fillspawn"; }
			//else if (creep.room.find(FIND_CONSTRUCTION_SITES)[0].progress < creep.room.find(FIND_CONSTRUCTION_SITES)[0].progressTotal) { creep.memory.task = "build"; }
			else { creep.memory.task = "upgrade"; }*/

			if (creep.carry.energy < creep.carryCapacity / 2) { creep.memory.task = "harvest"; }
			else
			{
				var task = require("manager.roles").getNextTask(creep.room);
				creep.memory.task = task;
				switch (task)
				{
					case "fillextensions":
						creep.memory.taskvalue = Memory.TaskQueue.TaskValues[2];
						break;
					case "build":
						creep.memory.taskvalue = Memory.TaskQueue.TaskValues[3];
						break;
					case "repair":
						creep.memory.taskvalue = Memory.TaskQueue.TaskValues[4];
						break;
				}
			}
			creep.say(creep.memory.task);
		}

		// carry out assigned task
		if (creep.memory.task == "harvest")
		{
			var sources = creep.room.find(FIND_SOURCES);
			var source = sources[0];
			if (sources[0].energy == 0) source = sources[1];
			if (creep.harvest(source) == ERR_NOT_IN_RANGE) { creep.moveTo(source); }
			if (creep.carry.energy == creep.carryCapacity) { creep.memory.task = "NOTASK"; }
		}
		else if (creep.memory.task == "fillspawn")
		{
			if (creep.transfer(Game.spawns.AlphaSpawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) { creep.moveTo(Game.spawns.AlphaSpawn); }
			if (Game.spawns.AlphaSpawn.energy == Game.spawns.AlphaSpawn.energyCapacity) { creep.memory.task = "NOTASK"; }
		}
		else if (creep.memory.task == "fillextensions")
		{
			var extension = Game.getObjectById(creep.memory.taskvalue);
			if (creep.transfer(extension, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) { creep.moveTo(extension); }
			if (extension == null || ((extension.structureType == STRUCTURE_EXTENSION || extension.structureType == STRUCTURE_TOWER) && extension.energy == extension.energyCapacity) || (extension.store == extension.storeCapacity && extension.structureType == STRUCTURE_STORAGE)) { creep.memory.task = "NOTASK"; }
		}
		else if (creep.memory.task == "upgrade")
		{
			if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) { creep.moveTo(creep.room.controller); }
		}
		else if (creep.memory.task == "build")
		{
			var site = Game.getObjectById(creep.memory.taskvalue);
			if (creep.build(site) == ERR_NOT_IN_RANGE) { creep.moveTo(site); }
			if (site == null || site.progress == site.progressTotal) { creep.memory.task = "NOTASK"; }
		}
		else if (creep.memory.task == "repair")
		{
			var site = Game.getObjectById(creep.memory.taskvalue);
			//console.log("mem: " + creep.memory.taskvalue);
			//console.log("site: " + site);
			if (creep.repair(site) == ERR_NOT_IN_RANGE) { creep.moveTo(site); }
			if (site == null || site.hits == site.hitsMax) { creep.memory.task = "NOTASK"; }
		}

		// if no energy, stop doing whatever doing so can get energy
		if (creep.carry.energy == 0 && creep.memory.task != "harvest") { creep.memory.task = "NOTASK"; }

		//console.log(HOME_ROOM);
	}
};
