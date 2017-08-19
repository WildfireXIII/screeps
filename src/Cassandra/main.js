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
	// check that Cassandra is initialized
	if (Memory.Cassandra == null) 
	{ 
		warning("Cassandra not initialized..."); 
		initializeCassandra();
	}



	
	//if (Memory.testing == true) { runTests(); }
	//hello();
}


function hello()
{
	console.log("Hello there!");
}
