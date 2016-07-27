// module for quick console functionality
module.exports = 
{
	api()
	{
		console.log("report() - lists creeps and current jobs")
		console.log("structureStatus() - lists all structures in main room and health")
		console.log("ticksToTime(ticks) - returns the approximate time in m:ss of ticks") 
	},

	greet()
	{
		console.log("Hello world!");
	},

	report()
	{
		var results = "";
		for (var creepName in Game.creeps)
		{
			creep = Game.creeps[creepName];
			results += creep.name + " role: '" + creep.memory.role + "' task: '" + creep.memory.task + "' life: " + this.ticksToTime(creep.ticksToLive) + "\n";
		}
		console.log(results);
	},


	structureStatus()
	{
		var results = "";
		var structures = Game.spawns.AlphaSpawn.room.find(FIND_STRUCTURES);
		for (var index in structures)
		{
			structure = structures[index];
			results += structure.structureType + ": " + structure.hits + "|" + structure.hitsMax + "\n";
		}
		console.log(results);
	},

	ticksToTime(ticks)
	{
		ticks *= 2;
		var mins = parseInt(ticks / 60);
		if (mins > 0) { var secs = parseInt(ticks % mins); }
		else { var secs = ticks; }

		if (secs < 10) { secs = "0" + secs; }
		return mins + ":" + secs;
	},

	randomtest() { console.log("Well, hello there!"); }
};
