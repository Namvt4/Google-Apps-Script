/**
 * @fileoverview This file contains functions for managing and transferring Google Drive files.
 * It is designed to be used with a Google Sheet as a control panel.
 * Tool: https://docs.google.com/spreadsheets/d/1wrrYuzOQqX8F5CV-LdV__E4x5nJCqELDET-OJJISHS0/edit#gid=1074668009
 */

/**
 * Lists all files owned by the specified owner and populates them into the 'FileList' sheet.
 */
function listFiles() {
  const files = DriveApp.getFiles();
  let fileCounter = 1;

  while (files.hasNext()) {
    const file = files.next();
    const ownerEmail = file.getOwner() ? file.getOwner().getEmail() : null;

    if (file.getId() !== file_source_id && ownerEmail === owner) {
      const viewers = file.getViewers().map(user => user.getEmail());
      const editors = file.getEditors().map(user => user.getEmail());

      const fileData = [
        [
          fileCounter++,
          file.getName(),
          file.getId(),
          file.getUrl(),
          ownerEmail,
          viewers.join(', '),
          editors.join(', '),
        ],
      ];

      append_sheet_data('FileList', fileData);
      Logger.log(`Added file: ${file.getName()}`);
    }
  }
}

/**
 * Transfers ownership of files listed in the 'FileList' sheet.
 * It reads the sheet and transfers ownership for rows where the transfer column is marked as TRUE.
 */
function transferOwnership() {
  const transferData = get_range_data('FileList', 'A1:I9999');

  transferData.forEach(row => {
    const shouldTransfer = row[8];
    if (shouldTransfer === true) {
      const fileId = row[2];
      const newOwnerEmail = row[7];
      
      try {
        const file = DriveApp.getFileById(fileId);
        file.addEditor(newOwnerEmail);
        file.setOwner(newOwnerEmail);
        Logger.log(`Transferred ownership of ${file.getName()} to ${newOwnerEmail}`);
      } catch (e) {
        Logger.log(`Failed to transfer ownership of file ID ${fileId}: ${e.message}`);
      }
    }
  });
}

/**
 * Clears the content of the 'FileList' sheet, preparing it for a new list of files.
 */
function clearOldData() {
  const range = SpreadsheetApp.getActive().getSheetByName('FileList').getRange('A3:I9999');
  range.clearContent();
  Logger.log('Cleared old data from FileList sheet.');
}

/**
 * Moves files to a specified backup folder.
 * It reads the 'FileList' sheet and moves files for rows where the move column is marked as TRUE.
 */
function moveFilesToBackup() {
  const newFolderId = createFolderBasic(backup_folder, owner);
  const filesToMove = get_range_data('FileList', 'A1:I9999');

  filesToMove.forEach(row => {
    const shouldMove = row[8];
    if (shouldMove === true) {
      const fileId = row[2];
      try {
        moveFiles(fileId, newFolderId);
        Logger.log(`Moved file ID ${fileId} to folder ID ${newFolderId}`);
      } catch (e) {
        Logger.log(`Failed to move file ID ${fileId}: ${e.message}`);
      }
    }
  });
}
