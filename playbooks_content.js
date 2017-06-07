var fs = require('fs'),
    yaml = require('js-yaml'),
    direct_name = require('./config').morph_path;

var getPlaybookDetail = function(directory, playbook_nameorid) {
    var playbook_path = direct_name + "/playbooks/" + directory + "/" + playbook_nameorid + ".yaml";
    var doc = {};

    if (fs.existsSync(playbook_path)) {
        var doc = yaml.safeLoad(fs.readFileSync(playbook_path, 'utf8'));
        console.log("\n Playbook : " +playbook_nameorid+"\n -------------------------------------\n"+ JSON.stringify(doc));

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