var hasOwnProperty = Object.prototype.hasOwnProperty;

function isEmpty(obj) {

    // null and undefined are "empty"
    if (obj == null) return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;

    // If it isn't an object at this point
    // it is empty, but it can't be anything *but* empty
    // Is it empty?  Depends on your application.
    if (typeof obj !== "object") return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
}

function doThing(creep)
{
    if (creep.memory.task == "NOTASK")
    {
        if (creep.carry == 0) { creep.memory.task = "harvest"; }
        else if (Game.spawns.AlphaSpawn.energy < Game.spawns.AlphaSpawn.energyCapacity) { creep.memory.task = "fillspawn"; }
        else
        {
        	var structures = creep.room.find(FIND_STRUCTURES);
    		for (var structureIndex in structures)
    		{
    			var structure = structures[structureIndex];
    			if (((structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity))
    			{
    				creep.memory.task="fill";
    				creep.memory.target=structure.id;
    			}
    		}
        }
    }
    //creep.say(creep.memory.task);
    
    
    if (creep.memory.task == "WAR")
    {
        var hostiles = Game.spawns.AlphaSpawn.room.find(FIND_HOSTILE_CREEPS);
        if (hostiles[0])
        {
		    var target = hostiles[0];
		    creep.moveTo(target);
		    creep.attack(target);
        }
        else
        {
            creep.moveTo(Game.flags.rally);
        }
    }
    else if (creep.memory.task == "harvest")
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
	else if (creep.memory.task == "fill")
	{
	    	var extension = Game.getObjectById(creep.memory.target);
			if (creep.transfer(extension, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) { creep.moveTo(extension); }
			if (extension == null || ((extension.structureType == STRUCTURE_EXTENSION || extension.structureType == STRUCTURE_TOWER) && extension.energy == extension.energyCapacity) || (extension.store == extension.storeCapacity && extension.structureType == STRUCTURE_STORAGE)) { creep.memory.task = "NOTASK"; }
	}
	if (creep.memory.task == "" || creep.memory.task == null) { creep.memory.task == "NOTASK"; }
	if (typeof creep.memory.task === null) { creep.memory.task == "NOTASK";  console.log("CREEP UNDEFINED"); }
  
    if (isEmpty(creep.memory)) { creep.memory["task"] = "NOTASK"; }
	if (creep.carry.energy == 0 && creep.carryCapacity > 0) { creep.memory.task = "harvest"; }
}

module.exports.loop = function () {
    
    
    for(var i in Memory.creeps) 
    {
		if(!Game.creeps[i]) { delete Memory.creeps[i]; }
    }
	
	var numAlive = 0;
	
	
	
	for (var name in Game.creeps)
	{
		var creep = Game.creeps[name];
		numAlive++;
		doThing(creep);
	}
	
	var hostiles = Game.spawns.AlphaSpawn.room.find(FIND_HOSTILE_CREEPS);
	var target = hostiles[0];
	if (hostiles[0])
	{
	    TARGET_PRESENT = true;
	    Game.spawns.AlphaSpawn.createCreep([ATTACK, MOVE], null, {task: 'WAR'});
	}
    // handle towers
    var structures = Game.spawns.AlphaSpawn.room.find(FIND_STRUCTURES);
    var towerIndex = 0;
    var TARGET_PRESENT = false;
    for (var index in structures)
    {
		var structure = structures[index];
		if (structure.structureType == STRUCTURE_TOWER)
		{
		  
		    if (hostiles[0])
		    {
			    for (var i in hostiles)
			    {
			        for (var j in hostiles[i].body)
			        {
			            if (hostiles[i].body[j].type == "heal" && towerIndex == 0) 
			            { 
			                
			                target = hostiles[i]; 
			                console.log("TARGETING HEALER"); 
			                
			            }
			        }
			    }

				structure.attack(target);
			  towerIndex++;
			}
		}
    }
    
    
    if (TARGET_PRESENT == true)
    {
        Game.spawns.AlphaSpawn.createCreep([ATTACK, MOVE], null, {task: 'WAR'});
    }
    if (numAlive < 5)
    {
        Game.spawns.AlphaSpawn.createCreep([WORK, CARRY, MOVE, MOVE], null, {task: 'harvest'});
    }
    else if (numAlive < 15)
    {
        Game.spawns.AlphaSpawn.createCreep([ATTACK, MOVE], null, {task: 'WAR'});
    }
}

