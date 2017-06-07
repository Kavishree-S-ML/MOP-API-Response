const electron = require('electron')
const fs = require('fs');
var direct_name = require('./config').morph_path;

var getActivitylog = function(page_num) {
    var path = direct_name + "/logs/activity.log.0";
    var logs_det = {};
    var log_data = {};
    var log_cont = [];

    if (fs.existsSync(path)) {
        var doc = (fs.readFileSync(path, 'utf8'));
        var x = page_num;
        var array = doc.toString().split(/(?:\r\n|\r|\n)/g);
        console.log("Activity Logs : \n-------------\n" + array)
        for (var i = ((array.length) - ((10 * x) - 10)); i >= ((array.length) - (10 * x)); i--) {
            logs_det[i] = (array[i]);
        }

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