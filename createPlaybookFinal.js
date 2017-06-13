//create the playbook yaml file in the final folder
var YAML = require('js-yaml'),      //package to read the yaml and convert into json format
    fs = require('fs'),             //package to write/read the file
    activity_log_file = require('./log_file.js'),
    dirName = require('./config').morph_path;

var buildPlaybook = function(playbook) {
    var draft_path = dirName + '/playbooks/draft/' + playbook + '.yaml'

    var final_path = dirName + '/playbooks/final/' + playbook + '.yaml'

    //if draft path exists for the specific playbook, then read the file in the draft path and write the content in the final path
    if (fs.existsSync(draft_path)) {
        fs.writeFileSync(final_path, fs.readFileSync(draft_path));
        console.log("\n Successfully Playbook has been created");

        //read the content of the playbook, that is transferred to the final folder and return the content to the ui in json format
        var content = readPlaybookYamlFile(final_path, playbook);

        //create the statement in the activity log file
        activity_log_file("Playbook", "Release", ">>>Playbook : '" + playbook + "' has been released");
        return content;
    } else {
        console.log("\n No such Playbook has been created");
        return '';
    }

}
module.exports = buildPlaybook;

//read the playbook yaml file in the draft folder
function readPlaybookYamlFile(final_path, playbook) {
    if (fs.existsSync(final_path, playbook)) {
        var doc = YAML.safeLoad(fs.readFileSync(final_path, 'utf8'));
        console.log("Content : " + JSON.stringify(doc));

        //return the content in json format
        var content = {
            "PlayBook": playbook,
            "Details": doc
        };
        return content;
    } else {
        return '';
    }
}
