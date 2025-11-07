/**
 * @fileoverview This file contains the core functions for the Telegram bot.
 * It includes an integration with the OpenAI API for chat functionality and provides
 * a system for pinning and recalling messages using a Google Sheet.
 */

//==================================================================================================
// OpenAI Integration
//==================================================================================================

/**
 * Sends a prompt to the OpenAI API and returns the response.
 * @param {string} prompt The prompt to send to the API.
 * @return {string} The text of the API's response.
 */
function getGptResponse(prompt) {
  const requestBody = {
    model: 'text-davinci-003',
    prompt: prompt,
    temperature: 0,
    max_tokens: 3999,
  };

  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${openAIapi}`,
    },
    payload: JSON.stringify(requestBody),
  };

  const response = UrlFetchApp.fetch('https://api.openai.com/v1/completions', requestOptions);
  const responseData = JSON.parse(response.getContentText());
  return responseData.choices[0].text.trim();
}

//==================================================================================================
// Pinned Message Functions
//==================================================================================================

/**
 * Pins a message by storing it in a Google Sheet.
 * @param {string} keyword The keyword to associate with the pinned message.
 * @param {string} content The content of the message to pin.
 * @return {string} A confirmation message.
 */
function pinMessage(keyword, content) {
  LucasF.append_sheet_data(PINNED_MESSAGES_SPREADSHEET_ID, 'Pinned Messages', [[keyword, content]]);
  return 'This message is pinned.';
}

/**
 * Recalls a pinned message from the Google Sheet based on a keyword.
 * @param {string} keyword The keyword to search for.
 * @return {string} The pinned message(s) or a "not found" message.
 */
function recallPinnedMessage(keyword) {
  const data = LucasF.get_sheet_data(PINNED_MESSAGES_SPREADSHEET_ID, 'Pinned Messages');
  const matchingMessages = data.filter(row => row[0].toString().toLowerCase().includes(keyword.toLowerCase()));

  if (matchingMessages.length === 0) {
    return 'Not found!';
  }

  return matchingMessages.map(row => `*${row[0]}*: ${LucasF.gen_format_code(row[1], 'markdown')}`).join('\\n\\n');
}

/**
 * Removes one or all pinned messages associated with a keyword.
 * @param {string} keyword The keyword of the message(s) to remove.
 * @param {number|null} index The specific index of the message to remove (if there are multiple).
 * @return {string} A confirmation message.
 */
function removePinnedMessage(keyword, index) {
  const sheet = SpreadsheetApp.openById(PINNED_MESSAGES_SPREADSHEET_ID).getSheetByName('Pinned Messages');
  const data = sheet.getDataRange().getValues();
  const rowsToDelete = [];

  data.forEach((row, i) => {
    if (row[0].toString().toLowerCase().includes(keyword.toLowerCase())) {
      if (index === null || rowsToDelete.length === index) {
        rowsToDelete.push(i + 1);
      }
    }
  });

  rowsToDelete.reverse().forEach(rowNum => sheet.deleteRow(rowNum));
  return 'Unpinned message(s)!';
}
