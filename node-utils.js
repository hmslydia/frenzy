module.exports = {
  filterArray: function(arr, fun ){
    if (arr == null)
      throw new TypeError();
 
    var t = Object(arr);
    var len = t.length >>> 0;
    if (typeof fun != "function")
      throw new TypeError();
 
    var res = [];
    var thisp = arguments[1];
    for (var i = 0; i < len; i++)
    {
      if (i in t)
      {
        var val = t[i]; // in case fun mutates arr
        if (fun.call(thisp, val, i, t))
          res.push(val);
      }
    }
 
    return res;
  },
  filterDictionary: function(dict, fun ){
    if (dict == null)
      throw new TypeError();
 
    var t = Object(dict);
    var len = t.length >>> 0;
    if (typeof fun != "function")
      throw new TypeError();
 
    var res = {};
    for (var i in dict)
    {
        var thisp = arguments[1];
        var val = t[i]; // in case fun mutates arr
        if (fun.call(thisp, val, i, t))
          res[i] = val;
      
    }
 
    return res;
  },
  dictToArray: function(dict){
    if (dict == null)
      throw new TypeError();
  
    var res = [];
    for (var i in dict)
    {
        res.push(dict[i]);
    }
 
    return res;
  },
  
  mapArray: function(arr, fun )
  {
    var len = arr.length;
    if (typeof fun != "function")
      throw new TypeError();

    var res = new Array(len);
    var thisp = arguments[1];
    for (var i = 0; i < len; i++)
    {
      if (i in arr)
        res[i] = fun.call(thisp, arr[i], i, arr);
    }

    return res;
  },
  
    convertToHierarchy: function (arry)
    {
    var nodeObjects = createStructure(arry);

    for (var i = nodeObjects.length - 1; i >= 0; i--) {
        var currentNode = nodeObjects[i];

        //Skip over root node.
        if (currentNode.tweetObject.parent == "none") {
            continue;
        }

        var parent = getParent(currentNode, nodeObjects);

        if (parent == null) {
            continue;
        }

        parent.children.push(currentNode);
        nodeObjects.splice(i, 1);
    }

    //What remains in nodeObjects will be the root nodes.

    return nodeObjects;    
    },
    escapeRegExp: function (str) 
	{
		return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
	},
	
	arrayContains: function(arr, val){

        return arrayContains(arr, val)
    },

	arrayIntersection: function(arr1, arr2)
	{
		var intersection = []
		for( i in arr1){
			elti = arr1[i]
			if( arrayContains(arr2, elti) ){
				intersection.push(elti)
			}
		}
		return intersection
	},
	
	arrayUnion: function (arr1, arr2){
		var union = []
		for(var i in arr1){
			elti = arr1[i]
			union.push(elti)
		}
		for(var i in arr2){
			elti = arr2[i]	
			if( !arrayContains(union, elti) ){
				union.push(elti)
			}
		}
		return union	
	},
	
	arrayMinus: function(arr1, arrToSubtract){
		var rtn = []
		for( i in arr1){
			elti = arr1[i]
			if( !arrayContains(arrToSubtract, elti) ){
				rtn.push(elti)
			}
		}
		
		return rtn
	},
    
    trim: function (str) {
        return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    }
  
};

var arrayContains = function(arr, val){
	return arr.indexOf(val) > -1;
}

var createStructure = function (nodes) {
    var objects = [];

    for (var i = 0; i < nodes.length; i++) {
        objects.push({ tweetObject: nodes[i], children: [] });
    }

    return objects;
}

var getParent = function (child, nodes) {
    var parent = null;

    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].tweetObject.id == child.tweetObject.parent) {
            return nodes[i];
        }
    }

    return parent;
}
