function doGet(e) {
    return HtmlService.createHtmlOutputFromFile("index");
  }

function AddRecord(name, mobile_no, email_id) {
  var uniqueID = uuid();
  var found_record = false;
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var dataSheet = ss.getSheetByName("sheet1");
  var getLastRow = dataSheet.getLastRow();
  for (i = 2; i < getLastRow; i++) {
    if (dataSheet.getRange(i, 1).getValue() == "") {
      dataSheet
        .getRange("A" + i + ":I" + i)
        .setValues([[uniqueID, name, mobile_no, email_id, new Date()]]);
      found_record = true;
      break;
    }
  }
  if (found_record == false) {
    dataSheet.appendRow([uniqueID, name, mobile_no, email_id, new Date()]);
  }
  var message =
    "Name : " +
    name +
    "<br/>" +
    " Mobile : " +
    mobile_no +
    "<br/>" +
    " Email : " +
    email_id;
  MailApp.sendEmail({
    to: "sheetsubmitdata@gmail.com",
    subject: "New message",
    htmlBody: message,
  });
  return "SUCCESS";
}

function uuid() {
  var uuid_array = [];
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var dataSheet = ss.getSheetByName("sheet1");
  var getLastRow = dataSheet.getLastRow();
  if (getLastRow > 1) {
    var uuid_values = dataSheet.getRange(2, 1, getLastRow - 1, 1).getValues();
    for (i = 0; i < uuid_values.length; i++) {
      uuid_array.push(uuid_values[i][0]);
    }
    var x_count = 0;
    do {
      var y = "false";
      var uuid_value = Utilities.getUuid();

      if (uuid_array.indexOf(uuid_value) == -1.0) {
        y = "true";
        Logger.log(uuid_value);
        return uuid_value;
      }
      x_count++;
    } while (y == "false" && x_count < 5);
  } else {
    return Utilities.getUuid();
  }
}


function GetRecords() {
    var return_Array = [];
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var dataSheet = ss.getSheetByName("sheet1");
    var getLastRow = dataSheet.getLastRow();
    for (i = 2; i <= getLastRow; i++) {
      if (dataSheet.getRange(i, 1).getValue() != "") {
        return_Array.push([
          dataSheet.getRange(i, 1).getValue(),
          dataSheet.getRange(i, 2).getValue(),
          dataSheet.getRange(i, 3).getValue(),
          dataSheet.getRange(i, 4).getValue(),
        ]);
      }
    }
    return return_Array;
  }

function SearchRecords(email_id_search) {
    var returnRows = [];
    var allRecords = GetRecords();
  
    allRecords.forEach(function (value, index) {
      var evalRows = [];
  
      if (email_id_search != "") {
        if (value[3].toUpperCase() == email_id_search.toUpperCase()) {
          evalRows.push("true");
        } else {
          evalRows.push("false");
        }
      } else {
        evalRows.push("true");
      }
  
      if (evalRows.indexOf("false") == -1) {
        returnRows.push(value);
      }
    });
  
    return returnRows;
  }


  function DeleteRecord(record_id) {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var dataSheet = ss.getSheetByName("sheet1");
    var getLastRow = dataSheet.getLastRow();
    var table_values = dataSheet.getRange(2, 1, getLastRow - 1, 8).getValues();
    for (i = 0; i < table_values.length; i++) {
      if (table_values[i][0] == record_id) {
        var rowNumber = i + 2;
        dataSheet.getRange("A" + rowNumber + ":I" + rowNumber).clearContent();
      }
    }
    return "SUCCESS";
  }

  function UpdateRecord(record_id, name, mobile_no, email_id) {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var dataSheet = ss.getSheetByName("sheet1");
    var getLastRow = dataSheet.getLastRow();
    var table_values = dataSheet.getRange(2, 1, getLastRow - 1, 8).getValues();
    for (i = 0; i < table_values.length; i++) {
      if (table_values[i][0] == record_id) {
        dataSheet.getRange(i + 2, 2).setValue(name);
        dataSheet.getRange(i + 2, 3).setValue(mobile_no);
        dataSheet.getRange(i + 2, 4).setValue(email_id);
      }
    }
    return "SUCCESS";
  }
  