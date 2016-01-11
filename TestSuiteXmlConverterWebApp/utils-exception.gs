// DONT RENAME filename !! or change string with 
function MyException(message, cause) {
  
  this.message = message + " :: " + cause.message;
  this.name = MyException.name;
 
  // emulate error to catch stack
  try{
    throw new Error("")
  }    
  catch(ex){
    // Example: 
    // at utils.exception:6 (MyException) at main:20 (openSpreadsheet) at main:35 (exportParamsToXml)   -- from script
    // at mod.suites (TestSuiteXmlConverterWebApp):89 (addSuiteContent) at mod.suites (TestSuiteXmlConverterWebApp):59 (getSuite) at... -- via library
    // remove 1st entry about current location
    this.stack = ex.stack.replace(/at .*?:\d+ \(.*?\)/, "");
  }
  
  this.cause = cause;
}


MyException.prototype.toString = function(){return this.name + ": " + this.message};
