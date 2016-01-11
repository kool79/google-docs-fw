/** @const */
//var ws_uri_ = "https://script.google.com/macros/s/AKfycbzL-cn9fj8fhYO09vnqqdD6z6N_nWYFsLZfDECy3SfoOrroBg/exec";

/**
 * Enum for tri-state values.
 * @enum {String}
 */
var TriState = {
  SUITE: "suite",
  PARAMS: "params"
};



/**
 *  Returns web-service URI which generate exported xml file as responce
 *
 *  @param {!string} dataType Defines data which must be exported. 
 *                  Can have values 'suite' or 'params'
 *
 *  @return {!string} web-service URI which generate exported xml file as responce
 */
function getWebServiceUri(dataType){
  var doc = SpreadsheetApp.getActiveSpreadsheet();
  var docId = doc.getId();
  var uri = PropertiesService.getScriptProperties().getProperty("SUITE_EXPORTER_URI");
  uri += "?docId=" + docId + "&dataType=" + dataType;
  return uri
}

/**
*  Returns xml content of exported data from current spreadsheet.
*  It use external service to produce xml:
*  https://script.google.com/macros/s/AKfycbzL-cn9fj8fhYO09vnqqdD6z6N_nWYFsLZfDECy3SfoOrroBg/exec
*
*  @param {String} dataType  Exported data type. 'suite' or 'params'
*/
function getXmlWithService(dataType){
  
  var uri = getWebServiceUri(dataType);
  var response = UrlFetchApp.fetch(uri);
  var xml = response.getContentText("UTF-8");
  return xml;
}

/**
*  Export xml content to file in [My Drive/AutomationTests/XmlSuites]
*  It use external service to produce xml:
*  href='https://script.google.com/macros/s/AKfycbzL-cn9fj8fhYO09vnqqdD6z6N_nWYFsLZfDECy3SfoOrroBg/exec'
*
*  @param {String} dataType Exported data type 'suite' or 'params'
*  @returns {{folderName: string, folderUrl: string, fileName: string, url:string}} object
*/

function exportXmlToGDrive(dataType){  
  var xml = getXmlWithService(dataType); 
  return createXMLFile_({fileNamePrefix: dataType, content: xml, folder: 'AutomationTests/XmlSuites'});
}
