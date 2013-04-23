var goalAchievedTime = -1

function goalSetup(){
    $("#goalDescription").html("Each photo must have at least 1 hashtag")
}

function displayConditionsUpdate(matchingBaseTweetObjects, nonMatchingBaseTweetObjects,likes){
    var numMatchingTweetObjects = matchingBaseTweetObjects.length
	var numNonMatchingBaseTweetObjects = nonMatchingBaseTweetObjects.length
	
	if( checkGoalsCompleted(numNonMatchingBaseTweetObjects) ){
		goalAchievedTime = getTime()
		displayGoalSuccess()
	}else{
		goalAchievedTime = -1
	}
	
	updateGoalStatus()
    
    //remove old feedback and create new completeness buttons
    $("#goalFeedback").empty()
    var happyButton = $("<input type='button' class='btn' id='matchingRequirmentsButton' value='"+numMatchingTweetObjects+" Complete'> ")
	happyButton.click(function(){
        ajax("logFeedbackClicks", {"uiElt":"complete", "notes":numMatchingTweetObjects}, function(returnData) {})
        displayFeed(matchingBaseTweetObjects,likes)
    })
    $("#goalFeedback").append(happyButton)
	
    // UNsatisfied Constraints
	var sadButton = $("<input type='button' class='btn' id='nonMatchingRequirmentsButton' value='"+numNonMatchingBaseTweetObjects+" Need work'> ")
	sadButton.click(function(){
		ajax("logFeedbackClicks", {"uiElt":"incomplete", "notes":numNonMatchingBaseTweetObjects}, function(returnData) {})
        displayFeed(nonMatchingBaseTweetObjects,likes)
	})
    $("#goalFeedback").append(sadButton)
    
    positionTwitterFeedBelowCompletenessEvaluation()
}

function checkGoalsCompleted(numNonMatchingBaseTweetObjects){
	if(numNonMatchingBaseTweetObjects > 0){
		return false
	}else if(numSingletonHashtags() > 0 ){
		return false
	}else{
		return true	
	}
}

function numSingletonHashtags(){
	var count = 0
    for(i in answer){
        var hashtagSummaryItem = answer[i]
        var hashtag = hashtagSummaryItem["hashtag"]["hashtag"]
        var counts = hashtagSummaryItem["hashtag"]["memberTweetIds"].length
        
		if(counts == 1){
			count++
		}
    } 
	return count
}

function displayGoalSuccess(){
	//calculated the time since the goal was achieved.
	var currentTime = getTime()	
	var millisecondsSinceGoalAchieved = currentTime - goalAchievedTime
	var minutesSinceGoalAchieved = millisecondsSinceGoalAchieved/(60*1000)
	
	if(minutesSinceGoalAchieved < 1 ){
		
	}else if (minutesSinceGoalAchieved < 2){
	
	}else if(minutesSinceGoalAchieved < 3){
	
	}else if(minutesSinceGoalAchieved < 4){
	
	}

}

function updateGoalStatus(){
	var goalSuccessDiv = $("#goalSuccess")
	goalSuccessDiv.empty()
	goalSuccessDiv.append("<b>asdf</b>")
}