/**
* Creates content of "suites" element in xml-file
* Data from non-hidden sheets with prefix "Suite:" will be included.
* Suite name will be taken from sheet name and converted to lower case
* Example: Sheet name is "Suite: My Sanity" 
* suite name will be "my sanity"
*/
function getSuitesXml(doc, xmlNS){
  
  xmlNS = xmlNS || XmlService.getNoNamespace();
  
  var xmlSuites= XmlService.createElement("suites", xmlNS);
  
  var sheets = doc.getSheets();
  for (var sheetNo = 0; sheetNo < sheets.length; sheetNo++){
    
    var sheet = sheets[sheetNo];  
    if (sheet.getName().indexOf("Suite:") != 0) continue;
    if (sheet.isSheetHidden()) continue;
    var xmlSuite = getSuite(xmlNS, sheet); 
    
    if (xmlSuite != undefined){
      xmlSuites.addContent(xmlSuite);
    }
  }
  
  return xmlSuites;
}

/**
* Creates content of "suite" element from given sheet.
* Data from non-hidden sheets with prefix "Suite:" will be included.
* Suite name will be taken from sheet name and converted to lower case
* Example: Sheet name is "Suite: My Sanity" 
* suite name will be "my sanity"
*
*  <suite name="affiliateauthorization">
*      <test_execution testId="API-0001" enabled="false" invocationCount="2" versions="7.1:7.2"/>
*      <test_execution testId="API-0002"/>
*      <test_execution testId="API-0100">
*          <paramGroup invocationCount="2" versions="7.1:7.2">
*             <param name="testName">userName</param>
*             <param name="fieldName">userName</param>
*          </paramGroup>
*          <paramGroup enabled="false">
*             <param name="testName">password</param>
*             <param name="fieldName">password</param>
*          </paramGroup>
*      <test_execution testId="API-0101"/>
*  </suite>
*/
function getSuite(xmlNS, sheet){
  
  var sheetName = sheet.getName()
  var suiteName = sheetName.substring("Suite:".length).trim().toLowerCase(); // cut "Suite:"
  var xmlSuite = XmlService.createElement("suite",xmlNS).setAttribute("name", suiteName);
  
  try {
    addSuiteContent(xmlSuite, xmlNS, sheet);
  } catch (ex){
    xmlSuite.removeContent();
    xmlSuite.addContent(getExceptionAsXmlNode(ex));
  }
  
  return xmlSuite;
}
  


/**
 *  returns array of testExecution nodes
 */
function addSuiteContent(xmlSuite, xmlNS, sheet){  
  
  var sheetName = sheet.getName()
  
  var header = getSuiteHeader(sheet)
  // check for empty suite
  if (header == undefined) return;
  
  var colVersions   = typeof(header["ver"])    == "undefined" ? -1 : header["ver"].index;
  var colTestGroups = typeof(header["groups"]) == "undefined" ? -1 : header["groups"].index;
  var colInvocCount = typeof(header["n"])      == "undefined" ? -1 : header["n"].index;
    
  if (typeof(header["enabled"]) == "undefined")
    throw new Error("Column 'enabled' is absent' on sheet '" + sheetName + "'");
 
  if (typeof(header["id"]) == "undefined")
    throw new Error("Column 'ID' is absent' on sheet '" + sheetName + "'");
  
  var colEnabled = header["enabled"].index;
  var colId      = header["id"].index
  
  
  var firstRow = 2;
  var rowCount   = sheet.getLastRow() - firstRow + 1;
  var colCount   = sheet.getLastColumn();
  
  
  if (rowCount <= 0 || colCount <= 0){
    // suite is empty or contains only header
    return xmlSuite;
  }
    
  var dataValues = sheet.getRange(firstRow, 1, rowCount, colCount).getValues();
  
  var row = -1;
  while(++row < dataValues.length){
    var rowData =  dataValues[row];
    
    var testId =  rowData[header['id'].index].trim();
    if (testId == '' || testId =='*') continue;
    
    
    var enabled         = rowData[colEnabled].trim() == 'x';    
    var invocationCount = colInvocCount     == -1 ? 1  : (rowData[colInvocCount]+'').trim();
    invocationCount     = invocationCount   == '' ? 1  : parseInt(invocationCount);
    var versions        = colVersions       == -1 ? '' : (rowData[colVersions]+'').trim();  
    var testGroups      = colTestGroups     == -1 ? '' : (rowData[colTestGroups]+'').trim();    
    
    var testExecution = XmlService.createElement('test_execution', xmlNS).setAttribute('testId', testId );

    if (!enabled)             testExecution.setAttribute("enabled",         enabled);    
    if (invocationCount != 1) testExecution.setAttribute("invocationCount", invocationCount);
    if (versions != '')       testExecution.setAttribute("versions",        versions);
    if (testGroups != '')     testExecution.setAttribute("groups",          testGroups);
    
    
    //  = next row exists and column 'id' starts with '*'
    var hasParameters = (row+1) < dataValues.length &&
      dataValues[row+1][colId].trim() == '*';
    
    if (hasParameters){
      
      var paramNames =[];
      // parse parameter names
      var paramNo = 0;      
      do{
        paramNo++;
        var headerTitle = 'param#' + paramNo;
        var cellValue = '';
        if (!header.hasOwnProperty(headerTitle)) break;
        
        cellValue =  rowData[header[headerTitle].index].trim();
        if (cellValue == '') break;
        paramNames[paramNames.length] = cellValue;
        
      }while (true);
      
      
      while(++row < dataValues.length){
        var rowData =  dataValues[row];
        var testId =  rowData[colId].trim();
        if (testId == '') continue;
        if (testId != '*') {row--; break;}
        
        var enabled         = rowData[colEnabled].trim() == 'x';    
        var invocationCount = colInvocCount     == -1 ? 1  : (rowData[colInvocCount]+'').trim();
        invocationCount     = invocationCount   == '' ? 1  : parseInt(invocationCount);
        var versions        = colVersions       == -1 ? '' : (rowData[colVersions] + '').trim();
        var testGroups      = colTestGroups     == -1 ? '' : (rowData[colTestGroups]+'').trim(); 
        
        var paramGroup = XmlService.createElement('paramGroup', xmlNS)
        
        if (!enabled) 
          paramGroup.setAttribute("enabled", enabled);
        
        if (invocationCount != 1) 
          paramGroup.setAttribute("invocationCount", invocationCount);
        
        if (versions != '')
          paramGroup.setAttribute("versions", versions);
    
        if (testGroups != '')
          paramGroup.setAttribute("groups", testGroups);
        
        
        for(var paramNo = 1; paramNo <= paramNames.length; paramNo++){
          var paramName = paramNames[paramNo-1];
          var paramValue = rowData[header['param#'+paramNo].index] ;
       
          var param = XmlService.createElement('param', xmlNS).setAttribute("name", paramName).setText(paramValue);
          paramGroup.addContent(param);
          
        }
        testExecution.addContent(paramGroup);
      }
    }
    xmlSuite.addContent(testExecution)
  }
  
  return xmlSuite; // not required
}



function getSuiteHeader(sheet){
  var colCount = sheet.getLastColumn();
  if (colCount <= 0) return;
  
  var headerValues = sheet.getRange(1, 1, 1, colCount).getValues()[0];
  
  var header={};
  
  for (var col = 0; col < headerValues.length; col++) {
    
    var colTitle   = headerValues[col].toLowerCase().trim();
    if(colTitle == '') continue;
    
    var colData = {};                 
    colData.index   = col;        // 0-based
    colData.title   = colTitle;
    
    header[colTitle] = colData;
  }
  return header;
}
