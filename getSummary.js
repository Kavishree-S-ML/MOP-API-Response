const electron = require('electron')
const fs = require('fs');
var http = require('http');
var dir_name = require('./config').morph_path;
var activity_log_file = require('./log_file.js');

var getSummary = function() {

    var folderPath = dir_name;
    var verbFolder = dir_name + "/roles";
    var playbookFolder = dir_name + "/playbooks";
    var draftFolder = dir_name + "/playbooks/draft";
    var finalFolder = dir_name + "/playbooks/final";

    if (fs.existsSync(folderPath)) {
        var verb_summ = getCount(verbFolder);
        var playbook_summ = getCount(playbookFolder);
        var playbook_final_summ = getCount(finalFolder);
        var playbook_draft_summ = getCount(draftFolder);

        var jsonString = {
            "Verbs": verb_summ.direcou,
            "Playbooks_Released": (playbook_summ.filecou) + (playbook_final_summ.filecou),
            "Playbooks_Drafts": (playbook_draft_summ.filecou)
        };
        var jsonObj = JSON.stringify(jsonString); //Send in string format
        console.log("\n Summary : \n -------- \n" + jsonObj);
        activity_log_file("Dashboard", "Get Sumamry", ">>>Get the count of the Verbs, Playbook released and Draft Playbook");
        return jsonString;
    } else {
        console.log("\n --> Path doesn't exists")
        return "";
    }
}

module.exports = getSummary;


function getCount(path) {
    var files = [],
        file_count = 0,
        directory = [],
        dir_count = 0,
        tot = {},
        finalFolder = path + "/final";

    if (fs.existsSync(path)) {
        fs.readdirSync(path).filter(function(file) {
            if (fs.statSync(path + '/' + file).isDirectory()) {
                directory.push(file);
                dir_count++;
            } else {
                files.push(file);
                file_count++;
            }
        });
        tot = {
            "direcou": dir_count,
            "filecou": file_count
        };
        return tot;
    } else {
        console.log("\n --> Path:" + path + " doesn't exist");
        return 0;
    }
}