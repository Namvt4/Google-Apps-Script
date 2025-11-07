/**
 * @fileoverview This file provides a library of functions for interacting with various Google services and external APIs.
 * It includes utilities for Google Custom Search, Gmail, Google Sheets, and Metabase.
 */

//==================================================================================================
// Google Custom Search Functions
//==================================================================================================

/**
 * Performs a search query using Google's Custom Search API.
 * @param {string} query The search query.
 * @param {string} apiKey The API key for the Custom Search API.
 * @param {string} searchEngineId The ID of the custom search engine.
 * @return {object} The search results object.
 * @see https://developers.google.com/custom-search/json-api/v1/using_rest
 */
function searchGoogle(query, apiKey, searchEngineId) {
  const urlTemplate = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(query)}`;
  const options = {
    muteHttpExceptions: true,
  };

  const response = UrlFetchApp.fetch(urlTemplate, options);
  if (response.getResponseCode() !== 200) {
    throw new Error(`Google Search API returned an error: ${response.getContentText()}`);
  }

  const results = JSON.parse(response.getContentText());
  Logger.log(`Found ${results.searchInformation.formattedTotalResults} results in ${results.searchInformation.formattedSearchTime} seconds.`);
  return results;
}

//==================================================================================================
// Gmail Functions
//==================================================================================================

/**
 * Sends an email using Gmail.
 * @param {string} recipient The email address of the recipient.
 * @param {string} subject The subject of the email.
 * @param {string} body The body of the email.
 * @param {string} ccAddress An optional CC address.
 */
function sendEmail(recipient, subject, body, ccAddress) {
  const options = {};
  if (ccAddress) {
    options.cc = ccAddress;
  }
  MailApp.sendEmail(recipient, subject, body, options);
}

//==================================================================================================
// Google Sheets Functions
//==================================================================================================

/**
 * Finds the A1 notation of a cell containing a specific value within a given range.
 * @param {string} value The value to search for.
 * @param {string} spreadsheetId The ID of the spreadsheet.
 * @param {string} sheetName The name of the sheet.
 * @param {string} rangeA1Notation The A1 notation of the range to search.
 * @return {string|null} The A1 notation of the cell, or null if not found.
 */
function findCellInSheet(value, spreadsheetId, sheetName, rangeA1Notation) {
  const sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(sheetName);
  const searchRange = sheet.getRange(rangeA1Notation);
  const values = searchRange.getValues();

  for (let i = 0; i < values.length; i++) {
    for (let j = 0; j < values[i].length; j++) {
      if (values[i][j] === value) {
        return searchRange.getCell(i + 1, j + 1).getA1Notation();
      }
    }
  }
  return null;
}

/**
 * Overwrites the value of a specific cell in a sheet.
 * @param {string} spreadsheetId The ID of the spreadsheet.
 * @param {string} sheetName The name of the sheet.
 * @param {string} cellA1Notation The A1 notation of the cell to overwrite.
 * @param {any} data The new value for the cell.
 * @param {string} color An optional background color for the cell.
 */
function overwriteCell(spreadsheetId, sheetName, cellA1Notation, data, color) {
  const sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(sheetName);
  const cell = sheet.getRange(cellA1Notation);
  cell.setValue(data);

  if (color) {
    cell.setBackground(color);
  }
}

/**
 * Removes duplicate rows from a sheet.
 * @param {string} spreadsheetId The ID of the spreadsheet.
 * @param {string} sheetName The name of the sheet to remove duplicates from.
 */
function removeDuplicateRows(spreadsheetId, sheetName) {
  const sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(sheetName);
  const data = sheet.getDataRange().getValues();
  const uniqueData = data.filter((row, index, self) =>
    index === self.findIndex(t => t.join(',') === row.join(','))
  );

  sheet.clearContents();
  sheet.getRange(1, 1, uniqueData.length, uniqueData[0].length).setValues(uniqueData);
}

//==================================================================================================
// Metabase Functions
//==================================================================================================

/**
 * Fetches data from a Metabase card in CSV format.
 * @param {string} cardId The ID of the Metabase card.
 * @param {string} params Optional query parameters for the card.
 * @return {Array<Array<string>>} The data from the Metabase card as a 2D array.
 */
function getMetabaseCsv(cardId, params) {
  const loginUrl = `https://ep.ahamove.com/bi/v1/metabase_login?email=${metabase_acc}&password=${encodeURIComponent(password)}`;
  const sessionResponse = UrlFetchApp.fetch(loginUrl).getContentText();
  const sessionId = sessionResponse.replace('sessionid', '').trim();

  let apiUrl = `https://admin.ahamove.com/public/v1/bi/metabase_card_csv?sessionid=${sessionId}&cardid=${cardId}`;
  if (params) {
    apiUrl += `&${params}`;
  }

  const csvResponse = UrlFetchApp.fetch(apiUrl).getContentText();
  return Utilities.parseCsv(csvResponse);
}

/**
 * Syncs data from a Google Sheet to Metabase.
 * @param {string} importName The name of the import job.
 * @param {string} tableName The name of the target table in Metabase.
 * @param {string} spreadsheetId The ID of the Google Sheet.
 * @param {string} sheetName The name of the sheet to sync.
 * @param {string} type The type of sync to perform.
 * @param {string} primaryKey The primary key of the table.
 * @param {string} email The email address to notify on completion.
 */
function syncSheetToMetabase(importName, tableName, spreadsheetId, sheetName, type, primaryKey, email) {
  const payload = {
    import_name: importName,
    owner: 'Nam EE',
    db: 'production',
    schema: 'custom',
    name: tableName,
    spreadsheet_id: spreadsheetId,
    range: sheetName,
    type: type,
    pk: [primaryKey],
    skip_rows: 1,
    if_not_exists: 'create',
    email: email,
    nofi_successful: true,
  };

  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
  };

  UrlFetchApp.fetch('https://data-engineering-new.ahamove.net/production/gstodb', options);
}
