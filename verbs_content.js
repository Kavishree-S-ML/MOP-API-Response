var fs = require('fs'),
    yaml = require('js-yaml'),
    direct_name = require('./config').morph_path;

var getVerbDetail  = function(verbnameorid) {
    var verb_path = direct_name + "/roles/" + verbnameorid + "/tasks/main.yml";
    var mainPath = direct_name + "/roles/" + verbnameorid;
    var doc = {};
    if (fs.existsSync(mainPath)) {
        var doc = yaml.safeLoad(fs.readFileSync(verb_path, 'utf8'));
        console.log("\n Verb : " + verbnameorid + "\n ------------------------------\n" + JSON.stringify(doc));

        var content = {
            "Verb": verbnameorid,
            "Details": doc
        };
        return content;
    } else {
        console.log("\n --> Path doesn't exists")
        return '';
    }
}
module.exports = getVerbDetail;