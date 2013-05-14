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
	var signIns =  filter(data["history"]["events"], function(x){ return x["event"] == "signIn"})
	var times = map(signIns, function(x) { return x.time });
	var min = Number.MAX_VALUE;
	for(var i in times){
		var time = times[i];
		if(time < min) { min = time; }
	}
	console.log(min);
	var min2 = reduce(data["history"]["events"], Number.MAX_VALUE, function(accum, cur){ return cur.time < accum ? cur.time : accum });
	console.log(min2);
	return min;
}

function getEndTime(data){
	var signIns =  filter(data["history"]["events"], function(x){ return x["event"] == "done"})
	var times = map(signIns, function(x) { return x.time });
	console.log(times);
	var max = 0;
	for(var i in times){
		var time = times[i];
		if(time > max) { max = time; }
	}
	return max;
}

function extractTags(data, author, start, end){
	var tweets = filter(data["tweets"], function(x) { return x["creator"] == author}); 
	var edits = filter(data["history"]["events"], function(x) { return x["username"] == author && x["event"] == "editTweet"}); 

	tweets = tweets.concat(edits);
	var res = extractTimes(tweets, start, end);

	return res;
}

function extractConversations(data, author, start, end){
	var tweets = filter(data["conversation"], function(x) { return x["user"] == author});  
	return extractTimes(tweets, start, end);
}

function extractSearches(data, author, start, end){
	var tweets = filter(data["history"]["events"], function(x) { return x["username"] == author && x["event"] == "searchSort" && x["uiElt"] == "hierarchy"}); 
	return extractTimes(tweets, start, end);
}

function extractFeedback(data, author, start, end){
	var tweets = filter(data["history"]["events"], function(x) { return x["username"] == author && x["event"] == "feedback"}); 
	return extractTimes(tweets, start, end);
}

function extractLikes(data, author, start, end){
	var likes = filter(data["likes"], function(x) { return x["username"] == author}); 
	return extractTimes(likes, start, end);
}

function extractTimes(data, start, end){
	console.log(end)
	var times = map(data, function(x) {return (x.time)});
	console.log(times);
	times = filter(times, function(x) { return x <= end });
	return map(times, function(x){ return x - start }); 
}


/* findTimes : a function that returns an array of times of interest from the provided data,
			   given a data, author, and start time */
function getSeries(data, users, colors, findTimes, yVal){
	var start = getStartTime(data);
	var end = getEndTime(data);

	var tagData = map(users, function(name){ return findTimes(data, name, start, end)})

	var pos = 1;
	for(var i in tagData){
		tagData[i] = map(tagData[i], function(x) { return [x, yVal] });
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

function getSeries2(data, users, colors, findTimes, yVal){
	var start = getStartTime(data);
	var end = getEndTime(data);

	var tagData = map(users, function(name){ return findTimes(data, name, start, end)})

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
