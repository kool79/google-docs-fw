<link rel="stylesheet" href="https://ssl.gstatic.com/docs/script/css/add-ons.css">

<style type="text/css">
  #suite-save-to-drive,
  #params-save-to-drive{
     margin: 5px, 15px;
     width:200px;
     height:30px
  }
  
  #myMsg{
     margin: 5px, 15px;
     height: 50px;
  }
</style>

<div>
  <ul>
    <li><a href = '<?=suiteLink?>'>Open suite XML</a></li>
    <li><a href = '<?=paramsLink?>'>Open parameters XML</a></li>
  </ul>

  <input type="button" value="Save suite xml to GDrive" id="suite-save-to-drive"
        class="action  my-btn"/>
  <br/>
  
  <input type="button" value="Save params xml to GDrive" id="params-save-to-drive"
        class="action  my-btn"/>
  <br/>
  
  <div id="myMsg"></div>
  
  <ul id="myList"></ul>
</div>



<script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js">
</script>

<script>
  /**
   * On document load, assign click handlers to each button and try to load the
   * user's origin and destination language preferences if previously set.
   */
  $(function() {
    $('#suite-save-to-drive') .click(function(){exportToGDrive(this, 'suite' );});
    $('#params-save-to-drive').click(function(){exportToGDrive(this, 'params');});
    
    google.script.run.withSuccessHandler(loadPreferences)
    //    .withFailureHandler(showError).getPreferences();
  });

  // dataType = suite or params
  function exportToGDrive(element, dataType) {
    element.disabled = true;

    $('#myMsg').text("Processing....");
  
     google.script.run
        .withSuccessHandler(setDone)
        .withFailureHandler(showError)
        .withUserObject(element)
        .exportXmlToGDrive(dataType);
  }
 
  // file     - functionResult
  // element  - userObject :: withUserObject(obj)
  function setDone(file, element){
    element.disabled = false;
    
    $("#myMsg").html("Done."+
                    "<br/>Folder: <a href='"+file.folderUrl+"'>"+file.folderName+"</a>"+
                    "<br/>File: <a href='"+file.url+"'>"+file.fileName+"</a>"
                    );
  
    var node = $("<li><a href='"+file.url+"'>"+file.fileName+"</a></li>");
    $("#myList").append(node);
  }
  
  
  function showError(message, element){
     element.disabled = false;
     $('#myMsg').text("Error: "+ message);
  }
  
</script>









