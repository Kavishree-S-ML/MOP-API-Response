var fs = require('fs'),
    dirName = require('./config').morph_path,
    activity_log_file = require('./log_file.js');

//<request input = section, verbId, parameterName>    ==> delete parameter
//<request input = section, verbId, parameterName, Value>   ==> replace parameterValue
//<request input = section, verbId, parameterName, Value>  ==> add parameter
//<request input = section, verbId>  ==> flip condition (leftVerb <==> rightVerb)
//<request input = section, verbId>  ==> deleteCondition  (if the selected verb does not have a right branch)
//<request input = section, verbId, condition string>  ==> replaceCondition
//<request input = section, verbId, condition string>  ==> addCondition  (This should not be allowed if a condition is already associated with the verb)

var resp = {
    "playbook": "router_check_sample_playbook",
    "section": "pre-maintenance",
    "verbId": 1,
    "parameterName": "if_names",
    "parameterValue": "{{ sample }}",
    "condition" : "check_result.router_ready == 'NOT READY'"
};
var playbook_path = dirName + "/playbooks/draft/" + resp.playbook + ".json";

//call the respective function
deleteParameterValue(playbook_path, resp)

function deleteParameterValue(playbook_path, resp) {
    if (fs.existsSync(playbook_path)) {
        var doc = (fs.readFileSync(playbook_path, 'utf8'));
        doc = JSON.parse(doc);

        for (var i = 0; i < doc.Verb.length; i++) {
            if (doc.Verb[i]['VerbID'] == resp.verbId) {
                for (var j = 0; j < doc.Verb[i]['VerbParameter'].length; j++) {
                    if (resp.parameterName in doc.Verb[i]['VerbParameter'][j]) {
                        doc.Verb[i]['VerbParameter'].splice(j, 1);
                        updateGraphFile(playbook_path, doc);
                        activity_log_file("Playbook", "Delete", ">>>Parameter is deleted in the Playbook-->'"+resp.playbook+"' for the Verb: '"+doc.Verb[i]['VerbName']+"'");
                        break;
                    }
                }
            }
        }
    }
}

function replaceParameterValue (playbook_path, resp) {
    if (fs.existsSync(playbook_path)) {
        var doc = (fs.readFileSync(playbook_path, 'utf8'));
        doc = JSON.parse(doc);

        for (var i = 0; i < doc.Verb.length; i++) {
            if (doc.Verb[i]['VerbID'] == resp.verbId) {
                for (var j = 0; j < doc.Verb[i]['VerbParameter'].length; j++) {
                    if (resp.parameterName in doc.Verb[i]['VerbParameter'][j]) {
                        doc.Verb[i]['VerbParameter'][j][resp.parameterName] = resp.parameterValue;
                        updateGraphFile(playbook_path, doc);
                        activity_log_file("Playbook", "Update", ">>>Parameter has been replaced in the Playbook-->'"+resp.playbook+"' for the Verb: '"+doc.Verb[i]['VerbName']+"'");
                        break;
                    }
                }
            }
        }
    }
}

function addParameterValue (playbook_path, resp){
    if (fs.existsSync(playbook_path)) {
        var doc = (fs.readFileSync(playbook_path, 'utf8'));
        doc = JSON.parse(doc);

        for (var i = 0; i < doc.Verb.length; i++) {
            if (doc.Verb[i]['VerbID'] == resp.verbId) {
                var parameter = {};
                parameter[resp.parameterName] = resp.parameterValue
                doc.Verb[i]['VerbParameter'].push(parameter);
                updateGraphFile(playbook_path, doc);
                activity_log_file("Playbook", "Update", ">>>Parameter has been added to the Playbook-->'"+resp.playbook+"' for the Verb: '"+doc.Verb[i]['VerbName']+"'");
                break;
            }
        }
    }
}

function flipCondition (playbook_path, resp){
    if (fs.existsSync(playbook_path)) {
        var doc = (fs.readFileSync(playbook_path, 'utf8'));
        doc = JSON.parse(doc);

        for(var i=0; i<doc.Graph[resp.section].length; i++){
            if (doc.Graph[resp.section][i]['VerbID'] == resp.verbId && doc.Graph[resp.section][i]['Condition'] != ""){
                var  tempswap = doc.Graph[resp.section][i]['LeftVerb'];  
                doc.Graph[resp.section][i]['LeftVerb'] = doc.Graph[resp.section][i]['RightVerb'];  
                doc.Graph[resp.section][i]['RightVerb'] = tempswap; 
                updateGraphFile(playbook_path, doc);
                activity_log_file("Playbook", "Update", ">>>Verb in the Playbook-->'"+resp.playbook+"' has been interchanged");
                break;
            }
        }
    }
}

function deleteCondition(playbook_path, resp) {
    if (fs.existsSync(playbook_path)) {
        var doc = (fs.readFileSync(playbook_path, 'utf8'));
        doc = JSON.parse(doc);

        for(var i=0; i<doc.Graph[resp.section].length; i++){
            if (doc.Graph[resp.section][i]['VerbID'] == resp.verbId && doc.Graph[resp.section][i]['RightVerb'] == -1){
                    doc.Graph[resp.section][i]['Condition'] = "";
                    for (var j = 0; j < doc.Verb.length; j++) {
                        if (doc.Verb[j]['VerbID'] == resp.verbId) {
                            doc.Verb[j]['Condition'] = "";
                            updateGraphFile(playbook_path, doc);
                            activity_log_file("Playbook", "Delete", ">>>Condition of the Verb:'"+doc.Verb[j]['VerbName']+"' in the Playbook-->'"+resp.playbook+"' is Deleted");
                            break;
                        }
                    }     
                }
            }
    } 
}

function replaceCondition(playbook_path, resp) {
    if (fs.existsSync(playbook_path)) {
        var doc = (fs.readFileSync(playbook_path, 'utf8'));
        doc = JSON.parse(doc);

        for(var i=0; i<doc.Graph[resp.section].length; i++){
                if (doc.Graph[resp.section][i]['VerbID'] == resp.verbId){
                    doc.Graph[resp.section][i]['Condition'] = resp.condition;
                    for (var j = 0; j < doc.Verb.length; j++) {
                        if (doc.Verb[j]['VerbID'] == resp.verbId) {
                            doc.Verb[j]['Condition'] = resp.condition;
                            updateGraphFile(playbook_path, doc);
                            activity_log_file("Playbook", "Update", ">>>Condition of the Verb:'"+doc.Verb[j]['VerbName']+"' in the Playbook-->'"+resp.playbook+"' is replaced");
                            break;
                        }
                    }     
                }
        }
    }
}

function addCondition(playbook_path, resp) {
    if (fs.existsSync(playbook_path)) {
        var doc = (fs.readFileSync(playbook_path, 'utf8'));
        doc = JSON.parse(doc);

        for(var i=0; i<doc.Graph[resp.section].length; i++){
            if (doc.Graph[resp.section][i]['VerbID'] == resp.verbId && doc.Graph[resp.section][i]['Condition'] == ""){
                doc.Graph[resp.section][i]['Condition'] = resp.condition;
                for (var j = 0; j < doc.Verb.length; j++) {
                    if (doc.Verb[j]['VerbID'] == resp.verbId && doc.Verb[j]['Condition'] == "") {
                        doc.Verb[j]['Condition'] = resp.condition;
                        updateGraphFile(playbook_path, doc);
                        activity_log_file("Playbook", "Update", ">>>Verb in the Playbook-->'"+resp.playbook+"' is updated with the condition");
                        break;
                    }
                }     
            }
        }
    }
}

function updateGraphFile(path, data) {
    fs.writeFile(path, JSON.stringify(data, null, 2), function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log('\nVerb detail has been Updated with the changes\n');
        }
    });
}