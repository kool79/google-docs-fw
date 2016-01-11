
function testExportParamsToXml(){
  var xml = exportParamsToXml("1XfHY4XTqxT_z05FyAIPAVRR0dLm_dzTE26ihIeGp6Uo");
  Logger.log(xml)
}


function testExportSuiteToXml(){
  var xml = exportSuiteToXml("1hoWXdwf43ecE1eq99JLgv3t26PrdR13oEgTr_mKiJ8g");
  Logger.log(xml)
}



function openSpreadsheet(id){
  try{
    return SpreadsheetApp.openById(id);  
  }    
  catch(ex){
    throw new MyException("Cannot open spreadsheet with fileName/ID = [" + id+ "]. Check 'docId' parameter in request.",ex);
  }
}





/**********************************************************
* Export contents of "Params" page to xml string
* Used by webApp service
* @see web-service.gs/doGet()
* id - id of the google spreadsheet
**********************************************************/ 
function exportParamsToXml(id){
  var doc = openSpreadsheet(id);  
  
  var xmlNS = XmlService.getNoNamespace();
  var root = XmlService.createElement("TestConfiguration",xmlNS);
  
  
  var configurationsSheet = doc.getSheetByName("[Config]");
  if (configurationsSheet != null){    
    var configs = getParamsXml(xmlNS, configurationsSheet);
    root.addContent(configs);
  }
  
  
  var document = XmlService.createDocument(root);
  var xml = XmlService.getPrettyFormat().format(document);
  return xml;
  
}


/**********************************************************
* Export contents of "Tests" and "Suite: xxx" pages to xml string
* Used by webApp service
* @see web-service.gs/doGet()
* id - id of the google spreadsheet
**********************************************************/ 
function exportSuiteToXml(id){
  var doc = openSpreadsheet(id);  
  
  var xmlNS = XmlService.getNoNamespace();
  var root = XmlService.createElement("TestConfiguration",xmlNS);
  
  var sheetData = getSheetData(doc.getSheetByName("[Tests]"));
  
  var tests = getTestsXml(xmlNS, sheetData);
  root.addContent(tests);
  
  var brands = getBrandsXml(xmlNS, sheetData);
  root.addContent(brands);
  
  var suites = getSuitesXml(doc, xmlNS);
  root.addContent(suites);
  
  
  var document = XmlService.createDocument(root);
  var xml = XmlService.getPrettyFormat().format(document);
  return xml;
  
}


/**********************************************************
Example: 
*  function doGet(request){
*     var xmlResult = "";
*     try {
*        validate params....
*        // throw new Error("Paam WW is not Valid")
*        // throw new MyException("Paam WW is not Valid", parentException)
*  
*        process code .....
*  
*        xmlResult = getFinalResult()    
*     } catch(e) {
*        xmlResult = getErrorAsXml(e)
*     }
*     return ContentService.createTextOutput(xmlResult).setMimeType(ContentService.MimeType.XML);
*   }
*
**********************************************************/ 
function getErrorAsXml(ex){
  
  var xmlNS = XmlService.getNoNamespace();
  var root = XmlService.createElement("TestConfiguration",xmlNS);    
  
  root.addContent(getExceptionAsXmlNode(ex));
  
  var document = XmlService.createDocument(root);
  var xml = XmlService.getPrettyFormat().format(document);
  return xml;
  
}

/**
* returns xml node with serialized exception
*/
function getExceptionAsXmlNode(ex){
  
  var xmlNS = XmlService.getNoNamespace();
  
  var exceptionNode = XmlService.createElement("exception",xmlNS).setText(ex);
  
  // fill <exception> node with error object.
  addObjectToNode(exceptionNode, ex,xmlNS);
  
  return exceptionNode;
  
}

// TODO: filter properties of object -- private
function addObjectToNode(node, obj, xmlNS){
  
  if (!(obj instanceof Object)) return;
  
  for (var key in obj) {
    if (!obj.hasOwnProperty(key)) continue;
    var value = obj[key];
    
    var childNode = XmlService.createElement(key,xmlNS).setText(value);
    addObjectToNode(childNode, value, xmlNS);
    
    node.addContent(childNode);
  }
}


/*

function getExceptionNode(ex,xmlNS){

var exceptionNode = XmlService.createElement("exception",xmlNS);
exceptionNode.setText(ex);
exceptionNode.addContent(XmlService.createElement("message",xmlNS) .setText(ex.message));
exceptionNode.addContent(XmlService.createElement("fileName",xmlNS).setText(ex.fileName));
exceptionNode.addContent(XmlService.createElement("function",xmlNS).setText(ex["function"]));
exceptionNode.addContent(XmlService.createElement("lineNumber",xmlNS).setText(ex.lineNumber));

var objectNode = XmlService.createElement("onbject",xmlNS)
addObjectToNode(objectNode, ex,xmlNS);
exceptionNode.addContent(objectNode);

if (ex.cause)
exceptionNode.addContent(getExceptionNode(ex.cause,xmlNS));

return exceptionNode;

}
*/




















