
function exportExl(params, url, obj){
	var form = document.createElement("form");
		form.style.display="none"
		document.body.appendChild(form);
        if(obj){
            for(var item in obj){
                for(var i=0; i<obj[item].length; i++){
                    var input = document.createElement("input");
                        input.type = "text";
                        input.name = item[i];
                        input.value = obj[item][i]
                        form.appendChild(input);
                }
                
            } 
        }
        for(var val in params){
            var input = document.createElement("input");
                input.type = "text";
                input.name = val;
                input.value = params[val]
                form.appendChild(input);
        }
        form.method = "POST"; 
		form.action = url;
		form.submit();
		document.body.removeChild(form);
}

export default exportExl;