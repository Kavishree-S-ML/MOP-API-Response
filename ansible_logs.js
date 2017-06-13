//Get the last updated log statements from the activity_log file

const electron = require('electron')
const fs = require('fs');
var direct_name = require('./config').morph_path;

var getActivitylog = function(page_num) {
    var path = direct_name + "/logs/activity.log.0";
    var logs_det = {};
    var log_data = {};
    var log_cont = [];

//check the existence of the file path
    if (fs.existsSync(path)) {
        //read the activity_log file
        var doc = (fs.readFileSync(path, 'utf8'));
        var x = page_num;

        //convert the datas in the file into string
        var array = doc.toString().split(/(?:\r\n|\r|\n)/g);
        console.log("Activity Logs : \n-------------\n" + array)
        //get only the latest updated statements(last updated 10 lines) from the file data
        for (var i = ((array.length) - ((10 * x) - 10)); i >= ((array.length) - (10 * x)); i--) {
            logs_det[i] = (array[i]);
        }

        //store it in json format and return the response to the ui
        var content = {
            "Logs": logs_det
        };
        return content;
    } else {
        console.log("\n --> Path doesn't exists")
        return '';
    }
}


module.exports = getActivitylog;
