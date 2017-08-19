









// -- old --

//================================================================
//  CNC (Tier 13)
//================================================================

global.functionList = [
	"help",
	"toggleTesting",
	"tier13RequestList"
];

global.help = function() { console.log(functionList); }

global.toggleTesting = function()
{
	if (Memory.testing == true) { Memory.testing = false; console.log("Testing is now off"); }
	else { Memory.testing = true; console.log("Testing is now on"); }
};

global.tier13RequestList = function()
{
	for (var entry_i in Memory.Tier13Requests)
	{
		var entry = Memory.Tier13Requests[entry_i];

		var displayString = entry_i + ". (" + entry.urgency + ") [" + entry.source + "::" + entry.time + "] - " + entry.text;
		console.log(displayString);
	}

	if (Memory.Tier13Request.length == 0)
	{
		console.log("No requests currently...");
	}
};


 // TODO: need a function to mark tier 13 request complete, and then handle
 // running whatever code needs to be run afterwards

global.tier13CompleteRequest = function(index)
{
	Memory.Tier13Requests.splice(index, 1);
	console.log("Marking request " + index + " as completed...");
}

// -- /old --
