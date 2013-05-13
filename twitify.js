//start server
var express = require('express');
var fs = require('fs');
var app = express();

app.use(express.cookieParser()); 
app.use(express.session({ secret: "keyboard cat" }))
app.use(express.bodyParser());

var allData = {
"tweets":{},
"streams":{},
"users":{},
"likes":[],
"requiredHashtags": [], 
"conversation":[], 
"currentLocations":[], 
"history":{ 
    "locations":[], 
    "events":[]
    }
}

var numberOfTweetsToDisplayIncrementSize = 2

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

allData["conversation"] = [
	{	"user":"hmslydia",
		"comment":"Hello World!",
		"time":0
	}
    
    
allData["currentlocation"] = [
	{	"user":"hmslydia",
		"location":"uist0"
	}    
]
allData["history"]["location"] = [
	{	"user":"hmslydia",
		"location":"uist0",
		"time":0
	}    
]

*/

//////////////////////////////////////////
//// instantiate jokes
//////////////////////////////////////////

//require('./datasets/testTweets');
//require('./datasets/testTweets2');
//require('./datasets/siggraph')
//require('./datasets/HCOMP')
//require('./datasets/photoAlbum_20-49')

//require('./datasets/testTweets3');
//require('./saved/caitlin and danielle-hierarchy')

/*FOR USER STUDY*/
require('./datasets/colors10')
//require('./datasets/photoAlbum_ALL')


/*MTURK Datasets*/

//require('./datasets/photoAlbum_0-9')
//require('./datasets/twitterFollowers')


/*Frenzy Datasets*/
//require('./datasets/twitterFollowers2')
//require('./datasets/photoAlbum_10-19')

/*Global Frenzy Datasets*/
//require('./datasets/photoAlbum_20-49')


var utils = require('./node-utils');
//var search = require('./searchHelpers-server');

app.get('/utils.js', function(request, response){
    response.sendfile('utils.js')
});

require('./textSearch');
app.get("/textSearch.js", function(require, response) {
    response.sendfile("textSearch.js")
})

require('./goals');
app.get("/goals.js", function(require, response) {
    response.sendfile("goals.js")
})

require('./twitterFeed');
app.get("/twitterFeed.js", function(require, response) {
    response.sendfile("twitterFeed.js")
})

require('./hashtagSummary');
app.get("/hashtagSummary.js", function(require, response) {
    response.sendfile("hashtagSummary.js")
})

require('./editTweets');
app.get("/editTweets.js", function(require, response) {
    response.sendfile("editTweets.js")
})

initializeAllData();

function initializeAllData(){
    instantiateTweets()    
    instantiateStreams()
    instantiateUsers()
    instantiateRequiredHashtags()
    instantiateConversation()
    instantiateHashtags()

    //instantiateCompletionCondition()
	
	
}

function instantiateRequiredHashtags(){
	allData["requiredHashtags"] = requiredHashtags
}
/*
function instantiateCompletionCondition(){

    for(c in completionCondition){
	    condition = completionCondition[c]
	    
	    var num1 = condition["number1"]
	    var attr1 = condition["attribute1"]
	    var num2 = condition["number2"]
	    var attr2 = condition["attribute2"]
	    
	    if(attr1=="hashtags"){
		    attr1Object = getHashtagSummary()
	    }
	    
	    else if(attr1=="tweets" || attr1=="discussion" ){
		    attr1Object = getAllBaseTweetAndDiscussionObjects()
	    }

    }
}
*/

function isConditionTrue(num1,attr1,attr1Object,num2,attr2){

	if(num1=="all"){
		if(attr1 == "tweets" && attr2 == "hashtags"){
			var count=0;
			if(num2==""){
				num2=0;
			}
			for(a in attr1Object){
				if((getListOfHashTagsForBaseTweet(attr1Object[a]["basetweet"]["id"])).length > num2){
					count++
				}
			}
			if(count == attr1Object.length){
				return true;
			}
			else{
				return false;

			} 
		}
	}
	
}

function getListOfHashTagsForBaseTweet(baseTweetId){
	var hts = getHashtagSummaryForBaseTweet(baseTweetId)

	var hashTags = utils.mapArray(hts, function(x){return x["hashtag"]})
	return hashTags
}

function getHashtagSummaryForBaseTweet(baseTweetId){
	//{"hashtag": hashtag, "counts":counts, "memberTweetIds": baseTweets}
	var allHashTags = getHashtagSummary()
	var filteredArray= utils.filterArray(allHashTags, function(x){ return (x["memberTweetIds"]).indexOf(baseTweetId)>-1})
    
    return filteredArray;
    
}

function instantiateTweets(){

    allData["tweets"] = tweets
}

function instantiateHashtags() {
	allData["hashTags"] = [];
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

function instantiateConversation() {
	allData["conversation"] = [
    /*
		{	"user":"hmslydia",
			"comment":"Hello World!",
			"time": getTime()
		},
		{   "user":"katlyn",
			"comment":"I like lots of cats. Cats are the bestest of all",
			"time": getTime()
		},
		{   "user":"hmslydia",
			"comment":"Poooooop",
			"time": getTime()
		}
*/
	]

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
	if (request.session.logged){
		console.log('Welcome back: '+request.session.id)
    }else {
        request.session.logged = true;
        console.log('new session: '+request.session.id);
    }
	request.session.lastUpdateTime = 0
    response.sendfile('home.html')
});
/*
SignIn
getTwitterFeed
getDiscussion

//TWEET CRUD
saveTweet
updateTweet
createNewTweet

//hashtag shit
savetags

//SEARCH
searchTweets
searchUsersTweets

//CONSTANT FEEDBACK
//COMPLETION TOWARDS GOAL
getUpdates
getRequiredHashtagValues

//CHAT
pushComments //conversation or chat
getComments //convervation or chat

//OTHER USER LOCATIONS
pushLocation


*/
app.post('/home.html', function(request, response){
    command = request.body["command"]
	args = JSON.parse(request.body["args"])	
	
    //we get worker info from session as soon as the page loads, to see if we already have their name/email stored
	if(command == "getDiscussion"){ 
        var tweetId=args["tweetId"]        
        var baseTweetId = getBaseTweet(tweetId);
        var returnDiscussionObjects = getDiscussionHierarchy(baseTweetId);        
        response.send(JSON.stringify({"baseTweetId": baseTweetId, "discussionHierarchy" : returnDiscussionObjects, "hashtagSummary": getHashtagSummary(),"likes":allData["likes"]}))	

    }
    else if(command == "getBaseTweetIds"){
    	tweetIds = args['tweetIds']
    	baseTweetIds = [];
    	for( twt in tweetIds){
	    	tweetId = tweetIds[twt];
	    	baseTweetId = getBaseTweet(tweetId);
	    	baseTweetIds.push(baseTweetId)
    	}
    
    	response.send(JSON.stringify({ "baseTweetIds" : baseTweetIds,"tweets":allData["tweets"],"lastRefreshTime":request.session.lastRefresh}));
    }else if (command == "saveTweet"){    
    	//{"parentTweetId" : parentTweetId, "replyText":replyText,"username":username}      	
	    parentTweetId=args["parentTweetId"]
	    baseTweetId=getBaseTweet(parentTweetId);
	    
	    replyText = args["replyText"];
	    username=args["username"];	    
	    	   
	    newTweetObject=createNewTweetObject(parentTweetId,replyText,username)
	    newId=newTweetObject["id"];

	    allData["tweets"][newId]=newTweetObject
	    
	    newTweetTime=newTweetObject["time"];
	    
		var returnDiscussionObjects=getDiscussionHierarchy(baseTweetId);
		
        
	    response.send(JSON.stringify({ "discussionFeed" : returnDiscussionObjects, "hashtagSummary": getHashtagSummary(),"likes":allData["likes"]}));	    
  
    } else if (command == "saveTags"){    
    	//{"parentTweetId" : parentTweetId, "replyText":tag,"username":username}      	
	    var tag = args["replyText"];
  		var parentTweetId = args["parentTweetId"];
  		var baseTweetId = getBaseTweet(parentTweetId);
  		var username = args["username"];
  		var newTagObject = createNewTagsObject(parentTweetId, tag, username);
  		newId = newTagObject["id"];
  		console.log("lolololol" + newId)
  		if(!allData["hashTags"][newId]) {
  			allData["hashTags"].push({newId: []});
  		}
  		allData["hashTags"][newId].push(newTagObject);
  			var time = newTagObject["time"];
  		var result = findTagsWithParent(newId, time);
  		response.send(JSON.stringify({"updatedTags" : result}));
    } else if (command == "getTags") {
    	var result = [];
    	//console.log("length of hashTags:" + allData["hashTags"].length);
    	for(id in allData["hashTags"]) {//for(var i = 0; i < allData["hashTags"].length; i++) {
    		console.log("id: " + id[0]+id[1]);
    		for(tagobject in id) {
    			console.log(tagobject["html"]);
    			result.push(tagobject["html"]);
    		}
       	}
       	response.send(JSON.stringify({"allTags" : result}));
    } else if (command == "updateTweet"){
        var tweetId = args["tweetId"]
        var newContent = args["newContent"]
        var username = args["username"]
		
		var oldContent = allData["tweets"][tweetId]["html"]
		logTweetEdit(username, oldContent, newContent)
        //updateTweet in database
        allData["tweets"][tweetId]["html"] = newContent
        allData["tweets"][tweetId]["time"] = getTime()
        
        var baseTweetId = getBaseTweet(tweetId);
        var returnDiscussionObjects = getDiscussionHierarchy(baseTweetId);
        
        response.send(JSON.stringify({"baseTweetId": baseTweetId, "discussionHierarchy" : returnDiscussionObjects, "hashtagSummary": getHashtagSummary(),"likes":allData["likes"]}))
        
        /*
        var baseTweetId = getBaseTweet(tweetId);
        var returnDiscussionObjects = getDiscussionHierarchy(baseTweetId);        
        response.send(JSON.stringify({"baseTweetId": baseTweetId, "discussionHierarchy" : returnDiscussionObjects, "hashtagSummary": getHashtagSummary(),"likes":allData["likes"]}))
		*/	
	}else if (command == "updateLikes"){
        var tweetId=args["tweetId"]
        var username=args["username"]
        var time = getTime();
        
        possibleDuplicates = utils.filterArray(allData["likes"], function(x){return (x["id"]==tweetId && x["username"]==username)})
        
        if(possibleDuplicates.length == 0 ){
	        allData["likes"].push(createNewLikesObject(tweetId,username,time));
        }
        else{

	        allData["likes"]=utils.filterArray(allData["likes"], function(x){return( x["id"]!=tweetId && x["username"]!=username)});

        }
                
        response.send("")
			
	}/*else if(command == "createNewTweet"){
		var tweetText= args["tweetText"]
		var username= args["username"]
		var newTweetObject=createNewTweetObject("none",tweetText,username);
		var newId=newTweetObject["id"]
		allData["tweets"][newId]=newTweetObject;
		
        var allBaseTweetAndDiscussionObjects = getAllBaseTweetAndDiscussionObjects()
		var allBaseTweetAndDiscussionObjectsSORTED_ids = sortBaseTweetAndDiscussionObjects(allBaseTweetAndDiscussionObjects, "time")
        var allBaseTweetAndDiscussionObjectsSORTED = getBaseTweetAndDiscussionObjects(allBaseTweetAndDiscussionObjectsSORTED_ids); 
    	
    	var newTweets=getNewTweetCount(username,request.session.lastRefresh,utils.dictToArray(allData["tweets"]));
		var count=newTweets["count"];
		var creators=newTweets["newTweetCreators"]
		
		request.session.lastRefresh=getTime()
		
    	response.send(JSON.stringify({"twitterFeed" : allBaseTweetAndDiscussionObjectsSORTED, "hashtagSummary": getHashtagSummary(),"newTweetCreators":creators,"likes":allData["likes"]}))
    	
	}*/else if (command == "getTwitterFeed"){
		var username= args["username"]
        var allBaseTweetAndDiscussionObjects = getAllBaseTweetAndDiscussionObjects()
        
        var allBaseTweetAndDiscussionObjectsSORTED_ids = sortBaseTweetAndDiscussionObjects(allBaseTweetAndDiscussionObjects, "time")
        var allBaseTweetAndDiscussionObjectsSORTED = getBaseTweetAndDiscussionObjects(allBaseTweetAndDiscussionObjectsSORTED_ids); 
    	
    	var newTweets=getNewTweetCount(username,request.session.lastRefresh,utils.dictToArray(allData["tweets"]));
		var count=newTweets["count"];
		var creators=newTweets["newTweetCreators"]
		
		var newLikeIds=getNewLikes(username,request.session.lastRefresh,utils.dictToArray(allData["tweets"]));
		
		var currentTime = getTime()
		request.session.lastRefresh = currentTime;
		
    	response.send(JSON.stringify({"twitterFeed" : allBaseTweetAndDiscussionObjectsSORTED, "hashtagSummary": getHashtagSummary(),"newTweetCreators":creators,"newLikeIds":newLikeIds,"requiredHashtags":allData["requiredHashtags"],"likes":allData["likes"], "lastRefreshTime": currentTime}))
			
	}else if(command =="getUpdates"){
		var username= args["username"]
        var completionConditionHashtags=args["completionConditionHashtags"];
        
        
		var newTweets=getNewTweetCount(username,request.session.lastRefresh,utils.dictToArray(allData["tweets"]));

		var count=newTweets["count"];
		var creators=newTweets["newTweetCreators"]
        var newLikeIds=getNewLikes(username,request.session.lastRefresh,utils.dictToArray(allData["tweets"]));
        
        var completionDataIds = getCompletionData(completionConditionHashtags, allData["tweets"])
        //completionDataIds = {"matchingBaseTweetIds": currentResults, "nonMatchingBaseTweetIds": arraySubtraction}
		var completionDataObjects = {}
		var matchingTweetObjects = getBaseTweetAndDiscussionObjects(matchingTweetIds);
		completionDataObjects["matchingBaseTweetObjects"] = getBaseTweetAndDiscussionObjects(completionDataIds["matchingBaseTweetIds"])
		completionDataObjects["nonMatchingBaseTweetObjects"] = getBaseTweetAndDiscussionObjects(completionDataIds["nonMatchingBaseTweetIds"])
		//var matchingTweetIdsSORTED = sortBaseTweetAndDiscussionObjects(matchingTweetObjects, "default")
        //var matchingTweetAndDiscussionObjectsSORTED = getBaseTweetAndDiscussionObjects(matchingTweetIdsSORTED); 
		
        response.send(JSON.stringify({"newTweetCount":count,"newTweetCreators":creators, "newLikeIds":newLikeIds,"completionDataObjects":completionDataObjects,"likes":allData["likes"]}))

		
	}/*else if (command == "getRequiredHashtagValues"){
		requiredHashtagValues = []
		var tweetIds = args["tweetIds"]
		for(twtId in tweetIds){
			tweetId = tweetIds[twtId];
			requiredHashtagValues.push({"tweetId":tweetId,"hashtagValues":getRequiredHashtagValues(tweetId)});
		}
		response.send(JSON.stringify({"requiredHashtagValues":requiredHashtagValues}))
	
	}*/else if (command == "SignIn"){
    	
    	var newUsername=args["username"];

        logSignIn(newUsername)
        initSession(request, newUsername)
        
    	//User already exists
    	if(allData["users"][newUsername]!=undefined){
	    	console.log("User already exists");
    	}
    	//Adding a new user
    	else{
    		console.log("Adding a new user");
    		newUserObject=createNewUserObject(newUsername)
	    	allData["users"][newUsername]=newUserObject;
    	}
    	
    	response.send("")
			
	}else if (command == "searchTweets"){         
        var username = request.session.user
        var searchQuery = args["searchQuery"]     
        var sortBy = args["sortBy"]
        var uiElt = args["uiElt"]
        var notes = args["notes"]
        
        logSearchQuery(username, searchQuery, sortBy, uiElt, notes)
        
        var searchResultsBaseTweetIds = getQueryResultIds(searchQuery, allData["tweets"])
        var matchingTweetIds = searchResultsBaseTweetIds["matchingTweetIds"]
        var searchTermArray = searchResultsBaseTweetIds["searchTermArray"]
        //find tweetObjIds that match the searchQuery
        //var searchResultsBaseTweetIds = findMatchingTweetIds(searchQuery)
        //return the "feed"
    	var matchingTweetObjects = getBaseTweetAndDiscussionObjects(matchingTweetIds);
        
        var matchingTweetIdsSORTED = sortBaseTweetAndDiscussionObjects(matchingTweetObjects, sortBy, username)
        var matchingTweetAndDiscussionObjectsSORTED = getBaseTweetAndDiscussionObjects(matchingTweetIdsSORTED); 
    	
    	//var returnTweetIds = getSearchTweetOrder(returnTweetObjects);    	
    	//returnTweetObjects = getBaseTweetAndDiscussionObjects(returnTweetIds)     
        
        response.send(JSON.stringify({"twitterFeed" : matchingTweetAndDiscussionObjectsSORTED, "searchTermArray": searchTermArray, "hashtagSummary": getHashtagSummary(), "likes":allData["likes"] }))
        
	}else if (command == "searchUsersTweets"){
        var user = args["user"]
        tweetsArray = utils.dictToArray(allData["tweets"])
        var userTweetObjects = utils.filterArray(tweetsArray, function(x){return x["creator"]==user})
        var userTweetIds = utils.mapArray(userTweetObjects, function(x){return x["id"]})
        
        var userTweetObjects = getBaseTweetAndDiscussionObjects(userTweetIds);
        
    	response.send(JSON.stringify({"twitterFeed" : userTweetObjects, "likes":allData["likes"]}))
        
	}else if(command == "pushComments") {
       	var comment = args["comment"]
		var user = args["username"]
		var time = getTime();
		allData["conversation"].push({"user":user, "comment":comment, "time":time})
		
		var conversation = getNewConvos(request)
	    response.send(JSON.stringify({"conversation": conversation})) 
        
	}else if (command == "getComments") {
	    var conversation = getNewConvos(request)
	    response.send(JSON.stringify({"conversation": conversation}))
        
	}else if (command == "getLocations") {
        var currentLocations = allData["currentLocations"]
  	    response.send(JSON.stringify({"locations": currentLocations}))
	}else if (command == "updateLocation") {
        
		var username = args["username"]
        var itemId = args["id"]
        updateUserLocation(username, itemId)

        //var currentLocations = allData["currentLocations"]
	    //response.send(JSON.stringify({"locations": currentLocations}))
        response.send("")
        
	}else if (command == "logFeedbackClicks") {
        var username = args["username"]
        var uiElt = args["uiElt"]
        var notes = args["notes"]
        logFeedback(username, uiElt, notes)
        response.send("")
	}else if (command == "logDone") {
        var username = args["username"]
        var goalAchievedTime = args["goalAchievedTime"]
        logDone(username, goalAchievedTime)
        checkpoint()
        response.send("")
	}        
    
})

function getNewConvos(request) {
	var lastUpdateTime = request.session.lastUpdateTime
	var newConversations = utils.filterArray(allData["conversation"], function(x){return x["time"] > lastUpdateTime});
	request.session.lastUpdateTime = getTime()
	return newConversations;
}

//////////////////////////////////////////
// event logging helpers
//////////////////////////////////////////

function logSignIn(username){
    var eventObj = {"username": username, "time": getTime(), "event": "signIn"}
    allData["history"]["events"].push(eventObj)
    //console.log(allData["history"]["events"])
}

function logSearchQuery(username, searchQuery, sortBy, uiElt, notes){
    var eventObj = {"username": username, "time": getTime(), "searchQuery": searchQuery, "sortBy":sortBy, "uiElt":uiElt, "notes": notes, "event": "searchSort"}
    allData["history"]["events"].push(eventObj)
    //console.log(allData["history"]["events"])
}

function logFeedback(username, uiElt, notes){
    var eventObj = {"username": username, "time": getTime(), "uiElt":uiElt, "notes":notes, "event": "feedback"}
    allData["history"]["events"].push(eventObj)    
    //console.log(allData["history"]["events"])
}

function logTweetEdit(username, oldContent, newContent){
    var eventObj = {"username": username, "time": getTime(), "oldContent":oldContent, "newContent":newContent, "event": "editTweet"}
    allData["history"]["events"].push(eventObj)    
    //console.log(allData["history"]["events"])	
}

function logDone(username, goalAchievedTime){
    var eventObj = {"username": username, "time": getTime(), "goalAchievedTime":goalAchievedTime, "event": "done"}
    allData["history"]["events"].push(eventObj)    
    //console.log(allData["history"]["events"])	
}

//////////////////////////////////////////
// search helpers
//////////////////////////////////////////
function getQueryResultIds(searchQuery, allTweets){
    var ANDlocation = searchQuery.indexOf("AND")
    var ORlocation = searchQuery.indexOf("OR")
    var NOTlocation = searchQuery.indexOf("NOT")
	
    if ( ANDlocation > -1){
        var search1 = utils.trim(searchQuery.substring(0, ANDlocation))
        var search2 = utils.trim(searchQuery.substring(ANDlocation + 3))
        var termsToHighlight = [search1, search2]
        //do the two search and get the intersection
        
        queryResultIds1 = findMatchingTweetIds(search1)
        queryResultIds2 = findMatchingTweetIds(search2)        
        
        var intersection = utils.arrayIntersection(queryResultIds1, queryResultIds2)

        return {"matchingTweetIds": intersection, "searchTermArray": termsToHighlight}
        
    }else if ( ORlocation > -1){
        var search1 = utils.trim(searchQuery.substring(0, ORlocation))
        var search2 = utils.trim(searchQuery.substring(ORlocation + 2))
        var termsToHighlight = [search1, search2]
        //do the two searches and get the combination with not repeats
        queryResultIds1 = findMatchingTweetIds(search1)
        queryResultIds2 = findMatchingTweetIds(search2)
		
        var union = utils.arrayUnion(queryResultIds1, queryResultIds2)
        
        return {"matchingTweetIds": union, "searchTermArray": termsToHighlight}
        
    }else if ( NOTlocation > -1){
        //search1 = searchQuery.substring(0, NOTlocation)
        var search2 = utils.trim(searchQuery.substring(NOTlocation + 3))
        //only search for things that don't contain this
        var termsToHighlight = []
        
		//allbase tweets minus findMatchingTweetsIds(
        var allTweetsArray = utils.dictToArray(allTweets)
		var baseTweets = utils.filterArray(allTweetsArray, function(x){return x["parent"]=="none"})
		var baseTweetIds = utils.mapArray(baseTweets, function(x){return x["id"]})
		var tweetsToSubtract = findMatchingTweetIds(search2, allTweets)
        
		var arraySubtraction = utils.arrayMinus(baseTweetIds, tweetsToSubtract)
        
		return {"matchingTweetIds": arraySubtraction, "searchTermArray": termsToHighlight}
		
    }else{
        //do a regular search
        var termsToHighlight = [searchQuery]
        return {"matchingTweetIds": findMatchingTweetIds(searchQuery, allTweets), "searchTermArray": termsToHighlight}
    }
}

function findTagsWithParent(id, time) {
	var results = [];
	for(var i = 0; i < allData["hashTags"][id].length; i++) {
		if (allData["hashTags"][id][i]["time"] >= time) {
			results.push(allData["hashTags"][id][i]["html"]);
		}
	}
	return results;
}

function findMatchingTweetIds(searchQuery, allTweets){
    rtn = []

    searchQuery = utils.trim(searchQuery.toLowerCase())
    matchingTweets = utils.filterDictionary(allTweets, function(x){ return x["html"].toLowerCase().match(searchQuery)})
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

function getCompletionData(completionConditionHashtags, allTweets){
    completionConditionHashtags = completionConditionHashtags
    //parse the hashtag list
    var hashtags = completionConditionHashtags.split(",")
    hashtags = utils.mapArray(hashtags, function(x){return utils.trim(x)})
    
    //get the intersection of all sets of hashtags
    var currentResults = []    
    if(hashtags.length == 0 ){
        //currentResults stays as []
    }else if (hashtags.length == 1 ){
        var onlyHashtag = hashtags[0]
        currentResults =  findMatchingTweetIds(onlyHashtag, allTweets)
    }else{
        var firstHashtag = hashtags[0]
        currentResults =  findMatchingTweetIds(firstHashtag, allTweets)
        
        for(var i = 1; i < hashtags.length; i++){
            var hashtag = hashtags[i]
            var queryResultIds = findMatchingTweetIds(hashtag, allTweets) 
            var currentResults = utils.arrayIntersection(currentResults, queryResultIds)
        }
        
    } 
        
    //get the inverse of the intersection currentResults    
    var allTweetsArray = utils.dictToArray(allTweets)
	var baseTweets = utils.filterArray(allTweetsArray, function(x){return x["parent"]=="none"})
	var baseTweetIds = utils.mapArray(baseTweets, function(x){return x["id"]})
    
    var arraySubtraction = utils.arrayMinus(baseTweetIds, currentResults)

	return {"matchingBaseTweetIds": currentResults, "nonMatchingBaseTweetIds": arraySubtraction}
}


//////////////////////////////////////////
// location helpers
//////////////////////////////////////////
function updateUserLocation(username, itemId){
    var newLocationObject = {"user": username, "id":itemId, "time":getTime()}
        
    var currentLocations = allData["currentLocations"]
    
    var thisUsersCurrentLocation = utils.filterArray(currentLocations, function(x){return x["user"] == username})
    
    if(thisUsersCurrentLocation.length == 0 ){
        currentLocations.push({"user":username, "id": itemId})
        allData["history"]["locations"].push(newLocationObject)
        
    }else{
        var thisUsersCurrentLocation = thisUsersCurrentLocation[0]
        var currentUserLocationId = thisUsersCurrentLocation["id"]
        
        //if the location is new, update the current location and push it on the history list
        if(currentUserLocationId != itemId){
            thisUsersCurrentLocation["id"] = itemId   
            allData["history"]["locations"].push(newLocationObject)
        }
    }
    
}





//////////////////////////////////////////
// ???
//////////////////////////////////////////


function getNewTweetCount(user,lastRefresh,tweetObjectArray){
	var creators=[]
	var counter=0;

	for (t in tweetObjectArray){
		tweet=tweetObjectArray[t];
		timeStamp=tweet["time"];
		tweetCreator=tweet["creator"]
		if(timeStamp>lastRefresh && user!=tweetCreator){

			counter++;
			creators.push(tweet["id"]);
		}
	}
	for (t in allData["likes"]){
		tweet=allData["likes"][t];
		timeStamp=tweet["time"];
		tweetCreator=tweet["username"]
		
		if(timeStamp>lastRefresh && user!=tweetCreator){

			counter++;
		}
	}
	
	return {"count":counter,"newTweetCreators":creators};
}

function getNewLikes(user,lastRefresh,tweetObjectArray){
	var likeIds=[]

	for (t in allData["likes"]){
		tweet=allData["likes"][t];
		timeStamp=tweet["time"];
		tweetCreator=tweet["username"]
		
		if(timeStamp>lastRefresh && user!=tweetCreator){

			counter++;
			likeIds.push(tweet["id"]);
		}
	}
	
	return {"newLikeIds":likeIds};
}

function initSession(request, theUser){

    request.session.user = theUser
    request.session.lastRefresh=getTime();
    request.session.numberToDisplay = numberOfTweetsToDisplayIncrementSize
    request.session.query = ""
    request.session.alertCount=0
    
    console.log("user: "+request.session.user)
    console.log("num: "+request.session.numberToDisplay)
    console.log("query: "+request.session.query)
}

  

function getRequiredHashtagValues(baseTweetId){
	var values=[]
		
	var requiredHashtags= allData["requiredHashtags"]
	
	var baseTweetId = allData["tweets"][baseTweetId]["id"]
	var tweetText = allData["tweets"][baseTweetId]["html"]
	var hashtags = tweetText.match(/\S*#(?:\[[^\]]+\]|\S+)/gi)

	

    var discussionRoot=getDiscussionHierarchy(baseTweetId)[0]
	var children=discussionRoot["children"];

	//a queue for BFS implementation
	var queue=[]
	queue.push({"tweet":discussionRoot})
	
	while (queue.length>0){
		t=queue.shift();

		tweetText = t["tweet"]["tweetObject"]["html"]
		hashtags = tweetText.match(/\S*#(?:\[[^\]]+\]|\S+)/gi)

		for(h in hashtags){
			hashtag = hashtags[h].toLowerCase()
			if(hashtag[hashtag.length-1]==":"){

				hashtag=hashtag.slice(0,-1)
				var value = tweetText.match(hashtag+': \"(.*)\"');
				
				if(requiredHashtags.indexOf(hashtag)>-1 && value!=null ){
					values.push({"hashtag":hashtag,"value":value[1]})
	
				}
				else if(requiredHashtags.indexOf(hashtag.slice(0,-1))>-1 && value!=null){
					values.push({"hashtag":hashtag.slice(0,-1),"value":value[1]})
				}
				else{
					values.push({"hashtag":hashtag,"value":""})
				}
			}
			else{

				var value = tweetText.match(hashtag+' :\"(.*)\"');
				
				if(requiredHashtags.indexOf(hashtag)>-1 && value!=null ){
					values.push({"hashtag":hashtag,"value":value[1]})
	
				}
				else{
					values.push({"hashtag":hashtag,"value":""})
				}
			}
		}
		
		var children=t["tweet"]["children"]
		for(c in children){
            child = children[c]
			queue.unshift({"tweet":child})
		}

	}

    return values;

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
        var tweetText = allData["tweets"][t]["html"]
        var baseTweet = getBaseTweet(t)
        var hashtags = tweetText.match(/\S*#(?:\[[^\]]+\]|\S+)/gi)
        for (h in hashtags){
            hashtag = hashtags[h].toLowerCase()

            if(hashtagCounts[hashtag] === undefined){
                hashtagCounts[hashtag] = [baseTweet]
            }else{
                if(hashtagCounts[hashtag].indexOf(baseTweet) == -1){
                    hashtagCounts[hashtag].push(baseTweet)
                }
            }
        }
    }
    
    hashtagCountsArray = []
    for( hashtag in hashtagCounts){
        var baseTweets = hashtagCounts[hashtag]
        var counts = baseTweets.length
        hashtagCountsArray.push({"hashtag": hashtag, "counts":counts, "memberTweetIds": baseTweets})
    }
    
    hashtagCountsArray.sort(function(a,b){return b["counts"]-a["counts"]});

    return hashtagCountsArray
    
}

function containsHashtag(biggerHashtag, smallerHashtag){
    var biggerHashtagElements = biggerHashtag["memberTweetIds"]
    var smallerHashtagElements = smallerHashtag["memberTweetIds"]
    
    for(i in smallerHashtagElements){
        var hashtagElement = smallerHashtagElements[i]
        if ( !utils.arrayContains(biggerHashtagElements, hashtagElement)){
            return false
        }
    }
    return true
}

///////////////////////////////////////////////////////////////////
// Given a tweetId, return the hierarchy of all discussions and replies 
//////////////////////////////////////////////////////////////////
function getDiscussionHierarchy(parentTweetId){
	tweetsArray = utils.dictToArray(allData["tweets"])	
    hier = utils.convertToHierarchy(tweetsArray)
    hierarchyFromParentID = utils.filterArray(hier, function(tweetObj){ return tweetObj["tweetObject"]["id"]==parentTweetId })
        
    return hierarchyFromParentID
}

///////////////////////////////////////////////////////////////////
// Given a username, return the name for the users next comment 
// based on the number of comments the user has already made
//////////////////////////////////////////////////////////////////
function getNewTweetId(username){
	counter=allData["users"][username]["counter"]
	newIdName= username+""+counter
	allData["users"][username]["counter"]++;
	return newIdName
}

/////////////////////////////////////////////
// Given a tweetId, return the base Tweet Id
////////////////////////////////////////////
function getBaseTweet(tweetId){
    var targetTweet = allData["tweets"][tweetId]
    if (targetTweet["parent"] == "none"){
        return tweetId
    }else{
        var parentTweetId = targetTweet["parent"]
        return getBaseTweet(parentTweetId)
    }
}

//////////////////////////////////////
// Create new objects for allData
//////////////////////////////////////
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

function createNewTagsObject(parentTweetId, tag, username) {
	var time=getTime();
	var newId = getNewTweetId(username)
	var tagObject = {
		"time":time,
		"html":tag,
		"id":newId,
		"parent":parentTweetId
	}
	return tagObject;
}

function createNewLikesObject(tweetId,username,time){
		/*
	"{
		"id":uist0,
		"username":hmslydia,
        "time": 1
    }
    */
        
    var tweetObject={
    	"id":tweetId,
    	"username":username,
        "time": time,
    }
    
    return tweetObject;
}
function createNewUserObject(newUsername){
	/*
	"hmslydia": {
	        "id": "hmslydia", 
	        "counter":0
	    }
	*/

    var userObject={ 
        "id": newUsername, 
        "counter": 0
    }
    
    return userObject;
}

//////////////////////////
// Takes  baseTweetAndDiscussionObject and returns base IDs SORTED
/////////////////////////


function sortBaseTweetAndDiscussionObjects(baseTweetAndDiscussionObject, sortOrder, username){
	var twts=[]
	for(twt in baseTweetAndDiscussionObject){
		tweetId=baseTweetAndDiscussionObject[twt]["basetweet"]["id"]
		dis=baseTweetAndDiscussionObject[twt]["discussion"]
		
        if(sortOrder == "time" ||sortOrder == "default"){
            twts.push(getMostRecentDiscussionTime(dis))
        }else if (sortOrder == "mostDiscussed"){
            twts.push(getMostDiscussed(dis))
        }else if (sortOrder == "leastDiscussed"){
            twts.push(getMostDiscussed(dis))
        }else if (sortOrder == "mostDiscussedByMe"){
            twts.push(getMostDiscussedByMe(dis, username))
        }else if (sortOrder == "leastDiscussedByMe"){
            twts.push(getMostDiscussedByMe(dis, username))
        }else if(sortOrder == "original"){
            twts.push({"tweetId":tweetId,"priority":baseTweetAndDiscussionObject[twt]["basetweet"]["time"]})
        }
	}
    
    if( sortOrder == "time" || sortOrder == "default" ||sortOrder == "mostDiscussed" || sortOrder == "mostDiscussedByMe" || sortOrder == "original" ){
        twts = twts.sort(function(a,b) { return b["priority"] - a["priority"]} );    
    }else if(sortOrder == "leastDiscussed" || sortOrder == "leastDiscussedByMe"){
        twts = twts.sort(function(a,b) { return a["priority"] - b["priority"]} );
    }
    
	orderedIds = utils.mapArray(twts,function(x){return x["tweetId"]})
	return orderedIds;
}


function getMostDiscussed(discussionObj){

    var countNumberOfDiscussions = 0
    
    var discussionRoot=discussionObj[0]
    var baseTweetId= discussionRoot["tweetObject"]["id"]
    var baseTime=discussionRoot["tweetObject"]["time"]
	var children=discussionRoot["children"];
    	
	//a queue for BFS implementation
	var queue=[]
	var times=[]
	times.push(baseTime)
	//add all the children of the base tweet first
	for(c in children){
        var child = children[c]
		queue.push({"tweet":child})
        countNumberOfDiscussions ++
		//times.push(child["tweetObject"]["time"])
	}
	
	while (queue.length>0){
		t=queue.shift();
		var children=t["tweet"]["children"]
		for(c in children){
            child = children[c]
			queue.unshift({"tweet":child})
            countNumberOfDiscussions ++
			//times.push(child["tweetObject"]["time"])
		}

	}
    return {"tweetId":baseTweetId,"priority":countNumberOfDiscussions};
}

function getMostDiscussedByMe(discussionObj,username){

    var countNumberOfDiscussions = 0
    
    var discussionRoot=discussionObj[0]
    var baseTweetId= discussionRoot["tweetObject"]["id"]
    var baseTime=discussionRoot["tweetObject"]["time"]
	var children=discussionRoot["children"];
    	
	//a queue for BFS implementation
	var queue=[]
	var times=[]
	times.push(baseTime)
	//add all the children of the base tweet first
	for(c in children){
        var child = children[c]
		queue.push({"tweet":child})
        if(child["tweetObject"]["creator"] == username){
            countNumberOfDiscussions ++
        }
		//times.push(child["tweetObject"]["time"])
	}

	while (queue.length>0){
		t=queue.shift();

		var children = t["tweet"]["children"]
		for(c in children){
            
            child = children[c]

			queue.unshift({"tweet":child})
            if(child["tweetObject"]["creator"] == username){

                countNumberOfDiscussions ++
            }
			//times.push(child["tweetObject"]["time"])
		}

	}
    return {"tweetId":baseTweetId,"priority":countNumberOfDiscussions};
}

///////////////////////////////////////////////////////////////////
// Use Breadth First Search over the discussion hierarchy to 
// display the dicussions and replies threaded (indented properly)
//////////////////////////////////////////////////////////////////
function getMostRecentDiscussionTime(discussionObj){

    var discussionRoot=discussionObj[0]
    var baseTweetId= discussionRoot["tweetObject"]["id"]
    var baseTime=discussionRoot["tweetObject"]["time"]
	var children=discussionRoot["children"];
    	
	//a queue for BFS implementation
	var queue=[]
	var times=[]
	times.push(baseTime)
	//add all the children of the base tweet first
	for(c in children){
        var child = children[c]
		queue.push({"tweet":child})
		times.push(child["tweetObject"]["time"])
	}
	
	while (queue.length>0){
		t=queue.shift();
		var children=t["tweet"]["children"]
		for(c in children){
            child = children[c]
			queue.unshift({"tweet":child})
			times.push(child["tweetObject"]["time"])
		}

	}

	times=times.sort(function(a,b) { return b - a} );
    return {"tweetId":baseTweetId,"priority":times[0]};
}


function getAllBaseTweetAndDiscussionObjects(){
    var allTweetsArray = utils.dictToArray(allData["tweets"])
    var baseTweets = utils.filterArray(allTweetsArray, function(tweetObj){ return tweetObj["parent"]=="none" })
    var baseTweetIds = utils.mapArray(baseTweets, function(x){return x["id"]})    
    var baseTweetAndDiscussionObjects = getBaseTweetAndDiscussionObjects(baseTweetIds)
    
    return baseTweetAndDiscussionObjects
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

	return times;
}

function getTimeStampOfMostRecentComment(discussions,tweetId){
	var commentTimes=getTimesOfAllComments(discussions);
	commentTimes.sort(function(a,b){return b - a}) //Array now becomes [41, 25, 8, 71]

	if( commentTimes[0]==undefined){
		return allData["tweets"][tweetId]["time"];
	} 
	else{
		return commentTimes[0]//largest in array
	}
}



///////////////////////////////////////////////////////////////////////
//Given a list of tweetIds, return the list of assoicated TweetAndDiscussionObjects
///////////////////////////////////////////////////////////////////////
function getBaseTweetAndDiscussionObjects(tweetIds){
	var tweetObjects=[];
	
	for (t in tweetIds){
        tweetId = tweetIds[t]
        tweetObj = allData["tweets"][tweetId]
        discussionHierarchy = getDiscussionHierarchy(tweetId)
		tweetObjects.push({"basetweet":tweetObj, "discussion": discussionHierarchy});
	}	
	
	return tweetObjects;
}


///////////////////////////////////////
//Get the current time in miliseconds 
///////////////////////////////////////
function getTime(){
	var d = new Date();
	return d.getTime()
}



//////////////////////////////////////////
// visualize data
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
    writeToFile(allData);
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
				var currentResultsJSON = JSON.stringify(allData);
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
				allData = newResults;
				
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
