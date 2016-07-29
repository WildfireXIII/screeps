var roleHarvester = require('role.harvester');
var spawnHarvester = require('spawn.harvester');
var constructionManager = require('manager.construction');

var HOME_ROOM = Game.rooms["W24N17"];

module.exports.loop = function () 
{
	//Game.notify("Hello there!");
    // remove dead creeps from memory (first so that it doesn't remove memory from creeps just spawning!!)
    for(var i in Memory.creeps) 
    {
		if(!Game.creeps[i]) { delete Memory.creeps[i]; }
    }
	
	var numAlive = 0;

	// run roles
    for(var name in Game.creeps) 
    {
        var creep = Game.creeps[name];
        // pick up any creeps that aren't spawning with memory properly
        if (creep.memory.role == "" || typeof creep.memory.role === "undefined") { creep.memory.role = "harvester"; creep.memory.task = "NOTASK"; Game.notify("SPAWN DIDN'T WORK"); console.log("SPAWN DIDN'T WORK"); }

		if (creep.memory.role == "harvester" || creep.memory.role == "worker_advanced" || creep.memory.role == "worker") { roleHarvester.run(creep); }

        if (creep.hits > 0) { numAlive++; }
        else { console.log("DEAD CREEP"); }
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
				//Game.notify("Attacking hostile! Tick " + Game.time);
			}
		}
    }

    if (numAlive < 10)
    {
		spawnHarvester.spawn(Game.spawns.AlphaSpawn);
    }

    constructionManager.decideBuild(HOME_ROOM);

}

