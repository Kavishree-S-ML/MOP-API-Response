var yaml = require('write-yaml');
var YAML = require('js-yaml');
var fs = require('fs');
var activity_log_file = require('./log_file.js');

var dirName = require('./config').morph_path;
var playbook = "router_check_sample"

var buildPlaybook = function(playbook) {
    var draft_path = dirName + '/playbooks/draft/' + playbook + '.yaml'
    
    var final_path = dirName + '/playbooks/final/' + playbook + '.yaml'

    if (fs.existsSync(draft_path)) {
        fs.writeFileSync(final_path, fs.readFileSync(draft_path));
        console.log("\n Successfully Playbook has been created");
        var content = readPlaybookYamlFile(final_path, playbook);
        activity_log_file("Playbook", "Release", ">>>Playbook : '"+playbook+"' has been released");
        return content;
    }else{
        console.log("\n No such Playbook has been created");
        return '';
    }

}
module.exports = buildPlaybook;

function readPlaybookYamlFile(final_path, playbook) {
    if (fs.existsSync(final_path, playbook)) {
        var doc = YAML.safeLoad(fs.readFileSync(final_path, 'utf8'));
        console.log("Content : " + JSON.stringify(doc));
        
        var content = {
            "PlayBook": playbook,
            "Details": doc
        };
        return content;
    } else {
        return '';
    }
}