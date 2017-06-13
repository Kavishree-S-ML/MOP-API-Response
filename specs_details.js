//get the content in the specs file
var fs = require('fs'),  //package rquired to read/write the file 
    direct_name = require('./config').morph_path;

var getVerbInParam = function(specName) {
    console.log("specName :" + specName);
    var main_Path = direct_name + '/specs/' + specName + '.json';
    if (fs.existsSync(main_Path)) {
        //read the specs file
        var doc = (fs.readFileSync(main_Path, 'utf8'));
        console.log("\n Specs(VerbInParam) : "+specName+"\n ----------------------------------------\n" + (doc));

        //store the content in json format and return it to the ui
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
