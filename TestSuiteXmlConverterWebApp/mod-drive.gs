

/**
Search spreadsheet file with name = {fileName}
in folder = /{folderName} and returns it's id.
*/
function getSpreadsheetFileIdByFileName(folderName, fileName){
  return  getFileIdByFileName(folderName, fileName, "application/vnd.google-apps.spreadsheet");
}







/**
Search file with name = {fileName}, mimeType = {mimeType}
in folder = /{folderName} and returns it's id.
*/
function getFileIdByFileName(folderName, fileName, mimeType){
  
  var folders = DriveApp.getRootFolder().getFoldersByName(folderName);
  while (folders.hasNext()) {
    var files = folders.next().getFilesByName(fileName);
    while (files.hasNext()) {
      var file = files.next();
      if (file.getMimeType() === mimeType
          && file.getName() === fileName)        
      return file.getId();
    }
  };
  
  //throw new Error("File [" + folderName + "/" + fileName + "] was not found.");
}

