export function join(arg){
	return arg.join(',');
}
export function formatDate(day) { 

    var date = new Date();
    date.setDate(date.getDate() + day)
    var Y = date.getFullYear();
    var M = date.getMonth();
    var D = date.getDate();

    M=M>9?M.toString():'0' + M;
    D=D>9?D.toString():'0' + D;
    return new Date(Y,M,D);
}
export function timeFormat(time,fmt) {
	if (!time){
		return '';
	}
	var date = new Date(time);
	var o = {
		"M+" : date.getMonth()+1,
        "d+" : date.getDate(),
        "h+" : date.getHours(),
        "m+" : date.getMinutes(),
        "s+" : date.getSeconds(),
        "q+" : Math.floor((date.getMonth()+3)/3),
        "S"  : date.getMilliseconds()
    }; 
    if(/(y+)/.test(fmt)) {
    	fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length)); 
    }
    for(var k in o) {
    	if(new RegExp("("+ k +")").test(fmt)){
    		fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    	}
    }

    return fmt; 
}  