function twitterFeedSetup(){
	ajax("getTwitterFeed", {}, function(returnData) { 
		displayFeed(JSON.parse(returnData)["twitterFeed"]);
		displayHashtagSummary(JSON.parse(returnData)["hashtagSummary"])
		//displayComposeTweet(getUserName())
		colorNewTweets(JSON.parse(returnData)["newTweetCreators"]);
		setRequiredHashtags(JSON.parse(returnData)["requiredHashtags"])
	});
	checkForUpdates()
}

function setRequiredHashtags(requiredHashtags){
	console.log($("#requirements").text());
	console.log(requiredHashtags)
	$("#requirements").val(requiredHashtags.toString());
	console.log($("#requirements").text());
}

function conditionsSetup(){
	//var numMatchingTweetObjects = matchingBaseTweetObjects.length
	//var numNonMatchingBaseTweetObjects = nonMatchingBaseTweetObjects.length

	var conditionsText = $("<span><h2>All tweets must contain:</h2></span><br>")
	var completenessTextArea = $("<input type='text' id='requirements' style='margin:5px; width:20%' onblur='checkForUpdates();' onfocus='checkForUpdates();' onchange='checkForUpdates();' onkeydown='checkForUpdates();' readonly>")
	var completenessButton = $("<input type='button' class='btn' id='outputTableButton' value= 'Output' onclick='outputTable(this)'>")
	var completenessFeedBackDiv = $("<div id='completenessFeedback'>")
    /*
	var happyButton = $("<input type='button' class='btn' id='matchingRequirmentsButton' value='"+numMatchingTweetObjects+" :)'> ")
	happyButton.click(function(){
		displayFeed(matchingBaseTweetObjects)
	})
	$("#completenessEvaluation").append(happyButton)
    
	var sadButton = $("<input type='button' class='btn' id='nonMatchingRequirmentsButton' value='"+numNonMatchingBaseTweetObjects+" :('> ")
	sadButton.click(function(){
		displayFeed(nonMatchingBaseTweetObjects)
	})
    $("#completenessEvaluation").append(sadButton)
	*/
	$("#completenessEvaluation").append(conditionsText)
	$("#completenessEvaluation").append(completenessTextArea)
	//$("#completenessEvaluation").append(completenessButton)
	$("#completenessEvaluation").append(completenessFeedBackDiv)
	
	
	//adjust the margin-top of the twitterFeed div
	var height = $("#completenessEvaluation").height();
	$("#twitterFeed").css('margin-top',height+5);	
}


function displayConditionsUpdate(matchingBaseTweetObjects, nonMatchingBaseTweetObjects){
     $("#completenessFeedback").empty()
     $("#completenessFeedback").css('display','inline-block')
    
     $("#completenessFeedback").css('margin-left','75px')
    //console.log("displayConditionsUpdate")
	var numMatchingTweetObjects = matchingBaseTweetObjects.length
	var numNonMatchingBaseTweetObjects = nonMatchingBaseTweetObjects.length

	var happyButton = $("<input type='button' class='btn' id='matchingRequirmentsButton' value='"+numMatchingTweetObjects+" Complete'> ")
	happyButton.click(function(){
		displayFeed(matchingBaseTweetObjects)
	})
    $("#completenessFeedback").append(happyButton)
    $("#matchingRequirmentsButton").css('margin-right','20px')
	
	var sadButton = $("<input type='button' class='btn' id='nonMatchingRequirmentsButton' value='"+numNonMatchingBaseTweetObjects+" In Progress'> ")
	sadButton.click(function(){
		displayFeed(nonMatchingBaseTweetObjects)
	})


    $("#completenessFeedback").append(sadButton)
	/*
	$("#completenessEvaluation").append(conditionsText)
	$("#completenessEvaluation").append(completenessTextArea)
	$("#completenessEvaluation").append(completenessButton)
	$("#completenessEvaluation").append(happyButton)
	$("#completenessEvaluation").append(sadButton)
	*/
	//adjust the margin-top of the twitterFeed div
	var height = $("#completenessEvaluation").height();
	$("#twitterFeed").css('margin-top',height+5);	
}

function displayFeed(twitterFeed){
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
        
        tweetAndDiscussionDiv = createTweetAndDiscussionDiv(tweetObj, discussionObj)
		$("#twitterFeed").append(tweetAndDiscussionDiv);	
	}
}

function outputTable(outputButton){

	var csv = "<html><head><title>"
	csv += "</title></head><body>";
	csv += "<p>Output ";
	csv += "</p></body></html>";
	csv+= "<table>"
	
	//var csv=$("<div>")
	console.log("OUTPUT TABLE");
	ajax("getTwitterFeed", {}, function(returnData) {
		var twitterFeed = JSON.parse(returnData)["twitterFeed"]
		var baseTweetHashtagSummary = JSON.parse(returnData)["hashtagSummary"]
		
		var baseTweets = map(twitterFeed, function(x){return x["basetweet"] })
		var baseTweetIds = map(baseTweets, function(x){return x["id"]});
		console.log(baseTweetIds);
		
		ajax("getRequiredHashtagValues", {"tweetIds":baseTweetIds}, function(returnData) { 
				var hashtagValues = (JSON.parse(returnData))["requiredHashtagValues"];
				console.log("OUTPUT TABLE");
				console.log(hashtagValues)
				
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
		console.log(requiredHashtagValues)
		var hashtagValuesForTweet = filterArray(requiredHashtagValues, function(x){return x["tweetId"]==baseTweet["id"]})[0]["hashtagValues"];
		console.log(hashtagValuesForTweet);
		
		//baseTweetHashtags = getListOfHashTagsForBaseTweet(baseTweet["id"],baseTweetHashtagSummary);
		var line="<tr><td>"+baseTweet["html"]+"</td>"
		for(cc in ccList){
			//remove whitespace before and after
			completionHashtag = ccList[cc].replace(/^\s*/, "").replace(/\s*$/, "");
			
			var values = filterArray(hashtagValuesForTweet,function(x){return x["hashtag"]==completionHashtag.toLowerCase()});
			console.log("values" + baseTweet["id"] +"  " +completionHashtag)
			console.log(hashtagValuesForTweet);
			console.log(values);
			line += "<td>"
			for(v in values){
				var value = values[v]["value"]
				line+=value + "  "
			}
			line += "</td>"
			//+hashtagValues[completionHashtag.toLowerCase()]+"</td>"
			/*if(baseTweetHashtags.indexOf(completionHashtag)>-1){
				line+="<td>,1</td>"
			}
			else{
				line+="<td>,0</td>"
			}*/
		}
		csv+=line+"</tr>"
		
	}
	console.log("CSV");
	console.log(csv);
	//var completionConditionString = getCompletionConditionHashtags()
	//var ccList = completionConditionString.split(',');
	
	//var baseTweets = 
	//var hashtags = getListOfHashTagsForBaseTweet(baseTweetHashtagSummary)	
	
	//SAVE CSV FILE CALL TO AJAX
	return csv;
}

function getRequiredHashtagValues(baseTweetIds){
	var hashtagValues=""
	ajax("getRequiredHashtagValues", baseTweetIds, function(returnData) { 
		return JSON.parse(returnData);
	});
	console.log(hashtagValues);
	return hashtagValues;
}


function createTweetAndDiscussionDiv(tweetObj, discussionObj){
    var tweetAndDiscussionDiv = $("<div class='row'>")
    
    var baseTweetDiv = createTweetDiv(tweetObj)
    
    var discussionDiv = $("<div class='span5 discussionFeed' style='background:white' id='discussion-"+tweetObj["id"]+"'>")    
    var discussionDivContent = createDiscussionDivContent(discussionObj)
    discussionDiv.append(discussionDivContent)
    
    baseTweetId = tweetObj["id"]
    var baseReplyDiv = createBaseReplyDiv(baseTweetId)
    discussionDiv.append(baseReplyDiv)
        
    tweetAndDiscussionDiv.append(baseTweetDiv)
    tweetAndDiscussionDiv.append(discussionDiv)
    return tweetAndDiscussionDiv
}

function createTweetDiv(tweetObj){
    tweetHTML = tweetObj["html"]
    tweetId= tweetObj["id"]
    tweetCreator = tweetObj["creator"]
    
    div = $("<div class='span4 basetweet' id= '"+tweetId+"'>")
    
    tweetCreatorSpan = $("<span class='user'>")
    tweetCreatorSpan.text(tweetCreator)
    div.append(tweetCreatorSpan)
    div.append("<br>")
    
    tweetHTMLSpan = $("<span class='tweetHTML'>")
    
    
    var re = new RegExp(/\S*#(?:\[[^\]]+\]|\S+)/gi); 
	tweetHTML = tweetHTML.replace(re, "<span class='user' onclick = 'myfunction(\"$&\")' >$&</span>");
                
    tweetHTMLSpan.html(tweetHTML)
    div.append(tweetHTMLSpan)
    /*    
    wrap1 = function(d, tweetId){
        d.click(function(){
            selectTweet(this, tweetId)
        })
    }
    wrap1(tweetHTMLSpan, tweetId)
    */
    wrap2 = function(span, creator){
        span.click(function(){
        console.log("creator: "+creator)
            userSearch(creator)
        })
    }
    wrap2(tweetCreatorSpan, tweetCreator)
    
    return div
}

function myfunction(str){
    //alert(str)
    search(str)
}

function colorNewTweets(newDiscussionCreators){
	for(c in newDiscussionCreators){
			creator=newDiscussionCreators[c];
			$("#tweet-"+creator).css('background-color', 'red');
		}
}
///////////////////////////////////////////////////////////////////
// Use Breadth First Search over the discussion hierarchy to 
// display the dicussions and replies threaded (indented properly)
//////////////////////////////////////////////////////////////////
function createDiscussionDivContent(discussionObj){
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
        
		tweetDiv = createDiscussionDiv(t["tweet"]["tweetObject"], level)
		discussionDiv.append(tweetDiv);
	}
    return discussionDiv
}


///////////////////////////////////////////////////////////////////
// Create a div for the discussion tweet that has the comment that 
//the user made, the username of the commentor and a reply 
//button for others to comment on this comment
//////////////////////////////////////////////////////////////////
function createDiscussionDiv(tweetObj,level){

	var tweetHTML = tweetObj["html"]
    var tweetId= tweetObj["id"]
    var tweetCreator = tweetObj["creator"]
    
    div = $("<div class='tweet subReplyTextArea' id= 'tweet-"+tweetId+"'>")
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
    
    var editButton = $("<input type=button id='edit-"+tweetId+"' value='edit' style='float: right;' >")
    wrapEditButton = function (button, replyDiv, currentContent,twtId){
	    button.click(function(){
		    displayEditDialog(replyDiv, currentContent,twtId)
		    
	    })
    }
    wrapEditButton(editButton, div, tweetHTML,tweetId)
    
    div.append(replyContentDiv)
    div.append(replyButton);
    div.append(editButton)
    div.append(postPlaceholderDiv);
    
    
        
    return div;
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
	//commentDiv = $("#tweet-"+parentTweetId)
	
    var containerDiv = $("<div class='replyTextDiv'>")
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
		//ajax("saveTweet", {"basparentTweetId" : parentTweetId, "replyText":replyText,"username":username}, function(returnData) {
			
	
			parsedReturnData = JSON.parse(returnData)
	
			//discussionFeed=parsedReturnData["discussionFeed"]
			//displayDiscussion(discussionFeed);
			
			//createBaseReplyDiv(parentTweetId);
			
			var baseTweetFeed=parsedReturnData["twitterFeed"]
			var discussionFeed=parsedReturnData["discussionFeed"]
			
			var baseTweetId = discussionFeed[0]["tweetObject"]["id"]
			console.log("DISUCSSION FEED");
			console.log(discussionFeed);
			updateDiscussionFeed(baseTweetId,discussionFeed)
			//displayFeed(baseTweetFeed);
            
			displayHashtagSummary(JSON.parse(returnData)["hashtagSummary"])
			checkForUpdates();
			/*
			parsedReturnData = JSON.parse(returnData)
			discussionFeed=parsedReturnData["discussionFeed"]
			displayDiscussion(discussionFeed);
			toggleReplyDiv(tweetId);
			*/
		});
	}
	else{
		alert("Please Sign In Before Commenting")
	}
}

function updateDiscussionFeed(baseTweetId,dFeed){

	var discussDiv = $("#discussion-"+baseTweetId)
	console.log(discussDiv);
	discussDiv.empty();
		console.log(discussDiv);
		
	var discussionContent =createDiscussionDivContent(dFeed);
	var baseReplyDiv = createBaseReplyDiv(baseTweetId)
    
    
	console.log("DISCUSSION CONTENT");
	console.log(discussionContent);
	discussDiv.append(discussionContent);
	discussDiv.append(baseReplyDiv);
}

