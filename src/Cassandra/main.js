//================================================================
//	MAIN
//================================================================

// ---- DATA ----
var rooms = ["sim"];

// ---- TEMP STORAGE ----

module.exports.loop = function()
{
	if (Memory.testing == true) { runTests(); }
	//hello();
}


function hello()
{
	console.log("Hello there!");
}
