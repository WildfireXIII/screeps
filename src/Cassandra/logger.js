function zeroify(num) 
{ 
	if (num < 10) { return "0" + num; } 
	return num;
}
function time()
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

function log(text, type, priority)
{
	
}
