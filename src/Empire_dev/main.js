function doThing(creep)
{
	/*console.log(creep.carry.energy + " " + creep.carryCapacity);
	if (creep.carry.energy < creep.carryCapacity)
	{*/
		var sources = creep.room.find(FIND_SOURCES);
		if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
			creep.moveTo(sources[0]);
		}
	/*}
	else if (Game.spawns.AlphaSpawn.energy < Game.spawns.AlphaSpawn.energyCapacity)
	{
		if (creep.transfer(Game.spawns.AlphaSpawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) { creep.moveTo(Game.spawns.AlphaSpawn); }
	}
	else
	{
		var structures = creep.room.find(FIND_STRUCTURES);
		for (var i in structures)
		{
			var structure = structures[i];
			if (structure.structureType == STRUCTURE_EXTENSION && structure.energy < structure.energyCapacity)
			{
				if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) { creep.moveTo(structure); }
			}
		}
	}*/
}

module.exports.loop = function () {
	for (var name in Game.creeps)
	{
		var creep = Game.creeps[name];
		doThing(creep);
	}
	
    // handle towers
    var structures = Game.spawns.AlphaSpawn.room.find(FIND_STRUCTURES);
    for (var index in structures)
    {
		var structure = structures[index];
		if (structure.structureType == STRUCTURE_TOWER)
		{
			var hostiles = Game.spawns.AlphaSpawn.room.find(FIND_HOSTILE_CREEPS);
			if (hostiles[0])
			{
				structure.attack(hostiles[0]);
			}
		}
    }
}

