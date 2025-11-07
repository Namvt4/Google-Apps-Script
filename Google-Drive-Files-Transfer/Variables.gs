/**
 * @fileoverview This file contains global variables and configuration settings for the Google Drive Files Transfer script.
 * It is used to define constants and settings that are shared across the module.
 */

// The ID of the Google Sheet that serves as the control panel for the script.
const file_source_id = '1wrrYuzOQqX8F5CV-LdV__E4x5nJCqELDET-OJJISHS0';

// The email address of the owner of the files to be transferred. This is retrieved from the 'FileList' sheet.
const owner = get_range_data('FileList', 'O1:O1');

// The ID of the folder where files will be backed up. This is retrieved from the 'FileList' sheet.
const backup_folder = get_range_data('FileList', 'N2:N2');
