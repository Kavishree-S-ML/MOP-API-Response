var fs = require('fs'),
    dirName = require('./config').morph_path,
    activity_log_file = require('./log_file.js');

var resp = {
    "Playbook": "playbook",
    "verbId": 3,
    "section": "pre-maintenance",
};

//deleteVerb <request input = section, verbId>
deleteVerb(resp);

function deleteVerb(resp) {
    var fileExists = checkFileExists(resp);
    //return content;
}
module.exports = deleteVerb;

function checkFileExists(resp) {
    var playbook = resp.Playbook;
    console.log("\n --> Playbook : " + playbook);

    var main_Path = dirName + '/playbooks/draft/' + playbook + '.json';
    if (fs.existsSync(main_Path)) {
        var delete_verb = deleteNode(main_Path, resp);
    } else {
        console.log("\n No such Playbook has been created")
    }
}

function deleteNode(playbook_path, resp) {
    var doc = (fs.readFileSync(playbook_path, 'utf8'));
    doc = JSON.parse(doc);

    for (var i = 0; i < doc.Verb.length; i++) {
        if (doc.Verb[i]['VerbID'] == resp.verbId) {
            doc.Verb.splice(i, 1);
            for (var x = 0; x < doc.Graph[resp.section].length; x++) {
            	if (doc.Graph[resp.section][x]['VerbID'] == resp.verbId) {
                    if (doc.Graph[resp.section][x]['Condition'] != "" || (doc.Graph[resp.section][x]['LeftVerb'] != -1 && doc.Graph[resp.section][x]['RightVerb'] != -1)) {
                        console.log("\n check condition and left/right")
                        console.log("Cannot delete the Verb");
                        break;
                    } else {
                        for (var k = 0; k < doc.Graph[resp.section].length; k++) {
                        	if (doc.Graph[resp.section][x]['LeftVerb'] == -1 && doc.Graph[resp.section][x]['RightVerb'] == -1) {
                                if (doc.Graph[resp.section][x]['predecessorVerb'] == doc.Graph[resp.section][k]['VerbID']) {
                                    if (doc.Graph[resp.section][k]['RightVerb'] == doc.Graph[resp.section][x]['VerbID']) {
                                        doc.Graph[resp.section][k]['RightVerb'] = -1;
                                    } else if (doc.Graph[resp.section][k]['LeftVerb'] == doc.Graph[resp.section][x]['VerbID']) {
                                        doc.Graph[resp.section][k]['LeftVerb'] = -1;
                                    }
                                    doc.Graph[resp.section].splice(x, 1);
                                }
                            } else if (doc.Graph[resp.section][x]['LeftVerb'] != -1 && doc.Graph[resp.section][x]['RightVerb'] == -1) {
                                if (doc.Graph[resp.section][x]['predecessorVerb'] == 0) {
                                    for(var l=0; l<doc.Graph[resp.section].length; l++){
                                        if (doc.Graph[resp.section][l]['predecessorVerb'] == doc.Graph[resp.section][x]['VerbID']) {
                                            doc.Graph[resp.section][l]['predecessorVerb'] = 0;
                                        }
                                    }doc.Graph[resp.section].splice(x, 1);
                                }else {
                                    if (doc.Graph[resp.section][x]['predecessorVerb'] == doc.Graph[resp.section][k]['VerbID']) {
                                        if (doc.Graph[resp.section][k]['RightVerb'] == doc.Graph[resp.section][x]['VerbID']) {
                                            doc.Graph[resp.section][k]['RightVerb'] = doc.Graph[resp.section][x]['LeftVerb'];
                                        } else if (doc.Graph[resp.section][k]['LeftVerb'] == doc.Graph[resp.section][x]['VerbID']) {
                                            doc.Graph[resp.section][k]['LeftVerb'] = doc.Graph[resp.section][x]['LeftVerb'];
                                        }
                                        for (var j = 0; j < doc.Graph[resp.section].length; j++) {
                                            if (doc.Graph[resp.section][j]['VerbID'] == doc.Graph[resp.section][x]['LeftVerb']) {
                                                doc.Graph[resp.section][j]['predecessorVerb'] = doc.Graph[resp.section][x]['predecessorVerb']
                                            }
                                        }
                                        doc.Graph[resp.section].splice(x, 1);
                                    }
                                }
                            } else if (doc.Graph[resp.section][x]['LeftVerb'] == -1 && doc.Graph[resp.section][x]['RightVerb'] != -1) {
                                if (doc.Graph[resp.section][x]['predecessorVerb'] == 0) {
                                    for(var l=0; l<doc.Graph[resp.section].length; l++){
                                        if (doc.Graph[resp.section][l]['predecessorVerb'] == doc.Graph[resp.section][x]['VerbID']) {
                                            doc.Graph[resp.section][l]['predecessorVerb'] = 0;
                                        }
                                    }doc.Graph[resp.section].splice(x, 1);
                                } else {
                                    if (doc.Graph[resp.section][x]['predecessorVerb'] == doc.Graph[resp.section][k]['VerbID']) {
                                        if (doc.Graph[resp.section][k]['RightVerb'] == doc.Graph[resp.section][x]['VerbID']) {
                                            doc.Graph[resp.section][k]['RightVerb'] = doc.Graph[resp.section][x]['RightVerb'];
                                        } else if (doc.Graph[resp.section][k]['LeftVerb'] == doc.Graph[resp.section][x]['VerbID']) {
                                            doc.Graph[resp.section][k]['LeftVerb'] = doc.Graph[resp.section][x]['RightVerb'];
                                        }
                                        for (var j = 0; j < doc.Graph[resp.section].length; j++) {
                                            if (doc.Graph[resp.section][j]['VerbID'] == doc.Graph[resp.section][x]['RightVerb']) {
                                                doc.Graph[resp.section][j]['predecessorVerb'] = doc.Graph[resp.section][x]['predecessorVerb']
                                            }
                                        }
                                        doc.Graph[resp.section].splice(x, 1);
                                    }
                                }
                            }
                        }
                        updateFileContent(playbook_path, doc);
                        activity_log_file("Playbook", "Delete", ">>>Verb has been deleted from the Playbook-->'"+resp.Playbook+"'");
                        break;
                    }
                }
            }
        }
    }
}

function updateFileContent(main_path, datas) {
    fs.writeFile(main_path, JSON.stringify(datas, null, 2), function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log('\nPlaybook has been created');
        }
    });
}