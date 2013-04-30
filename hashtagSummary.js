var answer = []


function displayHashtagSummary(hashtagSummary){    
    $("#hashtagSummary").empty()
    
    var goalSpan = $("<span>")
    goalSpan.html("<b>Goal</b>:<br>Each hashtag needs at least two photos<br><br>")
    $("#hashtagSummary").append(goalSpan)

    for(i in hashtagSummary){
        var hashtagSummaryItem = hashtagSummary[i]
        //console.log(hashtagSummaryItem)
        var hashtag = hashtagSummaryItem["hashtag"]["hashtag"]
        var indents = hashtagSummaryItem["parents"].length
        var counts = hashtagSummaryItem["hashtag"]["memberTweetIds"].length
        
        hashtagDiv = createHashtagDiv(hashtag, counts)
        hashtagDiv.css('margin-left',indents*30+"px")
        $("#hashtagSummary").append(hashtagDiv)
    }    
    window.onresize(); 
}

function createHashtagDiv(hashtag, counts){
    div= $("<div>")
    
    hashTagSpan = $("<span class='hashtag'>")
    hashTagSpan.text(hashtag)
    
    wrap = function(span, hashtag){
        span.click(function(){
            //console.log("search for "+hashtag)
            //alert("hierarhcy")
            search(hashtag, "default", "hierarchy", answer)
        })
    }
    wrap(hashTagSpan, hashtag)
    
    countSpan = $("<span >")
    countSpan.text(" ("+counts+")")   
    if(counts == 1){
        countSpan.css("color", "red")
    }    
    
    div.append(hashTagSpan)
    div.append(countSpan)
    return div
}

///////////////////////////////////////////////////////////////


function displayComposeTweet(username){
    $("#composeTweet").empty()
    console.log(username);
    composeTweetDiv = createcomposeTweetDiv(username)
    $("#composeTweet").append(composeTweetDiv)
    
}

function createcomposeTweetDiv(username){
    var div = $("<div id='mainComposeTweetDiv'>")
    var userNameSpan = $("<span class='userNameSpan'>")
    userNameSpan.text("Welcome, "+ username)
    var signOutButton= $("<input type='button' class='btn' id='signOut' value='Sign Out' onclick='signOut()' />")
    var composeTweetBar = $("<textarea class='span2' id='composeTweetTextarea' placeholder='Compose New Tweet' rows='1' onBlur='resetComposeTweet(this)'>")
    //var composeButton = $("<input type='button' class='btn' id='searchSubmit' value= 'Search' />")
    
	var goalSuccessDiv = $("<div id='goalSuccess'>")
	
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
	div.append(goalSuccessDiv)
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