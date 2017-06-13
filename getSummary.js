//Get the ummary count of the playbooks and verbs 
var fs = require('fs'),
    dir_name = require('./config').morph_path,
    activity_log_file = require('./log_file.js');

var getSummary = function() {
    var folderPath = dir_name,
        verbFolder = dir_name + "/roles",
        playbookFolder = dir_name + "/playbooks",
        draftFolder = dir_name + "/playbooks/draft",
        finalFolder = dir_name + "/playbooks/final";

    //if morph folder exists, call the count function to count the available playbooks and verbs
    if (fs.existsSync(folderPath)) {
        var verb_summ = getCount(verbFolder);
        var playbook_summ = getCount(playbookFolder);
        var playbook_final_summ = getCount(finalFolder);
        var playbook_draft_summ = getCount(draftFolder);

        //store the count values in json format and return it to the ui
        var jsonString = {
            "Verbs": verb_summ.direcou,
            "Playbooks_Released": (playbook_summ.filecou) + (playbook_final_summ.filecou),
            "Playbooks_Drafts": (playbook_draft_summ.filecou)
        };
        var jsonObj = JSON.stringify(jsonString); //convert to string format
        console.log("\n Summary : \n -------- \n" + jsonObj);

        //Add the activity statement in activity_log file
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

    //read the given path and get the file/directory name and count the available file/directory
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

        //store the count in json format and return it
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
