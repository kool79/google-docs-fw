function getTestsXml(xmlNS, sheetData){
  
  var headers     = sheetData.headers;
  var dataValues  = sheetData.dataValues;
  
  if (typeof(headers["id"]) == "undefined")
    throw new Error("Column 'ID' is absent' on sheet [Tests]");
 
  if (typeof(headers["title"]) == "undefined")
    throw new Error("Column 'Title' is absent' on sheet  [Tests]");
  
  
  
  
  var tests = XmlService.createElement('tests', xmlNS);
  for (var r = 0; r < dataValues.length; r++) {
    var dataRow =  dataValues[r];
    if(dataRow[0] != 'x') continue;
    
    
    var test = XmlService.createElement('test', xmlNS)
                            .setAttribute("id",   dataRow[headers["id"].col - 1])
                            .setAttribute("title",dataRow[headers["title"].col - 1]);
    tests.addContent(test)
  }
  return tests;    
}
