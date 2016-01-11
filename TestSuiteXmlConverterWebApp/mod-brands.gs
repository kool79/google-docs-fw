
function getBrandsXml(xmlNS, sheetData){
  
  var headers     = sheetData.headers;
  var dataValues  = sheetData.dataValues;
  
  var brands = XmlService.createElement('brands', xmlNS)
  
  for (var key in headers) {
    // ?? check if property [key] is not inherited and key starts with "brand"
    if (headers.hasOwnProperty(key) && (key.indexOf('brand') == 0)){  ///
      var brandHeader = headers[key];
      if (!brandHeader.export) continue;
      
      var brand = XmlService.createElement("brand", xmlNS).setAttribute("name",brandHeader.brandName);
      addBrandsTests(xmlNS, brand, sheetData, brandHeader.element);
      brands.addContent(brand);
    }
  }
      
  return brands
}



/**
 *
 * 
 */
function addBrandsTests(xmlNS,brandNode,sheetData, brandColId){
  
  var headers     = sheetData.headers;
  var dataValues  = sheetData.dataValues;
  
  for (var r = 0; r < dataValues.length; r++) {
    var dataRow =  dataValues[r];
    if(dataRow[0] != 'x') continue;
    
    var test = XmlService.createElement('test', xmlNS)
                            .setAttribute("testId", dataRow[headers["id"].col - 1])
                            .setAttribute("status", dataRow[headers[brandColId].col - 1]);
    brandNode.addContent(test)
  } 
  return brandNode;
}

