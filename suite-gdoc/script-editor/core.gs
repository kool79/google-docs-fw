/**
 * see: https://script.google.com/a/techfinancials.com/d/1t5HjKg60waUWpTOMBpqsxrL5-0Kin4tw34vJ5mvq5E51HeFLg-Zege59/edit?usp=drive_web
 *
 * This code use custom library "SuiteExportSidebar", see menu Resources > libraries
 * 
 */
function onOpen(e) {
  
  SpreadsheetApp.getUi().createAddonMenu()
  .addItem("Open sidebar","showExportSidebar") 
  .addToUi();
  
  SpreadsheetApp.getUi().createMenu("-=Export=-")
  .addItem("Open sidebar","showExportSidebar") 
  .addToUi();
};

function showExportSidebar(){
  SuiteExportSidebar.show();
}

function exportXmlToGDrive(dataType){  
  return SuiteExportSidebar.exportXmlToGDrive(dataType);
}
