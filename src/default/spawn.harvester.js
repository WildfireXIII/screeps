// costs:
// - TOUGH - 10
// - CARRY - 50
// - MOVE - 50
// - ATTACK - 80
// - WORK - 100
// - RANGED_ATTACK - 150
// - HEAL - 250
// - CLAIM - 600

// with 5 extensions: 550 available


// simple worker = MOVE MOVE WORK CARRY (50 50 100 50 = 250)

// advanced worker = WORK WORK CARRY CARRY MOVE MOVE MOVE MOVE (100 100 50 50 50 50 50 50 = 500)

// when roads are built and movement is less of an issue:
// shortcut worker = WORK WORK WORK CARRY CARRY CARRY MOVE (100 100 100 50 50 50 50 = 500)


// spawn a worker!
module.exports =
{
	spawn(spawner)
	{
		// if have enough energy, make a big guy!
		if (spawner.room.energyAvailable >= 500)
		{
			spawner.createCreep([MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, WORK, WORK], null, { role: "worker_advanced", task: "NOTASK"});
		}
		// if only spawn, simple worker, which only costs 250
		else 
		{
			spawner.createCreep([MOVE, MOVE, WORK, CARRY], null, { role: "worker", task: "NOTASK" });
		}
	}
};
