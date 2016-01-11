/****************************************************************
*       A(1)       b(2)     C(3)     X(x)         
*1| ParamName: |      grooooouuupsss  
*2|            | group1 | group2  | groupX |
*3| param1     |    2   |    2    |   8    | 
*4| //comment  |        |         |        |
*5| param2     |  abc   |  abc    |  abd   | 
*6|            |        |         |        |
*7| param3     |  abc   |  cba    |  klm   |
*******************************************************************/
var paramSheetStructure = {
  // top-left cells of regions
  groupTitle: {row:2, col:2},  // 1 row till the right
  parameters: {row:3, col:1},  // 1 col till the right
  data: {row:3, col:2},        // data area till the right and down
}


/*****************************************
* returns XML for "Settings" page
*****************************************/
function getParamsXml(xmlNS, sheet){
  
  var xmlSettings = XmlService.createElement('parameters', xmlNS);
  
  var settingsGroups = getSettings(sheet);
  
  for (var groupKey in settingsGroups){
    var xmlGroup = XmlService.createElement('group', xmlNS).setAttribute("name",groupKey);
    var parameters = settingsGroups[groupKey];
    for (var parameterKey in parameters){
      var xmlParameter = XmlService.createElement('parameter', xmlNS);
      xmlParameter.setAttribute("name",parameterKey);
      xmlParameter.setText(parameters[parameterKey]);
      xmlGroup.addContent(xmlParameter);
    }
    xmlSettings.addContent(xmlGroup);
  }
  return xmlSettings;
}




/**
*  Parse parameter names, skips empty lines and lines with coments.
*  returns object:
*    result.<paramName> == rowNumber
*  rowNumber is absoulute, starting from 1.
*/
function getSettings(sheet){
  
  var sheetData = sheet.getRange(1, 1, sheet.getLastRow(), sheet.getLastColumn()).getValues();
  
  var parameters = getParameters(sheet);
  var groups = getGroups(sheet);
  
  var result = {};
  
  for (var groupName in groups) {
    var col = groups[groupName];
    
    result[groupName] = {};
    for (var paramName in parameters) {
      var row = parameters[paramName];      
      result[groupName][paramName] = sheetData[row-1][col-1]
    }
    
  }
  return result;    
}


/**
*  Parse parameter names, skips empty lines and lines with coments.
*  returns object where fields == param names:
*    result.<paramName> == rowNumber
*  rowNumber is absoulute, starting from 1.
*/
function getParameters(sheet){
  var topLeftRow = paramSheetStructure.parameters.row;
  var topLeftCol = paramSheetStructure.parameters.col;
  var rowCount = sheet.getLastRow() - topLeftRow + 1;
  // get column with parameter names. actually get 2D-range with colCount = 1
  var parameterNames = sheet.getRange(topLeftRow, topLeftCol, rowCount).getValues();
  
  var result = {};
  for (var r = 0; r < parameterNames.length; r++) {
    var paramName   = parameterNames[r][0].trim();
    if (paramName == '' || paramName.indexOf('//') == 0)
    continue;  // skip comments and empty parameters  
    
    result[paramName] = topLeftRow + r;
  }
  return result;    
}


/**
*  Parse setting groups, skips columns with empty titles
*  returns object where fields = group names:
*    result.<groupName> == columnNumber
*  columnNumber is absoulute, starting from 1.
*/
function getGroups(sheet){
  var topLeftRow = paramSheetStructure.groupTitle.row;
  var topLeftCol = paramSheetStructure.groupTitle.col;
  var colCount = sheet.getLastColumn() - topLeftCol + 1;
  // get column with parameter names. actually get 2D-range with colCount = 1
  var headers = sheet.getRange(topLeftRow, topLeftCol, 1, colCount).getValues();
  
  var result = {};
  for (var c = 0; c < headers[0].length; c++) {
    var settingGroup   = headers[0][c];
    if (settingGroup == '')
      continue;  // skip empty column names
    
    result[settingGroup] = topLeftCol + c;
  }
  return result;    
}
