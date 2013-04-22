function goalSetup(){
    $("#goalDescription").html("Each item must have at least one hashtag")
}

function displayConditionsUpdate(matchingBaseTweetObjects, nonMatchingBaseTweetObjects,likes){
    var numMatchingTweetObjects = matchingBaseTweetObjects.length
	var numNonMatchingBaseTweetObjects = nonMatchingBaseTweetObjects.length
    
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