
// parse sheet to headers and dataValues
function getSheetData(sheet){

  var headers    = parseHeader(sheet, getRowNumWithMarker(sheet, "[HEADER]") + 1);
  var topRow     = getRowNumWithMarker(sheet, "[DATA]") + 1;

  var rowCount   = sheet.getLastRow() - topRow + 1;
  var colCount   = sheet.getLastColumn()
  var dataValues = sheet.getRange(topRow, 1, rowCount, colCount).getValues();
    
  return {headers: headers, dataValues: dataValues};

}

/**
 * Returns row number (1-based) next to cell with value [marker]
 * in collumn A
 */
function getRowNumWithMarker(sheet, marker){
  var values = sheet.getRange(1, 1, sheet.getLastRow(),1).getValues();
  for (var row = 1; row <= values.length; row++)
    if(values[row-1][0] == marker) return row;
    
  throw new Error("Cell with marker '" + marker + "' was nor found in column A.");
}

/**
 *
 */
// topRow - row index of elementId row
function parseHeader(sheet, topRow){
  var rowCount = 3;
  var colCount = sheet.getLastColumn();
  var titleValues = sheet.getRange(topRow, 1, rowCount, colCount).getValues();
  
  var headers={};
  for (var c = 0; c < titleValues[0].length; c++) {
    var element   = titleValues[0][c];
    if(titleValues[0][c] == '') continue;
    
    var colData = {};                 
    colData.col       = c + 1;
    colData.element   = titleValues[0][c];
    colData.brandName = titleValues[1][c];
    colData.export    = titleValues[2][c] == "x";
    
    headers[element] = colData;
  }
  return headers;    
}


/*
  Add all elements listed in elementIDs to parentNode
  dataRow - array with values for current row
  headers - object with info about headers
  elementIDs - array with column names which should be added to node
*/
function addXmlNodes(xmlNS, parentNode, dataRow, headers, elementIDs){
  for (i = 0; i<elementIDs.length; i++){
    elementId = elementIDs[i];
    if(!(elementId in headers)){
      throw "Column with elementId [" + elementId + "] was not found.";
    }
    var header = headers[elementId];
    if (!header.export) continue;
    
    var data = dataRow[header.col-1]; // index == col-1
    if (data.toString().toUpperCase() == 'NULL') continue;
    
    var node = createXmlNode(xmlNS, header, data);      
    parentNode.addContent(node);
    
  }
}
