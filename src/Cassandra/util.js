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
