var goalAchievedTime = -1

function goalSetup(){
    $("#goalDescription").html("Each photo must have at least 1 hashtag")
}

function displayConditionsUpdate(matchingBaseTweetObjects, nonMatchingBaseTweetObjects,likes){
    var numMatchingTweetObjects = matchingBaseTweetObjects.length
	var numNonMatchingBaseTweetObjects = nonMatchingBaseTweetObjects.length
	
	if( checkGoalsCompleted(numNonMatchingBaseTweetObjects) ){
        console.log("checkGoalsCompleted: ")
		if(goalAchievedTime == -1){
            goalAchievedTime = getTime()
        }
		displayGoalSuccess()
	}else{
        var goalSuccessDiv = $("#goalSuccess")
        goalSuccessDiv.empty()
        
		goalAchievedTime = -1
	}
	
	//updateGoalStatus()
    
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
        console.log('severity 1: '+millisecondsSinceGoalAchieved)
		updateGoalStatus("Congrats! The goals have been met!", 1)
	}else if (minutesSinceGoalAchieved < 2){
        updateGoalStatus("Goals met! Start adding finishing touches", 2)
	}else if(minutesSinceGoalAchieved < 3){
        updateGoalStatus("Think about finishing...", 3)
	}else if(minutesSinceGoalAchieved < 4){
        updateGoalStatus("Done is better than perfect.  Please finish soon.", 4)
	}

}

function updateGoalStatus(message, severity){
	var goalSuccessDiv = $("#goalSuccess")
	goalSuccessDiv.empty()
    var messageDiv = $("<div>")
    messageDiv.html("<b>"+message+"</b>")
    if(severity == 1){
        messageDiv.css("background-color", "yellow")
    }else if (severity == 2){
        messageDiv.css("background-color", "orange")
    }else if (severity == 3){
        messageDiv.css("background-color", "orangered")
    }else if (severity == 4){
        messageDiv.css("background-color", "red")
    }
    
    var doneButton = $("<input type='button' class='btn' id='doneButton' value= 'Done' onclick='done()'/>")
	goalSuccessDiv.append(messageDiv)
    goalSuccessDiv.append(doneButton)
}

function done(){
	ajax("logDone", {"goalAchievedTime":goalAchievedTime}, function(returnData) {
		
	});
    outputHierarchy()
}