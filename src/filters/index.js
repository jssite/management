import Vue from 'vue';

Vue.filter('formatmonye', function(val){
	var val = (val || 0).toString(), result = '', arr= [], str = '';
    if(val.indexOf('.') < 0){
        str = val
    } else {
        arr = val.split('.');
        str = arr[0];
    }
    while (str.length > 3) {
        result = ',' + str.slice(-3) + result;
        str = str.slice(0, str.length - 3);
    }
    if(str) {
        if(val.indexOf('.') < 0){
            result = str + result + '.00';
        }else {
            if(arr[1].length < 2) {
               arr[1] = arr[1] + '0';
            }
            if(arr[1].length > 2){
                arr[1] = arr[1].substring(0,2)
            }
            result = str + result + '.' + arr[1]; 
        }
    	
    }
    return result;
})

Vue.filter('cutString', function(val, query){
    var str = val.toString();
    if (str.length * 2 <= query) {
        return str;
    }
    var strlen = 0;
    var newStr = "";
    for (var i = 0; i < str.length; i++) {
        newStr = newStr + str.charAt(i);
        if (str.charCodeAt(i) > 128) {
            strlen = strlen + 2;
            if (strlen >= query) {
                return newStr.substring(0, newStr.length - 1) + "...";
            }
        } else {
            strlen = strlen + 1;
            if (strlen >= query) {
                return newStr.substring(0, newStr.length - 2) + "...";
            }
        }
    }
    return newStr;
})