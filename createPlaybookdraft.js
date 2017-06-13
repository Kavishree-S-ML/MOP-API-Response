//Create a Playbook textual in draft folder
var yaml = require('write-yaml'),
	YAML = require('js-yaml'),
	fs = require('fs'),
	activity_log_file = require('./log_file.js'),
	dirName = require('./config').morph_path;

var rebuildCurrentPlaybook = function(playbook) {
	var playbook_graph_path = dirName + '/playbooks/draft/' + playbook + '.json';
	var main_path = dirName + '/playbooks/draft/' + playbook + '.yaml'
	var changed_path = dirName + '/playbooks/draft/' + playbook + '_1.yaml'

	//if playbook is already created, rename the existing playbook and create the latest textual representation of the playbook
	if (fs.existsSync(main_path)) {
		fs.renameSync(main_path, changed_path)
	}

	createPlaybookText(main_path, playbook, playbook_graph_path);

	//store the activity statement in the activity_log file
	activity_log_file("Playbook", "Created", ">>>Playbook : '" + playbook + "' has been created");

	//read the playbook yaml file and send the file content in json format to the ui
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
	//get the playbook detail from the playbook graph file, that is maintained during playbook creation
	var playbook_graph_detail = getPlaybookgraph(playbook_graph_path);
	if (playbook_graph_detail != '') {
		//if playbook graph is not empty, get the details of the verbs used in the playbook
		var used_verbs_detail = getVerbList(playbook_graph_detail);

		var role_list = [];

		console.log("\n Used Verbs Detail : \n------------------- \n" + JSON.stringify(used_verbs_detail))

		/*
		    store the parameter value for the roles(verbs), tags(section) and the condition(if it is assigned)
		    and send the content to write in the yaml file
		*/
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
		//write the available content in the playbook yaml file
		playbookWriteYamlFile(main_path, role_list, used_verbs_detail);
	} else {
		console.log("\n  --> No graph has been created for this playbook");
		return '';
	}
}

//get the content in the playbook graph file
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

//get the details of the verb used in the playbook
function getVerbList(playbook_graph_detail) {
	var Verbs_details = [];
	var roles_cont = {};

	for (var i = 0; i < (playbook_graph_detail.Details.Verb).length; i++) {
		Verbs_details.push({
			"verbName": playbook_graph_detail.Details.Verb[i].VerbName,
			"verbId": playbook_graph_detail.Details.Verb[i].VerbID,
			"condition": playbook_graph_detail.Details.Verb[i].Condition,
			"phase": playbook_graph_detail.Details.Verb[i].phase,
			"parameter": playbook_graph_detail.Details.Verb[i].VerbParameter
		});
	}
	//store the details of the verb in json format and return it back
	roles_cont = {
		"VerbList": Verbs_details
	};
	return roles_cont;
}


//write the provided content in the playbook yaml
function playbookWriteYamlFile(main_path, role_list, used_verbs_detail) {
	var doc = [];

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
		doc.push(txt);
	}
	//write the content in the playbook yaml file
	yaml.sync(main_path, doc, function(err, data) {
		if (err) {
			console.log(err);
		} else {
			console.log("\n Playbook text file has been created")
		}
	});
}

// read the playbook yaml file and return the content in json format
function readPlaybookYamlFile(main_path, playbook) {
	if (fs.existsSync(main_path, playbook)) {
		var doc = YAML.safeLoad(fs.readFileSync(main_path, 'utf8'));
		var content = {
			"Playbook": playbook,
			"Details": doc
		};
		return content;
	} else {
		return '';
	}
}
