//Create a graph list with phase

var fs = require('fs'),
    dirName = require('./config').morph_path;

var resp = {
    "Playbook": "sample_playbook_graph_1",
    "verbName": "router_create_te",
    "Phase": "pre-maintenance",
    "predecessorId": 2,
    "succesorId": "-1",
    "condition": "",
    "side": "Left",
    "parameter": [{
        "router_ip": "{{ inventory_hostname }}"
    }]
};

addVerb2PlaybookGraph(resp);

function addVerb2PlaybookGraph(resp) {
    var content = checkFileExists(resp);
    return content;
}
module.exports = addVerb2PlaybookGraph;

function checkFileExists(resp) {
    var playbook = resp.Playbook;
    console.log("\n --> Playbook : " + playbook);

    var main_Path = dirName + '/playbooks/draft/' + playbook + '.json';
    if (fs.existsSync(main_Path)) {
        var child_data = addChildNode(main_Path, resp);
    } else {
        var node_data = createNewFile(main_Path, resp);
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

    var graph1 = {};
    graph1["Phase-" + 1] = graph_list;

    var graph_form = {};
    graph_form[resp.Phase] = graph1

    file_content['Playbook'] = resp.Playbook;
    file_content['Verb'] = verb_list;
    file_content['Graph'] = graph_form;
    writeFileContent(main_path, file_content);
    return file_content;
}

function addChildNode(main_path, resp) {
    var verb = {},
        verb_list = [],
        graph = {},
        graph_list = [],
        file_content = {};
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
    graph['LeftVerb'] = -1;
    graph['RightVerb'] = -1;

    doc.Verb.push(verb);

    if (resp.predecessorId != 0) {
        if (resp.Phase in doc.Graph) {
            for (var key in doc.Graph[resp.Phase]) {
                for (var i = 0; i < doc.Graph[resp.Phase][key].length; i++) {
                    if (doc.Graph[resp.Phase][key][i]['VerbID'] == resp.predecessorId) {
                        doc.Graph[resp.Phase][key].push(graph);
                    }
                }
            }
        } else {
            var graph_list = [];
            graph_list.push(graph);

            var graph1 = {};
            graph1["Phase-" + 1] = graph_list;

            doc.Graph[resp.Phase] = graph1;
        }
    } else if(resp.predecessorId ==0 && resp.succesorId == -1){
        var section = phaseCount(doc.Graph[resp.Phase]);
        section = "Phase-" + section;
        var graph_list = [];
        graph_list.push(graph);
        if (resp.Phase in doc.Graph) {
            doc.Graph[resp.Phase][section] = graph_list
        } else {
            var graph1 = {};
            graph1["Phase-" + 1] = graph_list;

            doc.Graph[resp.Phase] = graph1;
        }
    }

    //update the parent with left/right verbId
    for(var key in doc.Graph[resp.Phase]){
        for(var i=0; i<doc.Graph[resp.Phase][key].length; i++){
            if(resp.predecessorId == doc.Graph[resp.Phase][key][i]['VerbID']){
                if (resp.side == "Right") {
                    doc.Graph[resp.Phase][key][i].RightVerb = graph['VerbID'];
                } else {
                    doc.Graph[resp.Phase][key][i].LeftVerb = graph['VerbID'];
               }
            }
        }
    }
    writeFileContent(main_path, doc);
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

function phaseCount(resp) {
    var count = 0;
    for (var key in resp) {
        count++;
    }
    console.log("\n count : " + count)
    return count + 1;
}