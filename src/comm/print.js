/**
 * print
 * header	标题
 * headerStyle	标题样式
 * properties	打印的表头
 * printdata	打印的数据
 * 
 */
function print (params){
	// Check if we received proper data
	let parint = document.getElementById('print');
    if (typeof params.printdata !== 'object') {
        throw new Error('Invalid javascript data object (JSON).')
    }
    if (!params.properties || typeof params.properties !== 'object') {
        throw new Error('Invalid properties array for your JSON data.')
    }
    if(parint){
    	parint.parentNode.removeChild(parint);
    }
    let htmlData = ''
    if (params.header) {
        htmlData += '<h1 style="' + params.headerStyle + '">' + params.header + '</h1>'
    }
    htmlData += jsonToHTML(params)
    let iframe = document.createElement('iframe');
    iframe.id = 'print'
    iframe.style.cssText = "position: absolute;width:0px;height:0px;left:-600px;top:-600px;";
    document.body.appendChild(iframe);
    let ifrdoc = iframe.contentWindow.document;
	ifrdoc.open();
	ifrdoc.write(htmlData);
	ifrdoc.close();
	setTimeout(function(){
		iframe.contentWindow.focus();
		iframe.contentWindow.print();
	},1000)
}
function jsonToHTML(params) {
    let data = params.printdata
    let properties = params.properties
    let htmlData = '<table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 25px; page-break-after:always; border-collapse:collapse; border: 1px solid #000000; ">'
    // Header
    htmlData += '<thead><tr>'
    for (let a = 0; a < properties.length; a++) {
        htmlData += '<th style="border-collapse:collapse; border: 1px solid #000000; line-height: 30px; font-size: 14px; font-weight: 400; ">' + properties[a]['title'] + '</th>'
    }
    htmlData += '</tr></thead><tbody>'
    //Content
    for (let i = 0; i < data.length; i++) {
        htmlData += '<tr>'

        for (let n = 0; n < properties.length; n++) {
        	if(properties[n]['width']){
        		htmlData += '<td width="' + properties[n]['width'] + '" style="border-collapse:collapse; border: 1px solid #000000; line-height: 20px; text-align: center; font-size: 12px; font-weight: 400; word-break: break-all; word-wrap: break-word;" valign="top">' + (data[i][properties[n].query] != null?data[i][properties[n].query]:'&nbsp;') + '</td>'
        	} else {
        		htmlData += '<td style="border-collapse:collapse; border: 1px solid #000000; line-height: 20px; text-align: center; font-size: 12px; font-weight: 400; word-break: break-all; word-wrap: break-word;" valign="top">' + (data[i][properties[n].query] != null?data[i][properties[n].query]:'&nbsp;') + '</td>'
        	}
        }
        htmlData += '</tr>'
    }
    htmlData += '</tbody></table>'
    return htmlData
}
export default print;