//get the available verb list
var fs = require('fs'),
    direct_name = require('./config').morph_path;

var getVerbsList = function() {
    var path = direct_name + "/roles";
    var directo = [],
        category = [],
        verb = [],
        Verbs_Categ = [];

    //check the existence of verb folder path
    if (fs.existsSync(path)) {
        /*
            get the available categories of verb by splitting the name of the verb file and store it in category array
            and get the verb file name and push the name in "verb" array
         */
        fs.readdirSync(path).filter(function(file) {
            if (fs.statSync(path + '/' + file).isDirectory()) {
                category.push(file.split('_')[1]);
                verb.push(file);
            }
        });
        //get the unique category list
        category = remove_duplicates_safe(category);

        //arrange the file based on the category of the playbook and store it in json format
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

        //return the json format to the ui
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


//remove the duplicate values in the array and find the unique value
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
