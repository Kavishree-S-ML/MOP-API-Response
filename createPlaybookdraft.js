var yaml = require('write-yaml');
var YAML = require('js-yaml');
var fs = require('fs');
var activity_log_file = require('./log_file.js');

var dirName = require('./config').morph_path;

var rebuildCurrentPlaybook = function(playbook) {
    var playbook_graph_path = dirName + '/playbooks/draft/' + playbook + '.json';
    var main_path = dirName + '/playbooks/draft/' + playbook + '.yaml'
    var changed_path = dirName + '/playbooks/draft/' + playbook + '_1.yaml'

    if (fs.existsSync(main_path)) {
        fs.renameSync(main_path, changed_path)
    }

    createPlaybookText(main_path, playbook, playbook_graph_path);
    activity_log_file("Playbook", "Created", ">>>Playbook : '"+playbook+"' has been created");
    var playbook_resp = readPlaybookYamlFile(main_path, playbook);
    if (playbook_resp != '') {
        return playbook_resp;
    } else {
        console.log("\n  --> No such playbook has been created")
        return '';
    }
}
module.exports = rebuildCurrentPlaybook;


function createPlaybookText(main_path, playbook, playbook_graph_path) {
    var playbook_graph_detail = getPlaybookgraph(playbook_graph_path);
    if (playbook_graph_detail != '') {
        var used_verbs_detail = getVerbList(playbook_graph_detail);
        var role_list = [];

        console.log("\n Used Verbs Detail : \n------------------- \n" + JSON.stringify(used_verbs_detail))

        for (var i = 0; i < (used_verbs_detail.VerbList.length); i++) {
            if (used_verbs_detail.VerbList[i].condition == "") {
                role_list.push({
                    "role": used_verbs_detail.VerbList[i].verbName,
                    "tags": [used_verbs_detail.VerbList[i].phase]
                });
            } else {
                role_list.push({
                    "role": used_verbs_detail.VerbList[i].verbName,
                    "tags": [used_verbs_detail.VerbList[i].phase],
                    "when": used_verbs_detail.VerbList[i].condition
                });
            }
        }
        playbookWriteYamlFile(main_path, role_list, used_verbs_detail);
    } else {
        console.log("\n  --> No graph has been created for this playbook");
        return '';
    }
}

function getPlaybookgraph(playbook_graph_path) {
    if (fs.existsSync(playbook_graph_path)) {
        var doc = (fs.readFileSync(playbook_graph_path, 'utf8'));
        var content = {};
        content['Details'] = JSON.parse(doc);
        console.log("\nPlaybook Graph Content : \n------------------- \n" + JSON.stringify(content));
        return content;
    } else {
        return '';
    }
}

function getVerbList(playbook_graph_detail) {
    var Verbs_details = [];
    var roles_cont = {};

    for (var i = 0; i < (playbook_graph_detail.Details.Verb).length; i++) {
        Verbs_details.push({
            "verbName": playbook_graph_detail.Details.Verb[i].VerbName,
            "verbId": playbook_graph_detail.Details.Verb[i].VerbID,
            "condition": playbook_graph_detail.Details.Verb[i].Condition,
            "phase": playbook_graph_detail.Details.Verb[i].Phase,
            "parameter": playbook_graph_detail.Details.Verb[i].VerbParameter
        });
    }
    roles_cont = {
        "VerbList": Verbs_details
    };
    return roles_cont;
}

function playbookWriteYamlFile(main_path, role_list, used_verbs_detail) {
    for (var i = 0; i < (role_list.length); i++) {
        var txt = {
            "name": "Perform pre-maintenance checks on the routers",
            "hosts": "{{ hosts }}",
            "connection": "local",
            "gather_facts": 'no',
            "any_errors_fatal": true,
            "strategy": "step",
            "vars": used_verbs_detail.VerbList[i].parameter,
            "roles": [role_list[i]]
        }
        var doc1 = [];
        if (fs.existsSync(main_path)) {
            var doc = YAML.safeLoad(fs.readFileSync(main_path, 'utf8'));
            doc.push(txt);
            yaml.sync(main_path, doc, function(err, data) {
                if (err) {
                    console.log(err);
                } else {}
            });
        } else {
            doc1.push(txt);
            yaml.sync(main_path, doc1, function(err, data) {
                if (err) {
                    console.log(err);
                } else {}
            });
        }
    }
}

function readPlaybookYamlFile(main_path, playbook) {
    if (fs.existsSync(main_path, playbook)) {
        var doc = YAML.safeLoad(fs.readFileSync(main_path, 'utf8'));
        console.log("Content : " + JSON.stringify(doc));
        //var stringified_doc = JSON.stringify(doc);
        var content = {
            "PlayBook": playbook,
            "Details": doc
        };
        return content;
    } else {
        return '';
    }
}