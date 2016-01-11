/**
 * Create file in Google Drive.
 * @param {{fileNamePrefix: string=, content: !string, folder: string=}} settings
 *          settings.fileNamePrefix - Prefix for file name
 *          settings.content - XML string with content
 *          settings.folder - path to folder where file will be saved.
 * @returns {{folderName: string, folderUrl: string, fileName: string, url:string}}
 *
*/
function createXMLFile_(settings){
  var options = {},
      //Get current time for result XML file naming
      date      = new Date().toISOString(),
      year      = date.substring(0,4),
      month     = date.substring(5,7),
      day       = date.substring(8,10),
      hour      = date.substring(11,13),
      minute    = date.substring(14,16),
      second    = date.substring(17,19),
      emailAddress,
      fileBlob,
      timeStamp = year + '-' + month + '-' + day + '_' + hour + '-' + minute + '-' + second,
      //EO Get current time for result XML file naming
      resultFileName;
  
  settings = !settings ? {} : settings;
  
  options.fileNamePrefix  = !settings.fileNamePrefix  ? 'tests'  : settings.fileNamePrefix;
  options.content         = !settings.content         ? false    : settings.content;
  options.folder          = !settings.folder          ? ""       : settings.folder;

  if(options.content === false) { return }
  
  resultFileName = options.fileNamePrefix + '_' + timeStamp + '.xml';
  
  //var folder = DocsList.getFolder(settings.folder);
  var folder = getDriveFolder_(settings.folder);
  var file = folder.createFile(resultFileName, options.content);
 
  return {folderName: settings.folder, 
          folderUrl: folder.getUrl(),
          fileName: file.getName(),
          url: file.getUrl()};

}


/**
*  returns folder in GDrive by full path.
*  If folder path not exist, creates it
*   path - path to folder: /
*/ 
function getDriveFolder_(path) {

  var name, folder, search, fullpath;
  
  // Remove extra slashes and trim the path
  fullpath = path.replace(/^\/+|\/+$/g, '').replace(/^\s+|\s+$/g, '').replace(/\/{2,}/g, '/').split("/");
  
  // Always start with the main Drive folder
  folder = DriveApp.getRootFolder();
  
  for (var subfolder in fullpath) {
    name = fullpath[subfolder];
    search = folder.getFoldersByName(name);
    // If folder does not exist, create it in the current level
    folder = search.hasNext() ? search.next() : folder.createFolder(name);
  }
  return folder;
}




function getDriveFolderTest_() {
    var path = "/main/parent/child/grandchild";
    var folder = getDriveFolder(path);
    Logger.log(folder.getUrl());
}