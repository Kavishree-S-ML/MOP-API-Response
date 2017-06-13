//get the available playbook file name from the playbook folder(draft and final folders)
const fs = require('fs');
var direct_name = require('./config').morph_path;

var getPlaybookList = function() {
    var path = direct_name + "/playbooks/",
        files = [],
        directo = [],
        tot = {},
        category = [],
        playbook = [];

    //check the existence of the playbook_path
    if (fs.existsSync(path)) {
        //read the directory/file in the folder
        fs.readdirSync(path).filter(function(file) {
            /*
                if it is directory, push the directory name into the "directo" array, 
                else, find the category of the playbook by splitting the name and found the available categories in the playbook
            */
            if (fs.statSync(path + '/' + file).isDirectory()) {
                directo.push(file);
                //read the directory/file in the sub-directory folder
                fs.readdirSync(path + "/" + file).filter(function(file1) {
                    /*
                    if it is directory, push the directory name into the "directo" array
                        else, find the category of the playbook by splitting the name and found the available categories in the playbook
                    */
                    if (fs.statSync(path + '/' + file + '/' + file1).isDirectory()) {
                        directo.push(file);
                    } else {
                        var file_name1 = file1.split('_')[1];
                        category.push(file_name1.split('.')[0]);

                        playbook.push({
                            "direct": file,
                            "file": file1
                        });
                    }
                });
            } else {
                var file_name = file.split('_')[1]
                category.push(file_name.split('.')[0]);

                playbook.push({
                    "direct": "/",
                    "file": file
                });
            }
        });
        //find the unique category
        category = remove_duplicates_safe(category);

        //arrange the file based on the category of the playbook and store it in json format
        for (var i = 0; i < category.length; i++) {
            var category_playbook = [];
            for (var j = 0; j < playbook.length; j++) {
                var playbook_name = playbook[j]['file'].split('.')[0];
                if (category[i] === playbook_name.split('_')[1]) {
                    category_playbook.push({
                        'Name': playbook_name,
                        "Directory": playbook[j].direct
                    })
                }
            }
            files.push({
                "Category": category[i],
                "Playbooks": category_playbook
            });
        }

        //return the json format to the ui
        var data = {
            "Playbooks": files
        };
        console.log("\n Available Playbooks under each Category : \n--------------------------------------\n" + JSON.stringify(data));
        return data;
    } else {
        console.log("\n --> Path doesn't exist");
        return '';
    }
}

module.exports = getPlaybookList;

//remove the duplicate values in the array and find the unique value
function remove_duplicates_safe(arr) {
    var seen = {};
    var ret_arr = [];
    for (var i = 0; i < arr.length; i++) {
        if (!(arr[i] in seen)) {
            ret_arr.push(arr[i]);
            seen[arr[i]] = true;
        }
    }
    return ret_arr;
}
