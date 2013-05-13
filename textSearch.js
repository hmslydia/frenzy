function textSearchSetup(){
    $("#search").keypress(function(event) {
        if( event.which == 13 ) {
            searchHelper()
       } else if (event.keyCode == 35) {
          searchHashTags();
       }
    })

    $("#searchSubmit").click(function() {
        searchHelper();
    })	
    
    $("#sortSubmit").click(function(){
        //get what they sorted by
        var sortByValue = $("#sortBy option:selected").val()
        var searchQuery = $("#search").val();
        search(searchQuery, sortByValue, "sortbar");
    })
    
}

function searchHashTags() {
    ajax("getTags", {}, function(returnData) { 
        data = JSON.parse(returnData);
        console.log(data["allTags"]);
    });
}

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

function searchHelper(){
    var searchQuery = $("#search").val();
    search(searchQuery, "default", "searchbar");
}
function search(searchQuery, sortBy, uiElt, notes) { 
    if (sortBy === undefined){
        sortBy = "default"
    }
    ajax("searchTweets", {"searchQuery":searchQuery, "sortBy":sortBy, "uiElt": uiElt, "notes":notes}, function(returnData) {
        var twitterFeed = JSON.parse(returnData)["twitterFeed"]
        var likes = JSON.parse(returnData)["likes"]
		
        displayFeed(twitterFeed,likes);
        
        var searchTermArray = JSON.parse(returnData)["searchTermArray"]
        
        //bold the term(s) that was/were searched
        for( i in searchTermArray){
            var searchTerm = searchTermArray[i]
            var re = new RegExp(escapeRegExp(searchTerm), "gi"); 
            var twitterFeedNode = $("#twitterFeed")
            iterate_node($("#twitterFeed"), searchTerm);
        }
		
        displayHashtagSummary(JSON.parse(returnData)["hashtagSummary"])
	});
}

function userSearch(user) {  
    ajax("searchUsersTweets", {"user":user}, function(returnData) {
    console.log("searchUsersTweets")
    console.log(returnData)
        var twitterFeed = JSON.parse(returnData)["twitterFeed"]
        var likes = JSON.parse(returnData)["likes"]
		
        displayFeed(twitterFeed,likes);
	});
}

function iterate_node(node,searchQuery) {
    node = $(node)[0]
    //var re = new RegExp("\b"+searchQuery+"\b", "gi");  
    var re = new RegExp(escapeRegExp(searchQuery), "gi");  
    console.log(re)
    if (node.nodeType === 3) { // Node.TEXT_NODE
    
        var text = node.data
        //var n=text.replace(re ,"<b>"+searchQuery+"</b>");//"\\$&"
        var n=text.replace(re ,"<b>\$&</b>");//"\$&"
        
        parent = node.parentNode
        var newHTMLnode = $("<span>")
        newHTMLnode.html(n)
        $(node).replaceWith(newHTMLnode)

    } else if (node.nodeType === 1) { // Node.ELEMENT_NODE
        for (var i = 0; i < node.childNodes.length; i++) {
            iterate_node(node.childNodes[i], searchQuery); // run recursive on DOM
        }
    }
}

