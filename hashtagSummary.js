var answer = []


function displayHashtagSummary(hashtagSummary){    
    $("#hashtagSummary").empty()
    
    var goalSpan = $("<span>")
    goalSpan.html("<b>Goal</b>:<br>Each category has at least two items<br><br>")
    $("#hashtagSummary").append(goalSpan)

    answer = []
    var allHashtags = []
    for( i in hashtagSummary){
        var hashtagObject = hashtagSummary[i]
        allHashtags.push({"hashtag":hashtagObject, "parents":[]} )
    }
    orderAndEnchild(allHashtags, allHashtags)
    console.log("answer")
    console.log(answer)
    //console.log(hashtagSummary)

    for(i in answer){
        var hashtagSummaryItem = answer[i]
        console.log(hashtagSummaryItem)
        var hashtag = hashtagSummaryItem["hashtag"]["hashtag"]
        var indents = hashtagSummaryItem["parents"].length
        var counts = hashtagSummaryItem["hashtag"]["memberTweetIds"].length
        
        hashtagDiv = createHashtagDiv(hashtag, counts)
        hashtagDiv.css('margin-left',indents*30+"px")
        $("#hashtagSummary").append(hashtagDiv)
    }    
    
}

function createHashtagDiv(hashtag, counts){
    div= $("<div>")
    
    hashTagSpan = $("<span class='hashtag'>")
    hashTagSpan.text(hashtag)
    
    wrap = function(span, hashtag){
        span.click(function(){
            console.log("search for "+hashtag)
            //alert("hierarhcy")
            search(hashtag, "default", "hierarchy", answer)
        })
    }
    wrap(hashTagSpan, hashtag)
    
    countSpan = $("<span >")
    countSpan.text(" ("+counts+")")    
    
    div.append(hashTagSpan)
    div.append(countSpan)
    return div
}

function orderAndEnchild(hashtagArray, allHTags){
    //console.log("hashtagArray")
    //console.log(hashtagArray)
    var sortedHashtagArray = hashtagArray.sort(function(a,b){return b["hashtag"]["memberTweetIds"].length - a["hashtag"]["memberTweetIds"].length});
    
    var queue = []
    for( i in sortedHashtagArray ){
        var hashtagObj = sortedHashtagArray[i]
        queue.push(hashtagObj)
        console.log("hashtagObj")
        console.log(hashtagObj["hashtag"])
    }
    
    while( queue.length > 0 ){
        var largestHashtag = queue[0]
        var largestHashtagId = largestHashtag["hashtag"]["hashtag"]
        answer.push(largestHashtag)
        //remove largestHashtag from the array
        var index = queue.indexOf(largestHashtag);
        var eltToSplice = queue.splice(index, 1)
        
        var lookForChildrenHashtags = []
        
        for( i in sortedHashtagArray){
            var elt = sortedHashtagArray[i]
            if (elt != largestHashtag){
                lookForChildrenHashtags.push(elt)
            }
        }
        
        //find all the children of this hashtag
        var childrenOflargestHashtag = filterArray(lookForChildrenHashtags, function(x){return isChildOfArray(largestHashtag["hashtag"]["memberTweetIds"], x["hashtag"]["memberTweetIds"])})
        //remove them from the queue
        for( i in childrenOflargestHashtag){
            var elt = childrenOflargestHashtag[i]
            //remove elts from queue
            var index = queue.indexOf(elt);
            if(index > -1){
                var eltToSplice2 = queue.splice(index, 1);
                //Note: we only want to remove it from the queue if it isn't already been removed (this happens when you have 
                //a hashtag that is the child of two parents.  The first time it gets enchilded, it is removed, the second time
                //it is enchilded, you can't remove it (it isn't in the queue anymore)
            }
        }
        //operate on all children
        //CHANGE THEIR PARENTAGE - I NEED COPIES
        //add parents to the children AND recurse into them
        
        var parentsParents = largestHashtag["parents"]
        var parentsForNewElts = []
        for( i in parentsParents){
            var parentParent = parentsParents[i]
            parentsForNewElts.push(parentParent)
        }
        parentsForNewElts.push(largestHashtagId)
        
        copiesOfChildrenOflargestHashtag = []
        for( i in childrenOflargestHashtag){
            child = clone(childrenOflargestHashtag[i])
            child["parents"] = parentsForNewElts
            copiesOfChildrenOflargestHashtag.push(child)
        }
        
        orderAndEnchild(copiesOfChildrenOflargestHashtag, allHTags)
    }

}

function isChildOfArray(arr1, arr2){    
    rtn = true
    //all the elts of arr2 are in arr1
    for(i in arr2){
        elt2 = arr2[i]
        if (arr1.indexOf(elt2) == -1){
            rtn = false
        }
    }
    
    return rtn
}

function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}

///////////////////////////////////////////////////////////////


function displayComposeTweet(username){
    $("#composeTweet").empty()
    console.log(username);
    composeTweetDiv = createcomposeTweetDiv(username)
    $("#composeTweet").append(composeTweetDiv)
    
}

function createcomposeTweetDiv(username){
    div= $("<div id='mainComposeTweetDiv'>")
    var userNameSpan = $("<span class='userNameSpan'>")
    userNameSpan.text("Welcome, "+ username)
    var signOutButton= $("<input type='button' class='btn' id='signOut' value='Sign Out' onclick='signOut()' />")
    var composeTweetBar = $("<textarea class='span2' id='composeTweetTextarea' placeholder='Compose New Tweet' rows='1' onBlur='resetComposeTweet(this)'>")
    //var composeButton = $("<input type='button' class='btn' id='searchSubmit' value= 'Search' />")
    
    wrap = function(composeTwt,mainDiv){
        composeTwt.focus(function(){
        
	        var newTweetText = $("#composeTweetTextarea").val();
		
	        console.log(newTweetText);
			if(newTweetText==""){
	            composeTwt.attr('placeholder',"");
	            composeTwt.attr('rows',"4");
	            var composeButton = $("<input type='button' class='btn' id='composeTweetButton' value= 'Tweet' onclick='createNewTweet()'/>")
	            composeButton.css('background','#a0d9f8');
	            composeButton.css('float','right')
	            mainDiv.css('padding-bottom','30px');
	            mainDiv.append(composeButton);
	        
	        }
	    })
    }
    wrap(composeTweetBar,div)
    
    div.append(userNameSpan)
    div.append(signOutButton)
    //div.append(composeTweetBar)
    return div
}

function resetComposeTweet(composeTwt){
	var newTweetText = $("#composeTweetTextarea").val();
	
	console.log(newTweetText);
	if(newTweetText==""){
		$(composeTwt).attr('placeholder',"Compose New Tweet");
	    $(composeTwt).attr('rows',"1")
	    $("#mainComposeTweetDiv").css('padding-bottom','0px');
	    $("#composeTweetButton").remove();
    }
}

function createNewTweet(){
	var newTweetText = $("#composeTweetTextarea").val();
	$("#composeTweetTextarea").val("");
	var username=getUserName();

	
	if(newTweetText!=""){
	
		$("#composeTweetTextarea").attr('placeholder',"Compose New Tweet");
	    $("#composeTweetTextarea").attr('rows',"1")
	    $("#mainComposeTweetDiv").css('padding-bottom','0px');
	    $("#composeTweetButton").remove();
	    
		ajax("createNewTweet", {"tweetText":newTweetText,"username":username}, function(returnData) {
			displayFeed(JSON.parse(returnData)["twitterFeed"]);
			displayHashtagSummary(JSON.parse(returnData)["hashtagSummary"])
			colorNewTweets(JSON.parse(returnData)["newTweetCreators"]);
		});
	}
}