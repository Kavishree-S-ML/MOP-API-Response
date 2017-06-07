//Create a playbook without phase
var fs = require('fs'),
    activity_log_file = require('./log_file.js'),
    dirName = require('./config').morph_path;


var addVerb =  function(resp) {
    var content = checkFileExists(resp);
    return content;
}
module.exports = addVerb;

function checkFileExists(resp) {
    var playbook = resp.Playbook;
    console.log("\n --> Playbook : " + playbook);

    var main_Path = dirName + '/playbooks/draft/' + playbook + '.json';
    if (fs.existsSync(main_Path)) {
        var child_data = addChildNode(main_Path, resp);
        return child_data;
    } else {
        var node_data = createNewFile(main_Path, resp);
        return node_data;
    }
}

function createNewFile(main_path, resp) {

    var verb = {},
        verb_list = [],
        graph = {},
        graph_list = [],
        file_content = {};

    verb['VerbID'] = 1;
    verb['VerbName'] = resp.verbName;
    verb['VerbParameter'] = resp.parameter;
    verb['Condition'] = resp.condition;
    verb['Phase'] = resp.Phase;

    graph['VerbID'] = 1;
    graph['Condition'] = resp.condition;
    graph['predecessorVerb'] = resp.predecessorId;
    graph['LeftVerb'] = -1;
    graph['RightVerb'] = -1;

    verb_list.push(verb);
    graph_list.push(graph);


    var graph_form = {};
    graph_form[resp.Phase] = graph_list

    file_content['Playbook'] = resp.Playbook;
    file_content['Verb'] = verb_list;
    file_content['Graph'] = graph_form;
    writeFileContent(main_path, file_content);

    activity_log_file("Playbook", "Added", ">>>New Playbook-->'"+resp.Playbook+"' has been created with a Parent Verb :'"+resp.verbName+"'");

    var jsonString = {"Playbook":resp.Playbook, "Verb":verb, "Graph":graph};
    return jsonString;
}

function addChildNode(main_path, resp) {
    var verb = {},
        verb_list = [],
        graph = {},
        graph_list = [];

    var doc = fs.readFileSync(main_path);
    doc = JSON.parse(doc);

    verb['VerbID'] = findVerbId(doc);
    verb['VerbName'] = resp.verbName;
    verb['VerbParameter'] = resp.parameter;
    verb['Condition'] = resp.condition;
    verb['Phase'] = resp.Phase;

    graph['VerbID'] = findVerbId(doc);
    graph['Condition'] = resp.condition;
    graph['predecessorVerb'] = resp.predecessorId;

    doc.Verb.push(verb);

    if (resp.predecessorId != 0 && resp.succesorId == -1) {
        for (var i = 0; i < doc.Graph[resp.Phase].length; i++) {
            if (resp.predecessorId == doc.Graph[resp.Phase][i]['VerbID']) {
                if (resp.side == "Right") {
                    doc.Graph[resp.Phase][i].RightVerb = graph['VerbID'];
                } else {
                    doc.Graph[resp.Phase][i].LeftVerb = graph['VerbID'];
                }
            }
        }
        graph['LeftVerb'] = -1;
        graph['RightVerb'] = -1;
        doc.Graph[resp.Phase].push(graph);
    } else if (resp.predecessorId == 0 && resp.succesorId != -1) { //add at begin
        for (var i = 0; i < doc.Graph[resp.Phase].length; i++) {
            if (resp.succesorId == doc.Graph[resp.Phase][i]['VerbID']) {
                doc.Graph[resp.Phase][i].predecessorVerb = graph['VerbID'];
                if (resp.side == "Right") {
                    graph['LeftVerb'] = -1;
                    graph['RightVerb'] = doc.Graph[resp.Phase][i]['VerbID'];
                } else {
                    graph['RightVerb'] = -1
                    graph['LeftVerb'] = doc.Graph[resp.Phase][i]['VerbID'];
                }
            }
        }
        doc.Graph[resp.Phase].push(graph);
    } else if (resp.predecessorId != 0 && resp.succesorId != -1) { //add at begin
        for (var i = 0; i < doc.Graph[resp.Phase].length; i++) {
            if (resp.predecessorId == doc.Graph[resp.Phase][i]['VerbID']) {
                if (resp.side == "Right") {
                    graph['LeftVerb'] = -1;
                    graph['RightVerb'] = doc.Graph[resp.Phase][i].RightVerb;
                    doc.Graph[resp.Phase][i].RightVerb = graph['VerbID'];
                } else {
                    graph['RightVerb'] = -1
                    graph['LeftVerb'] = doc.Graph[resp.Phase][i].LeftVerb;
                    doc.Graph[resp.Phase][i].LeftVerb = graph['VerbID'];
                }
            }
            if (resp.succesorId == doc.Graph[resp.Phase][i]['VerbID']) {
                doc.Graph[resp.Phase][i].predecessorVerb = graph['VerbID'];
            }
        }
        doc.Graph[resp.Phase].push(graph);
    } else if (resp.predecessorId == 0 && resp.succesorId == -1) {
        graph['LeftVerb'] = -1;
        graph['RightVerb'] = -1;
        var graph_list = [];
        graph_list.push(graph);

        doc.Graph[resp.Phase] = graph_list;
    }

    writeFileContent(main_path, doc);
    activity_log_file("Playbook", "Updated", ">>>Verb :'"+resp.verbName+"' is added to the Playbook-->'"+resp.Playbook+"'");

    var jsonString = {"Playbook":resp.Playbook, "Verb":verb, "Graph":graph};
    return jsonString;
}


function writeFileContent(main_path, datas) {
    fs.writeFile(main_path, JSON.stringify(datas, null, 2), function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log('\nPlaybook has been created');
        }
    });
}

function findVerbId(resp) {
    var verb_id = "";
    for (var i = 0; i < resp.Verb.length; i++) {
        verb_id = resp.Verb[i].VerbID;
    }
    return verb_id + 1;
}

