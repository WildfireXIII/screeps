function zeroify(num) 
{ 
	if (num < 10) { return "0" + num; } 
	return num;
}
function timestamp()
{
	var d = new Date(Date.now());

	var datestring = zeroify(d.getMonth()) + "/" + 
		zeroify(d.getDate()) + "/" + 
		zeroify(d.getFullYear()) + " " + 
		zeroify(d.getHours()) + ":" + 
		zeroify(d.getMinutes()) + ":" + 
		zeroify(d.getSeconds());
	return datestring;
}

function error(text, loc)
{
	
}

function warning(text)
{
	//console.log("<font color='#FFFF00'>[" + time() + "] >> WARNING: " + text + "</font>");
	console.log("<font color='#FFFF00'>WARNING: " + text + "</font>");
}

// priorities: 0 = normal
// levels: 0 is high level main loop stuff? 1 = default no extras
function log(text, level=1, priority=0)
{
	if (level == 0) { console.log("<font color='#66EEFF'>" + text + "</font>"); }

	else if (level == 1) { console.log(text); }
}
