var actuation_modules = require("actuation_modules");

module.exports.loop = function()
{
	//console.log("Hello world!")
	


	var actuationRooms = Memory.actuationRooms;
	var actionPaths = Memory.actionPaths;
	
	// define which rooms to run actuation in
	if (actuationRooms == undefined) { Memory.actuationRooms = []; }
	if (actuationRooms.length == 0) { Memory.actuationRooms = ["sim"]; }

	// set up testing action paths
	if (actionPaths == undefined) { Memory.actionPaths = {}; }
	if (Object.keys(actionPaths).length == 0)
	{
		//Memory.actionPaths["sim"] = ["s1 w"]
	}

	actuation_modules.RunActuators()
}
