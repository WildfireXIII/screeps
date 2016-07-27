module.exports = 
{
	// probably cpu intensive, use sparingly!!
	findTransportationPaths(room)
	{
		var paths = [];
		var spawn = Game.spawns.AlphaSpawn;
	
		var structures = room.find(FIND_MY_STRUCTURES);
		for (var index in structures)
		{
			var structure = structures[index]; 
			if (structure.structureType == STRUCTURE_ROAD) { continue; }
			if (structure.structureType == STRUCTURE_SPAWN) { continue; }
			if (structure.structureType == STRUCTURE_EXTENSION) { continue; }

			var path = room.findPath(spawn.pos, structure.pos, {ignoreCreeps: true});
			paths.push(path);
		}

		var sources = room.find(FIND_SOURCES);
		for (var index in sources)
		{
			var source = sources[index];
			var path = room.findPath(spawn.pos, source.pos, {ignoreCreeps: true});
			paths.push(path);
		}
		//return paths;

		Memory.Roadways = paths;
	},
	
	// gets next roadway to be built
	findNextClosestSite(room)
	{
		var paths = Memory.Roadways;

//roompos.getRangeTo(x, y) [or target]
		var found = false;
		var distOut = 0;
		while (found == false)
		{
			for (var i = 0; i < paths.length; i++)
			{
				var path = paths[i];
				if (path.length <= distOut) { continue; }
				
				var buildPos = path[distOut];
				var thingsThere = room.lookAt(buildPos.x, buildPos.y);
				var available = true;
				// look through things at this location and see if there's a structure (can't build if there is)
				for (var index in thingsThere)
				{
					var thingDict = thingsThere[index];
					if (thingDict.type == "structure") { available = false; break; }
					if (thingDict.type == "constructionSite") { available = false; break; }
				}

				if (available) { return buildPos; }
			}
			distOut++;
			if (distOut > 50) { return -1; }
		}
	},

	decideBuild(room)
	{
		// if less than 4 construction sites, try to add a new one
		var constructionSites = room.find(FIND_MY_CONSTRUCTION_SITES);
		if (constructionSites.length < 4)
		{
			var nextSitePos = this.findNextClosestSite(room);
			if (nextSitePos != -1) { room.createConstructionSite(nextSitePos.x, nextSitePos.y, STRUCTURE_ROAD); }
		}
	}
};
