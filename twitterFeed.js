tweetClickUpdateTimes = []

function twitterFeedSetup(){

	ajax("getTwitterFeed", {}, function(returnData) {         
        var likes = JSON.parse(returnData)["likes"]
        var twitterFeed = JSON.parse(returnData)["twitterFeed"]
        var hashtagSummary = JSON.parse(returnData)["hashtagSummary"]
        var newTweetCreators = JSON.parse(returnData)["newTweetCreators"]
        var newLikeIds = JSON.parse(returnData)["newLikeIds"]
        var requiredHashtags = JSON.parse(returnData)["requiredHashtags"]
        var lastRefreshTime = JSON.parse(returnData)["lastRefreshTime"]
        
        resetTweetClickUpdateTimes(twitterFeed,lastRefreshTime);
		displayFeed(twitterFeed,likes);
		displayHashtagSummary(hashtagSummary)
		//displayComposeTweet(getUserName())
		colorNewTweets(newTweetCreators);
		colorNewLikes(newLikeIds)
		setRequiredHashtags(requiredHashtags)
	});
	checkForUpdates()
}


function resetTweetClickUpdateTimes(twitterFeed,lastRefreshTime){
	for(var i = 0; i < twitterFeed.length; i++) {
		var tweet = twitterFeed[i]["basetweet"]
		var tweetId = tweet["id"]
		tweetClickUpdateTimes[tweetId]=({"tweetId": tweetId,"lastRefreshTime":lastRefreshTime})
	}
}

function getTime(){
	var d = new Date();
	return d.getTime()
}


function setRequiredHashtags(requiredHashtags){

	$("#requirements").val(requiredHashtags.toString());

}

//DEPREICATED
function conditionsSetup(){
	//goal instructions for the users.   
	var conditionsText = $("<span><h2>Goal: All items must contain at least one hashtag:</h2></span><br>")
	//var completenessTextArea = $("<input type='text' id='requirements' style='margin:5px; width:20%' onblur='checkForUpdates();' onfocus='checkForUpdates();' onchange='checkForUpdates();' onkeydown='checkForUpdates();' readonly>")
    var completenessFeedBackDiv = $("<div id='completenessFeedback'>")

	$("#completenessEvaluation").append(conditionsText)
	//$("#completenessEvaluation").append(completenessTextArea)
	$("#completenessEvaluation").append(completenessFeedBackDiv)
		
	positionTwitterFeedBelowCompletenessEvaluation()	
}

/*
//DEPRICATED
function displayConditionsUpdate(matchingBaseTweetObjects, nonMatchingBaseTweetObjects,likes){
    var numMatchingTweetObjects = matchingBaseTweetObjects.length
	var numNonMatchingBaseTweetObjects = nonMatchingBaseTweetObjects.length
    
    //remove old feedback and create new completeness buttons
    $("#completenessFeedback").empty()
    var happyButton = $("<input type='button' class='btn' id='matchingRequirmentsButton' value='"+numMatchingTweetObjects+" Complete'> ")
	happyButton.click(function(){
		displayFeed(matchingBaseTweetObjects,likes)
	})
    $("#completenessFeedback").append(happyButton)
	
    // UNsatisfied Constraints
	var sadButton = $("<input type='button' class='btn' id='nonMatchingRequirmentsButton' value='"+numNonMatchingBaseTweetObjects+" In Progress'> ")
	sadButton.click(function(){
		displayFeed(nonMatchingBaseTweetObjects,likes)
	})
    $("#completenessFeedback").append(sadButton)
    
    positionTwitterFeedBelowCompletenessEvaluation()
}
*/

function positionTwitterFeedBelowCompletenessEvaluation(){
	//adjust the margin-top of the twitterFeed div
	var height = $("#completenessEvaluation").height();
	$("#twitterFeed").css('margin-top',height+5);	
}

function displayFeed(twitterFeed,likes){    
    //displayConditionsUpdate([],[])
	$("#twitterFeed").empty()	
	
	
	//completetionDiv = $("<div class='span10' style='background:white'>")
	//completetionRow.append(completetionDiv);
	
	//$("#completenessEvaluation").append(completetionRow);
		
	//twitterFeedDiv = $("#twitterFeed").append($("<div class='row'>"));
	
	//display all the tweets
	var searchResultsCount = twitterFeed.length
	var tweetAndDiscussionDiv = $("<div>")
	//var tweetDiv = $("<div class='span4 basetweet'>")
	//$(tweetDiv).text("results = "+searchResultsCount);
	
	//tweetAndDiscussionDiv.append(tweetDiv);
	$("#twitterFeed").append(tweetAndDiscussionDiv);
    
	for(var i = 0; i < twitterFeed.length; i++) {
        tweetObj = twitterFeed[i]["basetweet"]  
        discussionObj = twitterFeed[i]["discussion"]  
        
        tweetAndDiscussionDiv = createTweetAndDiscussionDiv(tweetObj, discussionObj,likes)
		$("#twitterFeed").append(tweetAndDiscussionDiv);
			
	}
}

function outputTable(outputButton){

	var csv = "<html><head><title>"
	csv += "</title></head><body>";
	csv += "<p>Output ";
	csv += "</p></body></html>";
	csv+= "<table>"
	

	ajax("getTwitterFeed", {}, function(returnData) {
		var twitterFeed = JSON.parse(returnData)["twitterFeed"]
		var baseTweetHashtagSummary = JSON.parse(returnData)["hashtagSummary"]
		
		var baseTweets = map(twitterFeed, function(x){return x["basetweet"] })
		var baseTweetIds = map(baseTweets, function(x){return x["id"]});
		
		ajax("getRequiredHashtagValues", {"tweetIds":baseTweetIds}, function(returnData) { 
				var hashtagValues = (JSON.parse(returnData))["requiredHashtagValues"];

				
				csv+=createTableRows(csv, baseTweets, hashtagValues)
				csv+= "</table>"
				
				var j = window.open();
				j.document.write(csv);
				
		})
		
		})
}

function createTableRows(csv,baseTweets, requiredHashtagValues){	
	var completionConditionString = getCompletionConditionHashtags()
	csv+= "<tr><td>Task,</td>";
	
	var ccList = completionConditionString.split(',');
	
	var line="";
	for(cc in ccList){
		completionHashtag = ccList[cc].replace(/^\s*/, "").replace(/\s*$/, "");
		line+="<td>"+completionHashtag+"</td>"
	}
	csv+=line+"</tr>"
	for(bt in baseTweets){
		baseTweet = baseTweets[bt]

		var hashtagValuesForTweet = filterArray(requiredHashtagValues, function(x){return x["tweetId"]==baseTweet["id"]})[0]["hashtagValues"];

		
		//baseTweetHashtags = getListOfHashTagsForBaseTweet(baseTweet["id"],baseTweetHashtagSummary);
		var line="<tr><td>"+baseTweet["html"]+"</td>"
		for(cc in ccList){
			//remove whitespace before and after
			completionHashtag = ccList[cc].replace(/^\s*/, "").replace(/\s*$/, "");
			
			var values = filterArray(hashtagValuesForTweet,function(x){return x["hashtag"]==completionHashtag.toLowerCase()});

			line += "<td>"
			for(v in values){
				var value = values[v]["value"]
				line+=value + "  "
			}
			line += "</td>"
		}
		csv+=line+"</tr>"
		
	}
	return csv;
}

function getRequiredHashtagValues(baseTweetIds){
	var hashtagValues=""
	ajax("getRequiredHashtagValues", baseTweetIds, function(returnData) { 
		return JSON.parse(returnData);
	});
	return hashtagValues;
}



function createTweetAndDiscussionDiv(tweetObj, discussionObj,likes){

    var tweetAndDiscussionDiv = $("<div class='row'>")
    
    var baseTweetDiv = createTweetDiv(tweetObj)
    
    var discussionDiv = $("<div class='span5 discussionFeed' style='background:white' id='discussion-"+tweetObj["id"]+"'>")    

    var discussionDivContent = createDiscussionDivContent(discussionObj,likes)

    wrap = function(div, id){
        $(div).click(function(index){
            ajax("updateLocation",{"id":id},function(){})
        })
    }
    wrap(discussionDiv, tweetObj["id"] )
    var row = $("<div class='row'>"); 
    discussionDiv.append(row);
    discussionDiv.append(discussionDivContent)

    
    baseTweetId = tweetObj["id"]
    var baseReplyDiv = createBaseReplyDiv(baseTweetId)
    var hashTags = $("<div class='span2 hash'>");
    var input = $("<input type='text' class='hashInput' id='input-" + baseTweetId + "'>");
    var paragraph = $("<p>");
    paragraph.text("Enter in a hashtag:");
    hashTags.append(paragraph);
    hashTags.append(input);
	row.append(hashTags)



    row.append(baseReplyDiv)
        
    tweetAndDiscussionDiv.append(baseTweetDiv)
    tweetAndDiscussionDiv.append(discussionDiv)
    return tweetAndDiscussionDiv
}

function createTweetDiv(tweetObj){

    var tweetHTML = tweetObj["html"]
    var tweetId= tweetObj["id"]
    var tweetCreator = tweetObj["creator"]

    
    clickableDiv = $("<a id='clickable-"+tweetId+"'>");
    div = $("<div class='span4 basetweet' id= '"+tweetId+"'>")
    
    tweetCreatorSpan = $("<span class='user'>")
    tweetCreatorSpan.text(tweetCreator)
    div.append(tweetCreatorSpan)
    div.append("<br>")
    
    tweetHTMLSpan = $("<span class='tweetHTML'>")
    
    
    var re = new RegExp(/\S*#(?:\[[^\]]+\]|\S+)/gi); 
	tweetHTML = tweetHTML.replace(re, "<span class='user' onclick = 'search(\"$&\")' >$&</span>");
                
    tweetHTMLSpan.html(tweetHTML)
    div.append(tweetHTMLSpan)
        
    wrap1 = function(d, twtId){
        d.click(function(){
            refreshDiscussion(twtId)
            $("#"+tweetId).removeClass('newDiscussion2');
            tweetClickUpdateTimes[twtId]["lastRefreshTime"] = getTime();
        })
    }
    wrap1(clickableDiv, tweetId)
    
    wrap2 = function(span, creator){
        span.click(function(){
        userSearch(creator)
        })
    }
    wrap2(tweetCreatorSpan, tweetCreator)
    
    clickableDiv.append(div);
    return clickableDiv
}

function colorNewTweets(newDiscussionCreators){
	for(c in newDiscussionCreators){
			creator=newDiscussionCreators[c];
			$("#"+creator).addClass("newDiscussion")
			//css('background-color', 'pink');
	}
}

function colorNewTweetsInTheFeedAndUpdateNewTweetCount(newDiscussionCreators){
	var count = 0;
	ajax("getBaseTweetIds", {"tweetIds" : newDiscussionCreators}, function(returnData) {
		var baseTweetIds = JSON.parse(returnData)["baseTweetIds"]
		var lastRefreshTime = JSON.parse(returnData)["lastRefreshTime"]
		var twitterFeed = JSON.parse(returnData)["tweets"]
		
		for(c in baseTweetIds){
			creator=baseTweetIds[c];
			if(tweetClickUpdateTimes[creator]['lastRefreshTime'] < twitterFeed[newDiscussionCreators[c]]['time'] ){
				$("#"+creator).addClass("newDiscussion2")
				count++;
			}
			else{
				$("#"+creator).removeClass('newDiscussion2');
			}
		}
		updateNewTweetCount(count);
	});
}

function colorNewLikes(newLikeIds){

	for(c in newLikeIds){
		newLikeId=newLikeIds[c];
		$("#likesCount-"+newLikeId).addClass("newLike")

	}
}
///////////////////////////////////////////////////////////////////
// Use Breadth First Search over the discussion hierarchy to 
// display the dicussions and replies threaded (indented properly)
//////////////////////////////////////////////////////////////////
function createDiscussionDivContent(discussionObj,likes){
    var discussionRoot=discussionObj[0]
    var baseTweetId=discussionRoot["tweetObject"]["id"]
	var children=discussionRoot["children"];
	var discussionDiv = $("<div>")
    
	//how deep in the thread is it
	var level=0;
	
	//a queue for BFS implementation
	var queue=[]
		
	//add all the children of the base tweet first
	for(c in children){
        var child = children[c]
		queue.push({"tweet":child,"level":level})
	}
	queue=queue.sort(function(a,b) { return a["tweet"]["tweetObject"]["time"] - b["tweet"]["tweetObject"]["time"]} );
	
	while (queue.length>0){
		t=queue.shift();
		var children=t["tweet"]["children"]
		level=t["level"]
		
		for(c in children){
            child = children[c]
			queue.unshift({"tweet":child,"level":level+1})
		}
        
		tweetDiv = createDiscussionDiv(t["tweet"]["tweetObject"], level,likes)
		discussionDiv.append(tweetDiv);
	}
    return discussionDiv
}

function populatePastTags(div, id) {
	var array = ["lol", "omnom", "cats", "dogs", "mice"];
	for(var i = 0; i < array.length; i++) {
		var item = $("<input type='checkbox'>");
		var words = $("<span>");
		words.text(array[i]);
		div.append(item);
		div.append(words);
		div.append($("<br/>"));
	}
	return div;
}


///////////////////////////////////////////////////////////////////
// Create a div for the discussion tweet that has the comment that 
//the user made, the username of the commentor and a reply 
//button for others to comment on this comment
//////////////////////////////////////////////////////////////////
function createDiscussionDiv(tweetObj,level,likes){
	var overall = $("<div class='row'>");
	var tweetHTML = tweetObj["html"]
    var tweetId= tweetObj["id"]
    var tweetCreator = tweetObj["creator"]
    
    var hash = $("<div class='hash span2'>");
    var pastHashTags = $("<div class='pastTags'>");
    pastHashTags = populatePastTags(pastHashTags, tweetId);
    hash.append(pastHashTags);
    overall.append(hash);
    div = $("<div class='tweet subReplyTextArea span3' id= '"+tweetId+"'>")
    overall.append(div);
    barDiv = $("<div style='margin-top:25px;'>")
    //indent the tweet based on how deeply threaded it is
	//multiply by 30 px per level
    div.css('margin-left',5+level*30+"px");


    
    replyContentDiv = $("<div>")
    replyContentDiv.html("<b>"+tweetCreator + "</b><br>" + tweetHTML)
    
    var replyButton = $("<input type=button id='replyTo-"+tweetId+"' value='reply' style='float: right;' class='unclicked'>")
    var postPlaceholderDiv = $("<div class='postPlaceholder unclicked'>")
        
    wrap = function (button, placeholderDiv,twtId){
	    button.click(function(){
		    toggleReplyDiv(placeholderDiv,twtId)
		    
	    })
    }
    wrap(replyButton, postPlaceholderDiv,tweetId)

    var likesCount = filterArray(likes, function(x){return x["id"]==tweetId}).length;
    
    var userLikesCount = filterArray(likes, function(x){return x["id"]==tweetId && x["username"]==getUserName()}).length;
   
    
    var editButton = $("<input type='button' id='edit-"+tweetId+"' value='edit' style='float: right;' >")
    var likeButton = $("<input type='button' id='like-"+tweetId+"' value='like' style='float: right;' >")
   
    
    var likeImage = $("<img id='likeImage' src='http://homes.cs.washington.edu/~felicia0/images/twitify/likeButton.png' height='40px' style='float: right; height:25px;'>")
    
    
    var label = $("<span id='likesCount-"+tweetId+"'>");
    label.text("("+likesCount +")");
    label.css('height','25px');
    label.css('float','right');
    label.css('padding-top','4px');
    
    if(userLikesCount>0){
	    likeButton.val("Unlike");
    }
    else{
	    likeButton.val("like");
    }
   
    
    wrapEditButton = function (button, replyDiv, currentContent,twtId){
	    button.click(function(){
		    displayEditDialog(replyDiv, currentContent,twtId)
		    
	    })
    }
    wrapEditButton(editButton, div, tweetHTML,tweetId)
    
    
    wrapLikeButton = function (button,twtId,usrLikesCount){
    button.click(function(){
    	if(usrLikesCount==0){
		    ajax("updateLikes", {"tweetId" : twtId}, function(returnData) {
			    refreshDiscussion(twtId); 
		    });
	    }
	    
    })
    }
    wrapLikeButton(likeButton,tweetId,userLikesCount)
    
    div.append(replyContentDiv)
    barDiv.append(replyButton);
    barDiv.append(editButton)
    barDiv.append(likeButton);
    if(likesCount >0){
        barDiv.append(likeImage);
	    barDiv.append(label);
    }
    
    overall.append(postPlaceholderDiv); //divBar
    div.append(barDiv)
    return overall;
}

///////////////////////////////////////////////////////////////////
// Pops up the reply textarea and the post button
// toggles the textarea as reply is clicked
// if the post button is clicked, add the discussion tweet (save reply) 
//////////////////////////////////////////////////////////////////
function toggleReplyDiv(postPlaceholderDiv,tweetId){

	if((postPlaceholderDiv).hasClass('unclicked')){
		
		(postPlaceholderDiv).removeClass('unclicked');
		(postPlaceholderDiv).addClass('clicked');
		
		postActionDiv=$("<div id='commentContainer_"+tweetId+"'>")
		postTextarea = $("<textarea class='replyTextArea' id='replyText-"+tweetId+"'/>")
		postButton = $("<input type='button' class='replyButton' name='visible' id='postButton-"+tweetId+"' value='post'>")
		postActionDiv.append(postTextarea);
		postActionDiv.append(postButton);
		
		wrap = function(button,ptextarea, twtId){
		    button.click(function(){
			    replyText=ptextarea.val();
			    saveReply(replyText,twtId)  
		    })
		}
		wrap(postButton, postTextarea,tweetId)
	
		$(postPlaceholderDiv).append(postActionDiv);
	}
	else if((postPlaceholderDiv).hasClass('clicked')){
		(postPlaceholderDiv).removeClass('clicked');
		(postPlaceholderDiv).addClass('unclicked');
		
		$(postPlaceholderDiv).empty();
	}
    
}


function createBaseReplyDiv(parentTweetId){
	//discussionDiv = $("#discussionDiv")
	//commentDiv = $("#"+parentTweetId)
    var containerDiv = $("<div class='replyTextDiv span3'>")
	var div = $("<textarea class='replyTextArea' id='replyTo-"+parentTweetId+"'>")
	var replyButton = $("<input type='button' class='replyButton' value='post'>")
	
	/*wrap = function(d, twtId){
        d.click(function(){
        replyText=$("#replyTo-"+twtId).val();
	    saveReply(replyText,twtId)  
        })
    }
    wrap(replyButton, parentTweetId)*/
    	wrap = function(d,divCopy, twtId){
	        d.click(function(){
	        //replyText=$("#replyText-"+twtId).val();
	        replyText=divCopy.val();
		    saveReply(replyText,twtId)  
	        })
	    }
	    wrap(replyButton, div,parentTweetId)
    
    containerDiv.append(div);
	containerDiv.append(replyButton);
    
    return containerDiv
    
}


function saveReply(replyText,parentTweetId){
	username=getUserName();
	if(username!="" && $("#signInOut").val()!="Sign In"){
		
		ajax("saveTweet", {"parentTweetId" : parentTweetId, "replyText":replyText,"username":username}, function(returnData) {	
			
			parsedReturnData = JSON.parse(returnData)
			var baseTweetFeed=parsedReturnData["twitterFeed"]
			var discussionFeed=parsedReturnData["discussionFeed"]
			var likes =  parsedReturnData["likes"]
			
			var baseTweetId = discussionFeed[0]["tweetObject"]["id"]
			
			updateDiscussionFeed(baseTweetId,discussionFeed,likes)
            
			displayHashtagSummary(JSON.parse(returnData)["hashtagSummary"])
			checkForUpdates();

		});
	}
	else{
		alert("Please Sign In Before Commenting")
	}
}

function updateDiscussionFeed(baseTweetId,dFeed,likes){
	tweetClickUpdateTimes[baseTweetId]["lastRefreshTime"] = getTime();
	var discussDiv = $("#discussion-"+baseTweetId)
	discussDiv.empty();
		
	var discussionContent =createDiscussionDivContent(dFeed,likes);
	var baseReplyDiv = createBaseReplyDiv(baseTweetId)
    
	discussDiv.append(discussionContent);
	var row = $("<div class='row'>");
	var hashTags = $("<div class='span2 hash'>");
	var input = $("<input type='text' class='hashInput' id='input-" + baseTweetId + "'>");
    var paragraph = $("<p>");
    paragraph.text("Enter in a hashtag:");
    hashTags.append(paragraph);
    hashTags.append(input);

    row.append(hashTags);
	row.append(baseReplyDiv);
	discussDiv.append(row);
}

