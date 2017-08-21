//================================================================
//	MAIN
//================================================================

// ---- DATA ----
var rooms = ["sim"];
var VERSION = "0.1.0";
var VERSION_DATE = "8/19/2017";

// ---- TEMP STORAGE ----

module.exports.loop = function()
{
	ticCleanup();
	
	// check that Cassandra is initialized
	if (Memory.Cassandra == null) 
	{ 
		warning("Cassandra not initialized..."); 
		initializeCassandra();
	}

	if (Memory.Cassandra.phase == 0) { p0Manager(); }

	
	//if (Memory.testing == true) { runTests(); }
}


function ticCleanup()
{
	// delete any dead creeps from memory
	for (var i in Memory.creeps) { if (!Game.creeps[i]) { delete Memory.creeps[i]; } }
}
