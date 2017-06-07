const fs = require('fs')
var direct_name = require('./config').morph_path;

var getVerbInParam = function(specName) {
    console.log("specName :" + specName);
    var main_Path = direct_name + '/specs/' + specName + '.json';
    if (fs.existsSync(main_Path)) {
        var doc = (fs.readFileSync(main_Path, 'utf8'));
        console.log("\n Specs(VerbInParam) : "+specName+"\n ----------------------------------------\n" + (doc));

        var content = {
            "Verb": specName,
            "Detail": JSON.parse(doc)
        };
        return content;
    } else {
        console.log("\n --> Path doesn't exists")
        return '';
    }
}

module.exports = getVerbInParam;