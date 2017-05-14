//================================================================
//  CNC 
//================================================================

global.toggleTesting = function()
{
	if (Memory.testing == true) { Memory.testing = false; return "Testing is now off"; }
	else { Memory.testing = true; return "Testing is now on"; }
};
