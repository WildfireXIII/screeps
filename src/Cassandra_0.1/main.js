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


//================================================================
//	TIER 1
//================================================================


// ---- ANALYSIS ----

// determine and save points of interest
function runT1POI(room)
{
	//if (room.memory.t1poi == true) { return; }
	//room.memory.t1poi = true;
	
	const sources = room.find(FIND_SOURCES);
	for (var i in sources) 
	{ 
		// find all energy sources
		console.log("Source: " + sources[i]); 
		var source = sources[i];
		var spx = source.pos.x;
		var spy = source.pos.y;

		// check all squares around it for available
		var free = [];
		for (var y = spy - 1; y <= spy + 1; y++)
		{
			for (var x = spx - 1; x <= spx + 1; x++)
			{
				if (x == spx && y == spy) { continue; }
				
				// look at the terrain type, add to free if plain or swamp (not wall)
				const terrain_type = room.lookForAt(LOOK_TERRAIN, x, y);
				if (terrain_type != "wall") { free.push(new RoomPosition(x, y, room.name)); }
			}
		}

		for (var j in free)
		{
			console.log("We found a free spot around this source at " + free[j]);
		}
		
		console.log(source.pos);
	}
	
	/*const minerals = room.find(FIND_MINERALS);
	for (var i in minerals) { console.log("Mineral: " + minerals[i]); }

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
