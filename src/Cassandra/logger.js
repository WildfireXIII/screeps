function error(text, loc)
{
	
}

function warning(text)
{
	//console.log("<font color='#FFFF00'>[" + time() + "] >> WARNING: " + text + "</font>");
	console.log("<font color='#FFFF00'>WARNING: " + text + "</font>");
}

function debug(text, loc)
{
	if (!Memory.debug) { return; }
	console.log("<font color='#999999'>DEBUG::" + text + "</font>");
}

function announce(text)
{
	console.log("<font color='#33DD66'>[" + timestamp() + "] >> " + text + "</font>");
}

// priorities: 0 = normal
// levels: 0 is high level main loop stuff? 1 = default no extras
//
// types: 1 = regular, 0 = system, 2 = spawn
function log(text, type=1, priority=0)
{
	//if (level > Memory.loglvl) { return; }
	if (type == 0) { console.log("<font color='#66EEFF'>" + text + "</font>"); }
	else if (type == 1) { console.log(text); }
	else if (type == 2) { console.log("<font color='#FF6622'>" + text + "</font>"); }
}
