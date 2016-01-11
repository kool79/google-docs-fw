
/**
 * Shows sidebar
 */
function showNotesSidebar(){
  
  var template = HtmlService.createTemplateFromFile('notes-html');
  //template.title = "The Title";
  //template.suiteLink = getWebServiceUri("suite");
  //template.paramsLink = getWebServiceUri("params");
  var htmlOutput = template.evaluate();
  
  htmlOutput.setTitle("Notes");
  //htmlOutput.setWidth(50);  // ignored, 300 by default - https://developers.google.com/apps-script/releases/#february_2014
   
  var ui = SpreadsheetApp.getUi();
  ui.showSidebar(htmlOutput);
    
}


function updateNote(q){
 // SpreadsheetApp.getUi().alert("sdsd");
  var cell = SpreadsheetApp.getActiveSheet().getActiveCell();
  var note = cell.getNote();
  var value = cell.getValue();
  var type = typeof(value);
  var result = {note: note.toString(), value : value};

  return result;
  
}