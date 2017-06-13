//get the content in the playbook yaml file
var fs = require('fs'),  //package rquired to read/write the file 
    yaml = require('js-yaml'),  //package required to read the yaml file content and change to json format
    direct_name = require('./config').morph_path;

var getPlaybookDetail = function(directory, playbook_nameorid) {
    var playbook_path = direct_name + "/playbooks/" + directory + "/" + playbook_nameorid + ".yaml";
    var doc = {};

    if (fs.existsSync(playbook_path)) {
        //read the playbook yaml file
        var doc = yaml.safeLoad(fs.readFileSync(playbook_path, 'utf8'));
        console.log("\n Playbook : " +playbook_nameorid+"\n -------------------------------------\n"+ JSON.stringify(doc));

        //store the content in json format and return it to the ui
        var content = {
            "PlayBook": playbook_nameorid,
            "Details": doc
        };
        return content;
    } else {
        console.log("\n --> Path doesn't exists");
        return '';
    }
}
module.exports = getPlaybookDetail;
