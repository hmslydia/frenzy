/* Helper functions for formatting usability JSON data */

function filter (arr, fun){
	var res = [];
	for(var i in arr){
		var element = arr[i];
		if(fun(element))
			res.push(element);
	}
	return res;
}


function map(arr, fun){
	var res = [];
	for(var i in arr){
		var element = arr[i];
		res.push(fun(element));
	}
	return res;
}


function reduce(arr, init, fun){
	var accum = init;
	for(var i in arr){
		var cur = arr[i];
		accum = fun(accum, cur);
	}
	return accum;
}

function getStartTime(data){
	return reduce(data["history"]["events"], Number.MAX_VALUE, function(accum, cur){ return cur.time < accum ? cur.time : accum });
}

function extractTimes(data, author, start){
	var tweets = filter(data["tweets"], function(x) { return x["creator"] == author});  
	var times = map(tweets, function(x) {return (x.time)});
	return map(times, function(x){ return x - start });
}

function extractConversations(data, author, start){
	var tweets = filter(data["conversation"], function(x) { return x["user"] == author});  
	var times = map(tweets, function(x) {return (x.time)});
	return map(times, function(x){ return x - start });
}

function extractSearches(data, author, start){
	var tweets = filter(data["history"]["events"], function(x) { return x["username"] == author && x["searchQuery"]}); 
	var times = map(tweets, function(x) {return (x.time)});
	return map(times, function(x){ return x - start }); 
}


/* findTimes : a function that returns an array of times of interest from the provided data,
			   given a data, author, and start time */
function getSeries(data, users, colors, findTimes){
	var start = getStartTime(data);

	var tagData = map(users, function(name){ return findTimes(data, name, start)})

	var pos = 1;
	for(var i in tagData){
		tagData[i] = map(tagData[i], function(x) { return [x, pos] });
		pos++;
	}

	var series = [];
	for(var i in users){
		var user = users[i];
		series.push({
		            	name: user,
		           		data:  tagData[i],
				    	marker: {
				       		 symbol: 'circle'
				   		},
						color: colors[i]
					});
	}

	return series;
}
