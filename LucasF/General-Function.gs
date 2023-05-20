/** genarate date range */
function gen_get_dates_in_range(start_date, end_date) {
  var startDate = new Date(start_date);
  var endDate = new Date(end_date);
  var date = new Date(startDate.getTime());

  var dates = [];

  while (date <= endDate) {
    dates.push(Utilities.formatDate(date, 'GMT+7', 'yyyy-MM-dd'));
    date.setDate(date.getDate() + 1);
  }

  return dates;
}

/** get random element from array */
function gen_get_random_element(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** split array to equal parts */
function gen_array_split(array, sub_array_size) {
    var res = [];
    var arr = array;
    while (arr.length > 0) {
        var chunk = arr.splice(0, sub_array_size);
        res.push(chunk);
    }
    return res;
}

/** array remove */
function array_remove(arr, value) { 
  return arr.filter(function(ele){ 
      return ele !== value; 
  });
}
//////////////////////////////////////////
/** array unique */
function array_unique(array) {
  unique = array.filter((v, i, a) => a.indexOf(v) === i);
  return unique
}
//////////////////////////////////////////
/** format_code */
function gen_format_code(text, type) {
  if (type == 'markdown') {
    return '`' + text + '`'
  }
  else if (type == 'html') {
    return `<code>${text}</code>`
  }
  else {
    return text
  }
}
//////////////////////////////////////////
/** Formmat as percentage*/ 
function format_as_percent(num) {
  return `${parseFloat(num*100).toFixed(2)}%`;
}
//////////////////////////////////////////
/** Round */
function round(value, precision) {
    var precision = precision || 0,
        neg = value < 0,
        power = Math.pow(10, precision),
        value = Math.round(value * power),
        integral = String((neg ? Math.ceil : Math.floor)(value / power)),
        fraction = String((neg ? -value : value) % power),
        padding = new Array(Math.max(precision - fraction.length, 0) + 1).join('0');

    return precision ? integral + '.' +  padding + fraction : integral;
}
//////////////////////////////////////////
/** get current (today/hour/time/dow/day/timestamp)*/
function get_current(date_part) {
  var now = new Date();
  if (date_part == 'today') {
    return Utilities.formatDate(new Date(), 'GMT+7', 'yyyy-MM-dd');
  }
  else if (date_part == 'hour') {
    return Utilities.formatDate(now, 'Asia/Ho_Chi_Minh', 'HH');
  }
  else if (date_part == 'time') {
    return Utilities.formatDate(now, 'Asia/Ho_Chi_Minh', 'HH:mm');
  }
  else if (date_part == 'dow') {
    return Utilities.formatDate(now, 'Asia/Ho_Chi_Minh', 'E');
  }
  else if (date_part == 'day') {
    return Utilities.formatDate(now, 'Asia/Ho_Chi_Minh', 'dd');
  }
  else if (date_part == 'timestamp') {
    return now;
  }
  else {
    true
  }
}
//////////////////////////////////////////
/** get date from current */
function gen_date_from_current(interval_day) {
  var MILLIS_PER_DAY = 1000 * 60 * 60 * 24 ;
  var now = new Date();
  var date = new Date(now.getTime() - MILLIS_PER_DAY*interval_day);
  return Utilities.formatDate(date, 'GMT+7', 'yyyy-MM-dd');
}
//////////////////////////////////////////
/** previous date */
function previous_date() {
  var MILLIS_PER_DAY = 1000 * 60 * 60 * 24 ;
  var now = new Date();
  var yesterday = new Date(now.getTime() - MILLIS_PER_DAY);
  return Utilities.formatDate(yesterday, 'GMT+7', 'yyyy-MM-dd');
}
//////////////////////////////////////////
/** yesterday (timestamp in UTC) */
function yesterday() {
  var MILLIS_PER_DAY = 1000 * 60 * 60 * 24 ;
  var now = new Date();
  var yesterday = new Date(now.getTime() - MILLIS_PER_DAY);
  return yesterday
}
//////////////////////////////////////////
/** Decode QR code */
function decodeQR(image_url){
// Demo input: https://i.imgur.com/YGhyhMX.jpg
// Demo output: [{"type":"qrcode","symbol":[{"seq":0,"data":"84367386439","error":null}]}]

  var request_url = 'https://api.qrserver.com/v1/read-qr-code/?fileurl=' + encodeURI(image_url)
  var options = {
    'method': 'GET',
    'muteHttpExceptions' : true
  };
  var response  = UrlFetchApp.fetch(request_url, options)
  return response
}

//////////////////////////////////////////
/**  */



// min
let MAX = 1000000;
function smallest(array,  n)
{
    let firstmin = MAX, secmin = MAX, thirdmin = MAX;
    for (let i = 0; i < n; i++)
    {
        /* Check if current element is less than
           firstmin, then update first, second and
           third */
        if (array[i] < firstmin)
        {
            thirdmin = secmin;
            secmin = firstmin;
            firstmin = array[i];
        }
 
        /* Check if current element is less than
        secmin then update second and third */
        else if (array[i] < secmin)
        {
            thirdmin = secmin;
            secmin = array[i];
        }
 
        /* Check if current element is less than
        then update third */
        else if (array[i] < thirdmin)
            thirdmin = array[i];
    }
 
    document.write("First min = " + firstmin + "</br>");
    document.write("Second min = " + secmin + "</br>");
    document.write("Third min = " + thirdmin + "</br>");
}


/////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
