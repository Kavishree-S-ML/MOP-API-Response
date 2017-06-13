//get the content in the verb yaml file
var fs = require('fs'),  //package rquired to read/write the file 
    yaml = require('js-yaml'),  //package required to read the yaml file content and change to json format
    direct_name = require('./config').morph_path;

var getVerbDetail  = function(verbnameorid) {
    var verb_path = direct_name + "/roles/" + verbnameorid + "/tasks/main.yml";
    var mainPath = direct_name + "/roles/" + verbnameorid;

    if (fs.existsSync(mainPath)) {
        //read the Verb file
        var doc = yaml.safeLoad(fs.readFileSync(verb_path, 'utf8'));
        console.log("\n Verb : " + verbnameorid + "\n ------------------------------\n" + JSON.stringify(doc));

        //store the content in json format and return it to the ui
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
