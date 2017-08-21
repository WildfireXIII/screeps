function enterP0()
{
	announce("ENTERING PHASE 0");
	Memory.Cassandra.phase = 0;

	Memory.spawnQueue = [];
}

/*

Stage 0 

*/
function p0Manager()
{
	// determine state
	
	// determine number of alive creeps
	var numAlive = Object.keys(Memory.creeps).length;

	//debug(numAlive);

	// spawn 0_m if nobody alive
	if (numAlive == 0)
	{
		log("No workers found, adding miner to spawn queue");
		
		log("Spawning phase 0 miner...", 2);
		Game.spawns['Spawn1'].createCreep([MOVE,MOVE,WORK,CARRY], "0_m");
	}
	//debug(rooms[0]);
}

