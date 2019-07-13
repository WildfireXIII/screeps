function initializeCassandra()
{
	log("Initializing Cassandra " + VERSION + "...", 0);
	printSplash();
	Memory.Cassandra = {};
	log("Cassandra activation date: " + timestamp(), 0);
	initializeMemory();
	log("Cassandra initialized", 0);
	activateCassandra();
}
function activateCassandra()
{
	Memory.Cassandra.status = "Active";
	announce("CASSANDRA ACTIVATED");
	
	enterP0();
}
function initializeMemory()
{
	log("Initializing memory...");
	
	log("Setting phase to '-1'");
	Memory.Cassandra.phase = -1;
	
	log("Setting log level to '1'");
	Memory.loglvl = 1;

	if (Memory.debug == null)
	{
		log("Setting debug to '" + START_DEBUG + "'");
		Memory.debug = START_DEBUG;
	}

	log("Memory initialized");
}

function printSplash()
{
	log("\n" +
		"_______ _______ _______ _______ _______ __   _ ______   ______ _______\n" + 
		"|       |_____| |______ |______ |_____| | \\  | |     \\ |_____/ |_____|\n" +
		"|_____  |     | ______| ______| |     | |  \\_| |_____/ |    \\_ |     |\n\n" +
		"Version: <font color='#66EEFF'>" + VERSION + "</font> Date: " + VERSION_DATE + "\n" + 
		"Copyright (c) 2017 Digital Warrior Labs\n");
}
