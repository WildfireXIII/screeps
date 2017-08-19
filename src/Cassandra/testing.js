// -- old --

//================================================================
//	TESTS
//================================================================

function runTests()
{
	console.log("------ Test ------");

	testTier1POI();
	testTier13Request();
	
	global.toggleTesting();
	console.log("==================");
}

function testTier1POI() 
{ 
	runT1POI(Game.rooms["sim"]); 
	console.log("Completed Tier 1 POI analysis test"); 
}

function testTier13Request()
{
	submitTier13Request("testing", "This is just a test, no action required", "---", null, null);
	console.log("Submitted Tier 13 request");
}

// -- /old --
