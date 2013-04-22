function updateTweet(tweetId, newContent){
    ajax("updateTweet", {"tweetId":tweetId, "newContent": newContent}, function(returnData) {
        //bold the term that was searched
        /*
        discussionHierarchyForThisBaseTweet = JSON.parse(returnData)["discussionHierarchy"]
        hashtagSummary = JSON.parse(returnData)["hashtagSummary"]
        baseTweetId = JSON.parse(returnData)["baseTweetId"]

        updateDiscussionFeed(baseTweetId,discussionHierarchyForThisBaseTweet)        
        displayHashtagSummary(hashtagSummary)
        */
        var baseTweetId = JSON.parse(returnData)["baseTweetId"]
        discussionHierarchyForThisBaseTweet = JSON.parse(returnData)["discussionHierarchy"]
        
        tweetClickUpdateTimes[baseTweetId]["lastRefreshTime"] = getTime();
        
        hashtagSummary = JSON.parse(returnData)["hashtagSummary"]
        baseTweetId = JSON.parse(returnData)["baseTweetId"]
        var likes = JSON.parse(returnData)["likes"]
        
        updateDiscussionFeed(baseTweetId,discussionHierarchyForThisBaseTweet,likes)        
        displayHashtagSummary(hashtagSummary)        
        
	});
}

function refreshDiscussion(tweetId){

    ajax("getDiscussion", {"tweetId":tweetId}, function(returnData) {
        //bold the term that was searched
        var baseTweetId = JSON.parse(returnData)["baseTweetId"]
        discussionHierarchyForThisBaseTweet = JSON.parse(returnData)["discussionHierarchy"]
        
        tweetClickUpdateTimes[baseTweetId]["lastRefreshTime"] = getTime();
        
        hashtagSummary = JSON.parse(returnData)["hashtagSummary"]
        baseTweetId = JSON.parse(returnData)["baseTweetId"]
        var likes = JSON.parse(returnData)["likes"]
        
        updateDiscussionFeed(baseTweetId,discussionHierarchyForThisBaseTweet,likes)        
        displayHashtagSummary(hashtagSummary)
	});
}

function displayEditDialog(replyContentDiv, tweetHTML, tweetId){
    $(replyContentDiv).empty()
    
    editDiv = $("<div>")
    
    editTextarea = $("<textarea class='editTextArea' id='editText-"+tweetId+"' style='width:95%; height:100px;'/>")
    editTextarea.val(tweetHTML)
    
    
    saveButton = $("<input type='button' class='updateButton' id='updateButton-"+tweetId+"' value='Update'>")
    
    wrapSaveButton = function(button, editTxtArea){
        button.click(function(){
            //send this data to the server
            //redisplay the discussion for this tweet
            newContent = $(editTxtArea).val()
            updateTweet(tweetId, newContent)        
        })
    }
    wrapSaveButton(saveButton, editTextarea)
    
    abandonButton = $("<input type='button' class='abandonButton' id='abandonButton-"+tweetId+"' value='Abandon changes'>")
    abandonButton.click(function(){
        //redisplay the discussion for this tweet
        refreshDiscussion(tweetId)
    })

    editDiv.append(editTextarea);   
    editDiv.append(saveButton);     
    editDiv.append(abandonButton); 
    
    $(replyContentDiv).append(editDiv)
}

/*
    	wrap = function(d,divCopy, twtId){
	        d.click(function(){
	        //replyText=$("#replyText-"+twtId).val();
	        replyText=divCopy.val();
		    saveReply(replyText,twtId)  
	        })
	    }
	    wrap(replyButton, div,parentTweetId)
*/