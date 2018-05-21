









// -- old --

//================================================================
//  CNC (Tier 13)
//================================================================

global.functionList = [
	"help()",
	"toggleTesting()",
	"initialize()",
	"tier13RequestList()",
	"tier13CompleteRequest(index)"
];

global.help = function() { console.log(functionList); }

global.toggleTesting = function()
{
	if (Memory.testing == true) { Memory.testing = false; console.log("Testing is now off"); }
	else { Memory.testing = true; console.log("Testing is now on"); }
};

global.initialize = function()
{
	initializeCassandra();
}

global.tier13RequestList = function()
{
	for (var entry_i in Memory.Tier13Requests)
	{
		var entry = Memory.Tier13Requests[entry_i];

		var displayString = entry_i + ". (" + entry.urgency + ") [" + entry.source + "::" + entry.time + "] - " + entry.text;
		console.log(displayString);
	}

	if (Memory.Tier13Requests.length == 0)
	{
		console.log("No requests currently...");
	}
};


 // TODO: need a function to mark tier 13 request complete, and then handle
 // running whatever code needs to be run afterwards

global.tier13CompleteRequest = function(index)
{
	var request = Memory.Tier13Requests[index];
	Memory.Tier13Requests.splice(index, 1);
	log("Marking request " + index + " as completed...", 4);

	if (request.source == "P0") { p0Tier13Completion(request.tag); }
}

// -- /old --
