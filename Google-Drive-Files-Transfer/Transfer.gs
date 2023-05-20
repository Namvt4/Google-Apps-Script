function listFiles() {
  var files = DriveApp.getFiles();
  Logger.log(files);
  var data = [];
  var i = 1;
  while ( files.hasNext() ) {
    var file = files.next();
    Logger.log(file.getName())
    if (file.getId() != file_source_id && file.getOwner() != null) {
      Logger.log(file.getOwner().getEmail())
    }
    
    if (file.getId() != file_source_id && file.getOwner() != null && file.getOwner().getEmail() == owner) {
      Logger.log(file.getId());
      // file.setOwner('hanee@ahamove.com');
      // Logger.log(file.getId() + ' Done ' + file.getOwner().getEmail() + ' ' + file.getUrl() + '\n' + file.getName());

      var stt = i;
      var i = i + 1;
      var file_name = file.getName();
      var file_id = file.getId();
      var file_url = file.getUrl();
      var present_owner = file.getOwner().getEmail();
      var viewer = file.getViewers();
      var viewer_email = []
      for (let x = 0; x < viewer.length; x++) {
        viewer_email.push(viewer[x].getEmail());
      }
      var editer = file.getEditors();
      var editer_email = []
      for (let y = 0; y <editer.length; y++) {
        editer_email.push(editer[y].getEmail())
      }
      var raw_data = [[stt, file_name, file_id, file_url, present_owner, viewer_email.toString(), editer_email.toString()]];
      var data = data.concat(raw_data);
      append_sheet_data('FileList', raw_data);
      Logger.log(raw_data);
      // Logger.log(data);
    }
    else {
      true;
    }
  }
  // Logger.log(data);
}
//////////////////////////////////////////////////////////////////////////////////////////////////
function transfer_ownership() {
  var transfer_data = get_range_data('FileList', 'A1:I9999');
  for (var i = 0; i < transfer_data.length; i++) {
    if (transfer_data[i][8] == true) {
      var transfer_file = DriveApp.getFileById(transfer_data[i][2]);
      var trassfer_to = transfer_data[i][7];
      var add_editor = transfer_file.addEditor(trassfer_to);
      var process = transfer_file.setOwner(trassfer_to);
      // var response = process.getResponses();
      Logger.log(transfer_file);
      // return ContentService.createTextOutput('DONE');
    }
    else {
      
    }
  }
}
//////////////////////////////////////////////////////////////////////////////////////////////////
function clear_old_data () {
  var range = SpreadsheetApp
               .getActive()
               .getSheetByName('FileList')
               .getRange('A3:I9999');
 range.clearContent();
}
//////////////////////////////////////////////////////////////////////////////////////////////////
function move_files() {
  var new_folder_id = createFolderBasic(backup_folder, owner);
  var files = get_range_data('FileList', 'A1:I9999');
  for (var i = 0; i < files.length; i++) {
    if (files[i][8] == true) {
      var file_id = files[i][2];
      moveFiles(file_id, new_folder_id);
    }
    else {}
  }
}
///////////////////////////////////////////////////////////////////////////////
// function account() {
//   var account = Session.getActiveUser().getEmail()
//   return account;
// }
