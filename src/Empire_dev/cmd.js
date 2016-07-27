module.exports =
{
	spawn5Work()
	{
		return Game.spawns.AlphaSpawn.createCreep([WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE/*, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE*/]);
		//WORK*5 = 500
		//CARRY*5 = 250
		
		//MOVE*10 = 500
		//1250

		//MOVE*1 = 50
		//800
	},
	spawn1Work()
	{
		return Game.spawns.AlphaSpawn.createCreep([WORK, CARRY, MOVE]);
	}
};
