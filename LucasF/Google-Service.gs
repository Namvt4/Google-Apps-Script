/** Google Search Engine */
/**
 * Use Google's customsearch API to perform a search query.
 * See https://developers.google.com/custom-search/json-api/v1/using_rest.
 *
 * @param {string} query   Search query to perform, e.g. "test"
 *
 * returns {object}        See response data structure at
 *                         https://developers.google.com/custom-search/json-api/v1/reference/cse/list#response
 */
function searchFor(query, api_key, search_engine_id) {

  // Base URL to access customsearch
  var urlTemplate = "https://www.googleapis.com/customsearch/v1?key=%KEY%&cx=%CX%&q=%Q%";

  // Script-specific credentials & search engine
  var ApiKey = api_key;
  var searchEngineID = search_engine_id;

  // Build custom url
  var url = urlTemplate
    .replace("%KEY%", encodeURIComponent(ApiKey))
    .replace("%CX%", encodeURIComponent(searchEngineID))
    .replace("%Q%", encodeURIComponent(query));

  var params = {
    muteHttpExceptions: true
  };

  // Perform search
  Logger.log( UrlFetchApp.getRequest(url, params) );  // Log query to be sent
  var response = UrlFetchApp.fetch(url, params);
  var respCode = response.getResponseCode();

  if (respCode !== 200) {
    throw new Error ("Error " +respCode + " " + response.getContentText());
  }
  else {
    // Successful search, log & return results
    var result = JSON.parse(response.getContentText());
    Logger.log( "Obtained %s search results in %s seconds.",
               result.searchInformation.formattedTotalResults,
               result.searchInformation.formattedSearchTime);
    return result;
  }
}


//////////////////////////////////////////
/** Gửi email (ko cc viết 0) */
function send_email(email, subject, body, cc_address) {
  if(cc_address != 0) {
    var sending = MailApp.sendEmail(email, subject, body, 
      {
        cc: cc_address
      }
    );
  }
  else {
    var sending = MailApp.sendEmail(email, subject, body);
  }
  return sending;
}



// Fuzzy match
/**
 * Fuzzy String Matching
 * @param {value,column,index,threshold} input The value to fuzzy match
 * @return The index
 * @customfunction
 */

function ZLOOKUP(value, column, index, threshold) {  
  let accArr = []
  for(i=0;i<column.length;++i){
    accArr.push([column[i][0],lev(column[i][0],value)])
    }
  let scoreArr = accArr.map( elem => elem[1])
  if (Math.max(...scoreArr)>threshold){
    let calculatedIndex = scoreArr.indexOf(Math.max(...scoreArr))
    return column[calculatedIndex][index-1]
  } else { 
    throw "Error: No match in column above threshold";
  }
 }

// Levenshtein Distance Implementation from https://gist.github.com/andrei-m/982927/0efdf215b00e5d34c90fdc354639f87ddc3bd0a5

function lev(a, b){
  a = String(a)
  b = String(b)
  if(a.length == 0) return b.length; 
  if(b.length == 0) return a.length; 

  var matrix = [];

  // increment along the first column of each row
  var i;
  for(i = 0; i <= b.length; i++){
    matrix[i] = [i];
  }

  // increment each column in the first row
  var j;
  for(j = 0; j <= a.length; j++){
    matrix[0][j] = j;
  }

  // Fill in the rest of the matrix
  for(i = 1; i <= b.length; i++){
    for(j = 1; j <= a.length; j++){
      if(b.charAt(i-1) == a.charAt(j-1)){
        matrix[i][j] = matrix[i-1][j-1];
      } else {
        matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, // substitution
                                Math.min(matrix[i][j-1] + 1, // insertion
                                         matrix[i-1][j] + 1)); // deletion
      }
    }
  }

  return (1-matrix[b.length][a.length]/Math.max(a.length,b.length))*100;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// get data from metabase in csv form
function get_metabase_csv(card_id, params){
  // get metabase token
  var login_link = 'https://ep.ahamove.com/bi/v1/metabase_login?email='+metabase_acc+'&password='+encodeURIComponent(password);
  var text = UrlFetchApp.fetch(login_link).getContentText();
  var session_id = text.replace("sessionid", "").trim();

  // parse filter parameters
  if (params == null){
    var api_link = 'https://admin.ahamove.com/public/v1/bi/metabase_card_csv?sessionid=' + session_id + '&cardid=' + card_id;
  } else {
    var api_link = 'https://admin.ahamove.com/public/v1/bi/metabase_card_csv?sessionid=' + session_id + '&cardid=' + card_id
                    + '&' + params;
  }

  // get data from metabase
  var response = UrlFetchApp.fetch(api_link).getContentText();
  var data = Utilities.parseCsv(response);
  return data;
}

// sync from sheet to metabase
function sync_gs_metabase(import_name, table_name, spreadsheet_id, sheet_name, type, pk, email) {
var body_request = {
      'import_name': import_name,
      'owner': 'Nam EE',
      'db': 'production',
      'schema': 'custom',
      'name': table_name, 
      'spreadsheet_id': spreadsheet_id,
      'range': sheet_name,
      'type': type, 
      'pk': [pk], 
      'skip_rows': 1,
      'if_not_exists': 'create',
      'email': email,
      'nofi_successful': true
      };
      Logger.log(body_request)

      var url = 'https://data-engineering-new.ahamove.net/production/gstodb'
      var request1 = {
      'url': 'https://data-engineering-new.ahamove.net/production/gstodb',
      'method' : 'post',
      'contentType': 'application/json',
      // Convert the JavaScript object to a JSON string.
      'payload' : JSON.stringify(body_request),
      // 'muteHttpExceptions' : true
      };
      UrlFetchApp.fetch(url, request1);
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function spread_sheet_find(value, spreadsheet_id, sheet, range) {
    var ss = SpreadsheetApp.openById(spreadsheet_id);
    var [cellStart, cellEnd] = range.split(":")
    var rowStartNumber = Number(cellStart.replace(/[^0-9]/g,''))
    var rowEndNumber = Number(cellEnd.replace(/[^0-9]/g,''))
    var colStart = cellStart.replace(/[^A-Za-z]/g,'')
    var colStartNumber = Number(lettersToNumber(colStart))
    var colEnd = cellEnd.replace(/[^A-Za-z]/g,'')
    var colEndNumber = Number(lettersToNumber(colEnd))
    var searchRange = ss.getSheetByName(sheet).getRange(range);
    var searchData = searchRange.getValues();
    for (var i = 0; i < searchData.length; i++) {
        for (var j = 0; j < searchData[i].length; j++) {
            if (searchData[i][j] == value) {
                return (ss.getSheetByName(sheet)
                        .getRange(rowStartNumber + i, colStartNumber + j)
                        .getA1Notation());
            }
        }
    }
    return null;
}
function lettersToNumber(letters){
    for(var p = 0, n = 0; p < letters.length; p++){
        n = letters[p].charCodeAt() - 64 + n * 26;
    }
    return n;
}

// delete all data in a sheet
function clear_sheet_data(spreadsheet_id, sheet_name) {
  var s = SpreadsheetApp.openById(spreadsheet_id).getSheetByName(sheet_name);

  // clear old data
  s.clear();

  // append new data
  // s.getRange(1, 1, data.length, data[0].length).setValues(data);
}

// overwrite new data to sheet
function overwrite_sheet_data(spreadsheet_id, sheet_name, data) {
  var s = SpreadsheetApp.openById(spreadsheet_id).getSheetByName(sheet_name);

  // write new data
  s.getRange(1, 1, data.length, data[0].length).setValues(data);
}

// overwrite cell
function overwrite_cell(spreadsheet_id, sheet_name, cell, data, color) {
  var s = SpreadsheetApp.openById(spreadsheet_id).getSheetByName(sheet_name);
  var _cell_ = s.getRange(cell);
  // var org_color = _cell_.getBackground();
  // _cell_.setBackground("orange");
  // Utilities.sleep(300)
  _cell_.setValue(data);
  if (color != null) {
    _cell_.setBackground(color);
  }
  else {
    var color_array = ['#00FFFF', '#0000FF', '#00FF00', '#FF00FF', '#FFC0CB', '#C0C0C0', '#FFA500', '#7FFFD4'];
    var _color = gen_get_random_element(color_array);
    _cell_.setBackground(_color);
  } 
}

// get sheet data
function get_sheet_data(spreadsheet_id, sheet_name) {
  var s = SpreadsheetApp.openById(spreadsheet_id).getSheetByName(sheet_name);
  var rows = s.getDataRange();
  var values = rows.getValues();
  return values;
}

// delete row
function delete_row(spreadsheet_id, sheet_name, row) {
  var s = SpreadsheetApp.openById(spreadsheet_id).getSheetByName(sheet_name);
  s.deleteRow(row);
}

// append new data to sheet
function append_sheet_data(spreadsheet_id, sheet_name, data) {
  var s = SpreadsheetApp.openById(spreadsheet_id).getSheetByName(sheet_name);
  var s_data = get_sheet_data(spreadsheet_id, sheet_name);

  // append new data
  s.getRange(s_data.length+1, 1, data.length, data[0].length).setValues(data);
}

// get range data
function get_range_data(spreadsheet_id, sheet_name, range) {
  var ss = SpreadsheetApp.openById(spreadsheet_id);
  var searchRange = ss.getSheetByName(sheet_name).getRange(range);
  var values = searchRange.getValues();
  return values;
}

// create new sheet in a spreadsheet
function create_sheet(spreadsheet_id, sheet_name) {
  var s = SpreadsheetApp.openById(spreadsheet_id);
  s.insertSheet().setName(sheet_name);
}

////////////////////////////////////////////////////////
/** remove duplicates */
function remove_duplicates(spreadsheet_id, sheet_name) {
  var s = SpreadsheetApp.openById(spreadsheet_id).getSheetByName(sheet_name);
  var range = s.getDataRange();
  var data = range.getValues();
  var newData = new Array();
  for(i in data){
    var row = data[i];
    var duplicate = false;
    for(j in newData){
      if(row.join() == newData[j].join()){
        duplicate = true;
      }
    }
    if(!duplicate){
      newData.push(row);
    }
  }
  s.clearContents();
  s.getRange(1, 1, newData.length, newData[0].length).setValues(newData);
}

