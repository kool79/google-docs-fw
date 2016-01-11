
/**
* {fileName}  fileName of the google-doc inside folder "AutomationTests"
* {docId}   = id of the google-doc
*  either  {fileName} or {docId} required
* {docType} = "suite" (default), "params"
*
*  curl -L URL_OF_YOUR_SCRIPT?fileName=My%20Suite&docType=params
*/

//   last published version: 
//   https://script.google.com/macros/s/AKfycbzL-cn9fj8fhYO09vnqqdD6z6N_nWYFsLZfDECy3SfoOrroBg/exec?docId=ApiTests&dataType=params
//   https://script.google.com/macros/s/AKfycbzL-cn9fj8fhYO09vnqqdD6z6N_nWYFsLZfDECy3SfoOrroBg/exec?docId=ApiTests&dataType=suite
//   https://script.google.com/macros/s/AKfycbzL-cn9fj8fhYO09vnqqdD6z6N_nWYFsLZfDECy3SfoOrroBg/exec?docId=110XA_7OWngor073KULpPylfrEseEOdOu5OycSN83c9Y&dataType=params
//   https://script.google.com/macros/s/AKfycbzL-cn9fj8fhYO09vnqqdD6z6N_nWYFsLZfDECy3SfoOrroBg/exec?docId=110XA_7OWngor073KULpPylfrEseEOdOu5OycSN83c9Y&dataType=suite
//
//   current code version:
//   https://script.google.com/a/macros/techfinancials.com/s/AKfycbx0Q-Zp_3kZTNk9xTjHwCy7xv37QutcikYkuKyOQQ/dev?docId=UITests-dev&dataType=params
//   https://script.google.com/a/macros/techfinancials.com/s/AKfycbx0Q-Zp_3kZTNk9xTjHwCy7xv37QutcikYkuKyOQQ/dev?docId=UITests-dev&dataType=suite
//   https://script.google.com/a/macros/techfinancials.com/s/AKfycbx0Q-Zp_3kZTNk9xTjHwCy7xv37QutcikYkuKyOQQ/dev?docId=110XA_7OWngor073KULpPylfrEseEOdOu5OycSN83c9Y&dataType=params
//   https://script.google.com/a/macros/techfinancials.com/s/AKfycbx0Q-Zp_3kZTNk9xTjHwCy7xv37QutcikYkuKyOQQ/dev?docId=110XA_7OWngor073KULpPylfrEseEOdOu5OycSN83c9Y&dataType=suite

function doGet(request) {
  
  var xml = "";
  
  try{
    // extract params from URL
    var docId = request.parameters.docId;         // get 'docId' parameter from url  -- fileName inside /AutomationTests OR document id.
    var dataType = request.parameters.dataType;     
    dataType = dataType || "suite";

    // convert all params to string. For uncknown reason 
    // we cannot use this params in switch() of for fileName in google-drive
    // maybe encoding?  
    if (docId) docId = docId.toString();
    dataType = dataType.toString();
    
    xml = doGetImpl(docId, dataType)    
    
  } catch(ex) {
    xml = getErrorAsXml(ex)
  }
  
  return ContentService.createTextOutput(xml).setMimeType(ContentService.MimeType.XML);
}


function doGetImpl(docId, dataType){
  var id;
  
  if (!docId)
    throw new Error("Wrong request: Parameter 'docId' is not defined.")
    
  id = getSpreadsheetFileIdByFileName("AutomationTests", docId); 
  if (!id) 
    id = docId;  // file with name {docId} does not exists, assume docId contains id itself
  
  var xml; 
  switch(dataType){
    case "suite":
      xml = exportSuiteToXml(id);
      break;
    case "params":
      xml =  exportParamsToXml(id);
      break;
    default:
      throw new Error("Wrong dataType value: ["+dataType+"].");
  }

  return xml;
}


function debugDoGetParams(){
  var request = {parameters:{
   // docId: "110XA_7OWngor073KULpPylfrEseEOdOu5OycSN83c9Y",
    fileName: "",
    dataType: "params"}
                };
  doGet(request);
}


function debugDoGetSuite(){
  var request = {
    parameters: {
      docId: "UITests-dev",   // "110XA_7OWngor073KULpPylfrEseEOdOu5OycSN83c9Y"
      dataType: "suite"
    }
  };

  doGet(request);
}



function debugError_MissedFile(){
  var request = {
    parameters: {
      docId: "InvalidFileName",
      dataType: "suite"
    }
  };

  doGet(request);
}



function debugError_MissedParam(){
  var request = {
    parameters: {
      //docId: "UITests-dev",
      dataType: "suite"
    }
  };

  doGet(request);
}


function debugError_InvalidDataType(){
  var request = {
    parameters: {
      //docId: "UITests-dev",
      dataType: "suite"
    }
  };

  responce = doGet(request);
  Logger.log(responce.textOutput);
}


















