//start server
var express = require('express');
var fs = require('fs');
var app = express();

app.use(express.cookieParser()); 
app.use(express.session({ secret: "keyboard cat" }))
app.use(express.bodyParser());

var allData = {"tweets":{},"streams":{},"users":{}}
/*
allData["tweets"] = {
	"uist0": {
        "time": 0, 
        "html": "<b>Gesture Output: Eyes-Free Output: Using a Force Feedback Touch Surface</b><br><br>", 
        "id": "uist0", 
        "parent": "none", 
        "creator": "uist"
    }, 
    "uist1": {
        "time": 1, 
        "html": "<b>iMuscle: Mobile Force-Feedback based on Electrical Muscle Stimulation</b><br><br>", 
        "id": "uist1", 
        "parent": "none", 
        "creator": "uist"
    }
}

allData["streams"] = {
	"uist": {
        "id": "uist", 
        "counter":0
    }
}

allData["users"] = {
	"hmslydia":{
		"id":hmslydia,
		"counter":0
	}
}	
*/

//////////////////////////////////////////
//// instantiate jokes
//////////////////////////////////////////

require('./datasets/testTweets');

//console.log(tweets);

var utils = require('./node-utils');

app.get('/utils.js', function(request, response){
    response.sendfile('utils.js')
});

require('./saveAndDisplayJokes');
app.get("/saveAndDisplayJokes.js", function(require, response) {
    response.sendfile("saveAndDisplayJokes.js")
})

require('./textSearch');
app.get("/textSearch.js", function(require, response) {
    response.sendfile("textSearch.js")
})

require('./twitterFeed');
app.get("/twitterFeed.js", function(require, response) {
    response.sendfile("twitterFeed.js")
})

require('./hashtagSummary');
app.get("/hashtagSummary.js", function(require, response) {
    response.sendfile("hashtagSummary.js")
})

initializeAllData();

function initializeAllData(){
    instantiateTweets()    
    instantiateStreams()
    instantiateUsers()
}

function instantiateTweets(){

    allData["tweets"] = tweets
}

function instantiateStreams(){

	allData["streams"] = {
		"uist": {
	        "id": "uist", 
	        "counter":8
	    },
	    "viz": {
	        "id": "viz", 
	        "counter":8
	    }
	}
}

function instantiateUsers(){
	allData["users"] = {
		"hmslydia": {
	        "id": "hmslydia", 
	        "counter":0
	    },
	    "felicia0": {
	        "id": "felicia0", 
	        "counter":0
	    }
	}
}

//////////////////////////////////////////
//// homepage 
//////////////////////////////////////////
app.get('/home.html', function(request, response){
	/*
	neesdLogin = "yes"
	if (request.session.logged){
		console.log('Welcome back: '+request.session.id)
		neesdLogin = "no"
		//set a session variable to keep track of the user's taskHistory
		
    }else {
        //Find out who they are:
        request.session.logged = true;
        console.log('new session: '+request.session.id);
		
		//set the taskHistory to {}
		//request.session.taskHistory = [] //["generate", "categorize"]
    }
	*/
    response.sendfile('home.html')
});

app.post('/home.html', function(request, response){
    command = request.body["command"]
	args = JSON.parse(request.body["args"])
	
    //we get worker info from session as soon as the page loads, to see if we already have their name/email stored
	if(command == "getDiscussion"){ 
		
		console.log("in get discussion")
		var baseTweetId=args["tweetId"];
		var returnDiscussionObjects=getDiscussionHierarchy(baseTweetId);
		
		response.send(JSON.stringify({"discussionFeed" : returnDiscussionObjects}))
		
		
	/* 
        var jokeId = args["jokeId"]
        if(allData.discussions[jokeId] == undefined) {
            instantiateNewDiscussion(jokeId);
        }
        var discussionObject = allData.discussions[jokeId];
        response.send(JSON.stringify({"discussionObject" : discussionObject}))
        */
    }else if (command == "saveTweet"){
    
    	//{"parentTweetId" : parentTweetId, "replyText":replyText,"username":username}
    	
    	
	    parentTweetId=args["parentTweetId"]
	    console.log("PARENT TWEET ID"+parentTweetId);
	    baseTweetId=getBaseTweet(parentTweetId);
	    console.log("PARENT TWEET ID"+parentTweetId);
	    
	    replyText = args["replyText"];
	    username=args["username"];
	    
	    	   
	    newTweetObject=createNewTweetObject(parentTweetId,replyText,username)
	    newId=newTweetObject["id"];

	    allData["tweets"][newId]=newTweetObject
	    
	    
		var returnDiscussionObjects=getDiscussionHierarchy(baseTweetId);
		
		var returnTweetIds = getTweetIds()
    	var returnTweetObjects = getTweetObjects(returnTweetIds);
    	
    	
	    response.send(JSON.stringify({"discussionFeed" : returnDiscussionObjects,"twitterFeed" : returnTweetObjects, "hashtagSummary": getHashtagSummary()}));
	    //response.send(JSON.stringify({"discussionFeed" : returnDiscussionObjects}));
	    
        /*
		oldJokeDiscussion = allData.discussions[jokeId]["text"]
		
		if ( oldJokeDiscussion != jokeDiscussion ){
			allData.discussions[jokeId]["text"] = jokeDiscussion;
			allData.discussions[jokeId]["updates"].push({"time": getTime() , "username": username});
		}
        response.send("");   
        */    
    }else if (command == "getTwitterFeed"){
    	
    	var returnTweetIds = getTweetIds()
    	var returnTweetObjects = getTweetObjects(returnTweetIds); 
    	response.send(JSON.stringify({"twitterFeed" : returnTweetObjects, "hashtagSummary": getHashtagSummary()}))
			
	}else if (command == "searchTweets"){
        var searchQuery = args["searchQuery"]
        //find tweetObjIds that match the searchQuery
        searchResultsBaseTweetIds = findMatchingTweetIds(searchQuery)
        //return the "feed"
    	var returnTweetObjects = getTweetObjects(searchResultsBaseTweetIds);
    	response.send(JSON.stringify({"twitterFeed" : returnTweetObjects, "hashtagSummary": getHashtagSummary()}))
	}
    
})

function findMatchingTweetIds(searchQuery){
    rtn = []

    searchQuery = searchQuery.toLowerCase()
    matchingTweets = utils.filterDictionary(allData["tweets"], function(x){ return x["html"].toLowerCase().match(searchQuery)})
    arrayOfMatchingTweets = utils.dictToArray(matchingTweets)
    
    
    arrayOfMatchingBaseTweets = utils.filterArray(arrayOfMatchingTweets, function(x){return x["parent"] == "none"})
    arrayOfMatchingBaseTweetsIds = utils.mapArray(arrayOfMatchingBaseTweets, function(x){return x["id"]})
    rtn = arrayOfMatchingBaseTweetsIds
    
    arrayOfMatchingDiscussionTweets = utils.filterArray(arrayOfMatchingTweets, function(x){return x["parent"] != "none"})
    arrayOfMatchingDiscussionTweetsIds = utils.mapArray(arrayOfMatchingDiscussionTweets, function(x){return x["id"]})
    
    baseTweetsForMatchingDiscussionTweetsIds = utils.mapArray(arrayOfMatchingDiscussionTweetsIds, function (x){return getBaseTweet(x)})
    
    for(i in baseTweetsForMatchingDiscussionTweetsIds){
        discussionTweetId = baseTweetsForMatchingDiscussionTweetsIds[i]
        if ( rtn.indexOf(discussionTweetId) == -1){
            rtn.push(discussionTweetId)
        }
    }
    
    return rtn
}



function getHashtagSummary(){
    hashtagCounts = {}
    /*
    allData["tweets"]["hmslydia0"] = {
        "time": 8, 
        "html": "asdf  #bar #foo #foo #foo #foo",
        "id": "hmslydia0", 
        "parent": "uist0", 
        "creator": "hmslydia"        
    }
    allData["tweets"]["hmslydia1"] = {
        "time": 8, 
        "html": "asdf #foo #baz",
        "id": "hmslydia1", 
        "parent": "uist1", 
        "creator": "hmslydia"        
    }    
    */
    for( t in allData["tweets"]){
        tweetText = allData["tweets"][t]["html"]
        hashtags = tweetText.match(/\S*#(?:\[[^\]]+\]|\S+)/g)
        for (h in hashtags){
            hashtag = hashtags[h]
            hashtagCounts[hashtag] = hashtagCounts[hashtag] != undefined ? hashtagCounts[hashtag]+1 : 1;
        }
    }
    
    hashtagCountsArray = []
    for( hashtag in hashtagCounts){
        counts = hashtagCounts[hashtag]
        hashtagCountsArray.push({"hashtag": hashtag, "counts":counts})
    }
    hashtagCountsArray.sort(function(a,b){return b["counts"]-a["counts"]});
    
    return hashtagCountsArray
    /*
      String.prototype.linkify_tweet = function() {
   var tweet = this.replace(/(^|\s)@(\w+)/g, "$1@<a href="http://www.twitter.com/$2">$2</a>");
   return tweet.replace(/(^|\s)#(\w+)/g, "$1#<a href="http://search.twitter.com/search?q=%23$2">$2</a>");
 
    */
    //matchingTweets = utils.filterDictionary(allData["tweets"], function(x){ return x["html"].toLowerCase().match(searchQuery)})
}

function getBaseTweet(tweetId){
    var targetTweet = allData["tweets"][tweetId]
    if (targetTweet["parent"] == "none"){
        return tweetId
    }else{
        var parentTweetId = targetTweet["parent"]
        return getBaseTweet(parentTweetId)
    }
}

function getDiscussionHierarchy(parentTweetId){
	tweetsArray = utils.dictToArray(allData["tweets"])
	
    hier = utils.convertToHierarchy(tweetsArray)

    console.log("Parent Tweet Id: "+ parentTweetId);
    hierarchyFromParentID = utils.filterArray(hier, function(tweetObj){ return tweetObj["tweetObject"]["id"]==parentTweetId })
    
    //console.log(hierarchyFromParentID);
    
    return hierarchyFromParentID
}

function createNewTweetObject(parentTweetId,replyText,username){
	/*
	"uist1": {
        "time": 1, 
        "html": "<b>iMuscle: Mobile Force-Feedback based on Electrical Muscle Stimulation</b><br><br>", 
        "id": "uist1", 
        "parent": "none", 
        "creator": "uist"
    }
    */
    var time= getTime();
    var newId= getNewTweetId(username)
    
    var tweetObject={
        "time": time, 
        "html": replyText, 
        "id": newId, 
        "parent": parentTweetId, 
        "creator": username
    }
    
    return tweetObject;
}


function getNewTweetId(username){
	counter=allData["users"][username]["counter"]
	newIdName= username+""+counter
	allData["users"][username]["counter"]++;
	console.log("newIdName"+newIdName);
	return newIdName
}


function getTweetIds(){
	
	tweetObjectArray = utils.dictToArray(allData["tweets"])
	//baseTweets = utils.filterArray(tweetObjectArray, function(tweetObj){ return tweetObj["parent"]=="none" })
	
	//baseTweetIds=[]
	tweetIDs=[]
	for (t in tweetObjectArray){
		tweet=tweetObjectArray[t];
		var discussions= getDiscussionHierarchy(tweet["id"])[0];
		
		mostRecentTimeStamp=tweet["time"];
		tweetIDs.push({"tweetId":tweet["id"],"mostRecentTimeStamp":mostRecentTimeStamp,"baseTweetId":getBaseTweet(tweet["id"])})		
	
	}
	
	console.log("tweet ids");
	console.log(tweetIDs);
	
	//var i=sortJsonArrayByProperty(tweetIDs,"mostRecentTimeStamp",-1)
	//console.log(i)
	
	tweetIDs=tweetIDs.sort(function(a,b) { return b["mostRecentTimeStamp"] - a["mostRecentTimeStamp"] } );
	
	console.log("sorted tweet ids");
	console.log(tweetIDs);
	
	ids=utils.mapArray(tweetIDs,function(x){return x["baseTweetId"]})
	
	console.log("IDS");
	console.log(ids);
	console.log("removed duplicates")
	console.log(removeNeighborDuplicates(ids));
	ids = removeNeighborDuplicates(ids)
	return ids;
	
	//return ["uist0", "uist1", "viz0"];
}

function removeNeighborDuplicates(ids){
	if(ids.length>1){
		var prev = ids[0]
		for(var i=1;i<ids.length;i++){
			next=ids[i]
			if(prev==next){
				ids.splice(i,1)
			}
			prev=next;
		}
		return ids;
	}
	else{
		return ids
		
	}
}



/////////////////////////////
// DO NOT DELETE
// moves most recent base 
// tweet to top without copy
////////////////////////////
/*
function getTweetIds(){
	
	tweetObjectArray = utils.dictToArray(allData["tweets"])
	baseTweets = utils.filterArray(tweetObjectArray, function(tweetObj){ return tweetObj["parent"]=="none" })
	
	baseTweetIds=[]
	for (bt in baseTweets){
		tweet=baseTweets[bt];
		var discussions= getDiscussionHierarchy(tweet["id"])[0];
		
		mostRecentTimeStamp=getTimeStampOfMostRecentComment(discussions,tweet["id"]);
		baseTweetIds.push({"tweetId":tweet["id"],"mostRecentTimeStamp":mostRecentTimeStamp})		
	
	}
	console.log("baseTweetIds ");
	console.log(baseTweetIds);
	sortJsonArrayByProperty(baseTweetIds,"mostRecentTimeStamp",-1);
	
		console.log("baseTweetIds ");
	console.log(baseTweetIds);
	
	ids=utils.mapArray(baseTweetIds,function(x){return x["tweetId"]})
	console.log("IDS");
	console.log(ids);
	return ids;
	
	
	//return ["uist0", "uist1", "viz0"];
}

function getTimesOfAllComments(discussion){

	children=discussion["children"];
	
	var times=[]
	var q=[]
	level=0;
	for(c in children){
		child=children[c];
		q.push({"tweet":child,"level":level})
		times.push(child["tweetObject"]["time"]);
	}
	
	while (q.length>0){
		t=q.shift();
		times.push(t["tweet"]["tweetObject"]["time"]);
		children=t["tweet"]["children"]

		level++
		for(c in children){
			q.unshift({"tweet":children[c],"level":level})
		}
	}
	console.log("get leaf times");
	console.log(times);
	return times;
}

function getTimeStampOfMostRecentComment(discussions,tweetId){
	var commentTimes=getTimesOfAllComments(discussions);
	commentTimes.sort(function(a,b){return b - a}) //Array now becomes [41, 25, 8, 71]
	console.log("largest "+ commentTimes[0]);
	if( commentTimes[0]==undefined){
		return Number.MIN_VALUE;
	} 
	else{
		return commentTimes[0]//largest in array
	}
}
*/
function sortJsonArrayByProperty(objArray, prop, direction){
    if (arguments.length<2) throw new Error("sortJsonArrayByProp requires 2 arguments");
    var direct = arguments.length>2 ? arguments[2] : 1; //Default to ascending

    if (objArray && objArray.constructor===Array){
        var propPath = (prop.constructor===Array) ? prop : prop.split(".");
        objArray.sort(function(a,b){
            for (var p in propPath){
                if (a[propPath[p]] && b[propPath[p]]){
                    a = a[propPath[p]];
                    b = b[propPath[p]];
                }
            }
            return ( (a < b) ? -1*direct : ((a > b) ? 1*direct : 0) );
        });
    }
}


function getTweetObjects(tweetIds){
	var tweetObjects=[];
	
	for (tweetId in tweetIds){
		tweetObjects.push(tweets[tweetIds[tweetId]]);
	}	
	
	return tweetObjects;
}


function getTime(){
	var d = new Date();
	return d.getTime()
}




/*
function getNextJokes(username, number, blockedListIds){	
	jokesArray = utils.dictToArray(data)
	jokesWithNoDiscussion = utils.filterArray(jokesArray, function(jokeObj){ return !jokeHasDiscussion(jokeObj) })
	//remove jokeswith id in blockedList
	availableJokes = utils.filterArray(jokesWithNoDiscussion, function(jokeObj){return blockedListIds.indexOf(jokeObj["id"]) == -1 })
	return availableJokes.slice(0,number)
}
*/

/*
function jokeHasDiscussion(jokeObj){
	jokeId = jokeObj.id+""
	if(jokeId in allData.discussions){
		if (allData.discussions[jokeId]["text"] == ""){
			return false
		}else{
			return true
		}
	}else{
		return false
	}
}
*/

//////////////////////////////////////////
//// visualize data
//////////////////////////////////////////
app.get('/visualize.html', function(request, response){
    response.send(allData)
    writeToFile(allData)
});

function writeToFile(json){
    var ret = "data = "+JSON.stringify(json)
    var d = new Date();
    var t = d.getTime()
    fs.writeFile("./saved/data"+t+".js", ret, function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("The file was saved!");
        }
    }); 
}



//////////////////////////////////////////
//// checkpoint and restore
//////////////////////////////////////////

// handle uncaught exceptions to keep Node from crashing
process.on('uncaughtException', function(err) {
  console.log(err);
  console.log(err.stack);
  // TODO: send email about the exception
});

function checkpoint() {
    writeToFile(results);
}

// force a checkpoint
app.get('/checkpoint', function(request, response){
    checkpoint();
    response.send("checkpointed");
});

// restore takes the timestamp that should be restored (from the
// filename saved/dataTIMESTAMP.js)
app.get(/^\/restore\/(\d+)$/, function(request, response) {
    var timestamp = request.params[0]
    console.log("timestamp = " + timestamp);
    // restore the timestamp
    fs.readFile("./saved/data"+timestamp+".js", function(err, restoredData) {
        if(err) {
            console.log(err);
            response.send("can't restore");
        } else {
            // restoredData may begin with "variable = ", so strip that
            restoredData = restoredData.toString().replace(/^\w+\s*=\s*/, "");
            var newResults = JSON.parse(restoredData);

            // see whether this actually changed anything
            var currentResultsJSON = JSON.stringify(results);
            var newResultsJSON = JSON.stringify(newResults);
            var message = "restored " + timestamp +
                " which " +
                (currentResultsJSON != newResultsJSON ? "changed" : "didn't change") +
                " the results state";
            console.log(message)

            // make sure the current state is checkpointed, so we don't
            // lose anything by restoring
            checkpoint();
            
            // now replace the results variable
            results = newResults;
            
            response.send(message)
        }
    });
});

function restoreData(timestamp){
	fs.readFile("./saved/data"+timestamp+".js", function(err, restoredData) {
			if(err) {
				console.log(err);
				response.send("can't restore");
			} else {
				// restoredData may begin with "variable = ", so strip that
				restoredData = restoredData.toString().replace(/^\w+\s*=\s*/, "");
				var newResults = JSON.parse(restoredData);

				// see whether this actually changed anything
				var currentResultsJSON = JSON.stringify(results);
				var newResultsJSON = JSON.stringify(newResults);
				var message = "restored " + timestamp +
					" which " +
					(currentResultsJSON != newResultsJSON ? "changed" : "didn't change") +
					" the results state";
				console.log(message)

				// make sure the current state is checkpointed, so we don't
				// lose anything by restoring
				//checkpoint();
				
				// now replace the results variable
				results = newResults;
				
				//response.send(message)
			}
		});
}

//////////////////////////////////////////
//// start serving
//////////////////////////////////////////

app.listen(3000);
console.log('Listening on port 3000');
//restoreData(1)
