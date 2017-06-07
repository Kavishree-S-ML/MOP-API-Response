const electron = require('electron')
const fs = require('fs');
var http = require('http');
var direct_name = require('./config').morph_path;

var getVerbsList = function() {
    var path = direct_name + "/roles";
    var directo = [],
        category = [],
        verb = [],
        Verbs_Categ = [];

    if (fs.existsSync(path)) {
        fs.readdirSync(path).filter(function(file) {
            if (fs.statSync(path + '/' + file).isDirectory()) {
                category.push(file.split('_')[1]);
            }
        });
        category = remove_duplicates_safe(category);

        fs.readdirSync(path).filter(function(file) {
            if (fs.statSync(path + '/' + file).isDirectory()) {
                verb.push(file);
            }
        });

        for (var i = 0; i < category.length; i++) {
            var k = 0;
            var cat_verb = [];
            for (var j = 0; j < verb.length; j++) {
                if (category[i] === (verb[j].split('_')[1])) {
                    cat_verb[k] = verb[j];
                    k++;
                }
            }
            Verbs_Categ.push({
                "Category": category[i],
                "Verbs": cat_verb
            });
        }
        var data = {
            "Verbs": Verbs_Categ
        };
        console.log("\n Available Verbs under each Category : \n--------------------------------------\n" + JSON.stringify(data));
        return data;
    } else {
        console.log("\n --> Path doesn't exist");
        return '';
    }
}

module.exports = getVerbsList;

function remove_duplicates_safe(category) {
    var seen = {};
    var ret_arr = [];
    for (var i = 0; i < category.length; i++) {
        if (!(category[i] in seen)) {
            ret_arr.push(category[i]);
            seen[category[i]] = true;
        }
    }
    return ret_arr;
}