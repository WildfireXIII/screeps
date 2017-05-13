//================================================================
//  GLOBALS 
//================================================================

global.toggleTesting = function()
{
	if (Memory.testing == true) { Memory.testing = false; return "Testing is now off"; }
	else { Memory.testing = true; return "Testing is now on"; }
};


// ---- DATA ----
var rooms = ["sim"];

//global.thing = "hello!";


// ---- TEMP STORAGE ----

//================================================================
//	MAIN
//================================================================

module.exports.loop = function()
{
	if (Memory.testing == true) { runTest(); }
	//hello();
}


function hello()
{
	console.log("Hello there!");
}


//================================================================
//	UTILITY
//================================================================

// returns array of room positions of non-wall terrain surrounding a spot
// NOTE: does not check for entities, only terrain!
function findFreeSurrounding(room, target_x, target_y)
{
	// check all squares around it for available
	var free = [];
	for (var y = target_y - 1; y <= target_y + 1; y++)
	{
		for (var x = target_x - 1; x <= target_x + 1; x++)
		{
			if (x == target_x && y == target_y) { continue; }
			
			// look at the terrain type, add to free if plain or swamp (not wall)
			const terrain_type = room.lookForAt(LOOK_TERRAIN, x, y);
			if (terrain_type != "wall") { free.push(new RoomPosition(x, y, room.name)); }
		}
	}
	return free;
}

// returns array of arrays of room positions that are connected to eachother
function breakIntoConnecting(positionsList)
{
	var positionSeries = [];
	for (var i in positionsList)
	{
		var pos = positionsList[i];
		console.log("Checking pos " + pos);
		// check against everything already added
		var foundMatchingSeries = false; // set this to true if added an existing series
		for (var series in positionSeries)
		{
			console.log("\tChecking in series " + series);
			for (var pindex in positionSeries[series])
			{
				//console.log("\t\tChecking against
				var p = positionSeries[series][pindex];
				var difX = Math.abs(p.x - pos.x);
				var difY = Math.abs(p.y - pos.y);
				console.log("difX: " + difX);
				console.log("difY: " + difY);
				if ((difX == 0 && difY == 1) || (difX == 1 && difY == 0))
				{
					console.log("Yup, it's a match");
					positionSeries[series].push(pos);
					console.log(positionSeries[series]);
					foundMatchingSeries = true;
					continue;
				}
			}
		}

		// NOTE: technically foundMatchingSeries is unnecessary because of
		// continue statement in loop above
		
		// create a new series if no matching found
		if (!foundMatchingSeries)
		{
			console.log("No matching series, starting new...");
			var newSeries = [pos];
			positionSeries.push(newSeries);
			continue;
		}
	}

	return positionSeries;
}


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



//================================================================
//	TESTS
//================================================================

function runTest()
{
	console.log("------ Test ------");
	runT1POI(Game.rooms["sim"]);
	global.toggleTesting();
	console.log("==================");
}
