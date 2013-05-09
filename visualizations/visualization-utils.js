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


intervalLength = 10; // in seconds

function extractBuckets(data, author){
	var tweets = filter(data["tweets"], function(x) { return x["creator"] == author});  
	var times = map(tweets, function(x) {return (x.time / 1000)})
	var start = reduce(times, times[0], function(accum, cur) { return cur < accum ? cur : accum});
	var end = reduce(times, times[0], function(accum, cur) { return cur > accum ? cur : accum});
	var numBuckets = Math.ceil((end - start) / intervalLength);
	console.log(end)
	var buckets = [];
	for(var i = 0; i < numBuckets; i++){
		buckets[i] = 0;
	}
	buckets = reduce(times, buckets, function(accum, cur){ 
			 	var bucket = Math.ceil((cur - start) / intervalLength);
				accum[bucket] = 1 + (accum[bucket] ? accum[bucket] : 0);
				return accum;
			 });
	return buckets;
}


function extractTimes(data, author){
	var tweets = filter(data["tweets"], function(x) { return x["creator"] == author});  
	var times = map(tweets, function(x) {return (x.time)});
	var start = reduce(times, times[0], function(accum, cur) { return cur < accum ? cur : accum});
	return map(times, function(x){ return x - start });
}
