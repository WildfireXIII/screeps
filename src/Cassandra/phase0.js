function initializeCassandra()
{
	log("Initializing Cassandra " + VERSION + "...", 0)
	printSplash();
	Memory.Cassandra = {}
	log("Cassandra activation date: " + timestamp())
	log("Setting state to 'Active'")
	Memory.Cassandra.Status = "Active";
	log("Setting phase to '0'")
	Memory.Cassandra.Phase = 0;
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
