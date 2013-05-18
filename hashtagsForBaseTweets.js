var hashtagData = []; 

function searchHashTags() {
    ajax("getTags", {}, function(returnData) { 
        data = JSON.parse(returnData);
        console.log(data["allTags"]);
    });
}

function updateHashTags() {
    ajax("getTags", {}, function(returnData) { 
        datatemp = JSON.parse(returnData);
        hashtagdata = datatemp["allTags"];
        $("#search").autocomplete({
            source: hashtagData
        });
        $(".hashInput").autocomplete({
            source: hashtagData
        }); 
    });
}