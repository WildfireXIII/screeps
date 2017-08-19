

// -- old --


//================================================================
//	TIER 1
//================================================================




// ---- ANALYSIS ----

// determine and save points of interest
function runT1POI(room)
{
	// make sure to only run this map analysis once
	//if (room.memory.t1poi == true) { return; }
	//room.memory.t1poi = true;
	
	// fill sources with list of room positions
	const sources = room.find(FIND_SOURCES); 
	for (var i in sources) 
	{ 
		// find all energy sources
		console.log("Source: " + sources[i]); 
		var source = sources[i];
		var spx = source.pos.x;
		var spy = source.pos.y;

		// check all squares around it for available (room positions)
		var free = findFreeSurrounding(room, source.pos.x, source.pos.y);
		
		// determine connected parts
		var freeSeries = breakIntoConnecting(free);
		for (var series in freeSeries)
		{
			console.log("Series:");
			for (var entry in freeSeries[series]) { console.log("\t" + freeSeries[series][entry]); }
		}
		
		if (i > -100) { return; } // debug, obviously, don't overwhelm my console please
	}
	
	/*const minerals = room.find(FIND_MINERALS);
	for (var i in minerals) { console.log("Mineral: " + minerals[i]); }

	// NOTE: probably don't need exists since relatively easy to determine?
	const exits = room.find(FIND_EXIT);
	for (var i in exits) { console.log("Exits: " + exits[i]); }*/
}

function runT1Checks()
{
}

// -- /old --
