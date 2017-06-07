var fs = require('fs'),
    yaml = require('js-yaml'),
    direct_name = require('./config').morph_path;

var getPlaybookGraph = function(dir_name, playbook) {
    var playbook_path = direct_name + '/playbooks/' + dir_name + '/' + playbook + '.yaml';
    if (fs.existsSync(playbook_path)) {
        var data = yaml.safeLoad(fs.readFileSync(playbook_path, 'utf8'));
        var graphList = [];
        var verb_list = [];
        var verb_id = 1;
        var graph_form = {};
        var count = 0;

        for (var j in data) {
            for (var i = 0; i < data[j].roles.length; i++) {
                var verbTuple = {}
                verbTuple["verbId"] = verb_id
                verbTuple["verbName"] = data[j].roles[i].role
                var var_list = [];
                for (var k in data[j].vars) {
                    var_list.push(data[j].vars[k])
                }
                verbTuple["verbParameter"] = var_list
                verb_list.push(verbTuple);

                var graphTuple = {}
                graphTuple["verbId"] = verb_id;
                graphTuple["condition"] = data[j].roles[i].when

                if (count == 0) {
                    console.log("\n Section : " + data[j].roles[i].tags[0]);
                    graphList.push(graphTuple);
                    graph_form[data[j].roles[i].tags[0]] = graphList;
                } else {
                    if( data[j].roles[i].tags[0] in graph_form ) {
                        console.log("\n phase already exists : " + data[j].roles[i].tags[0]);
                        graph_form[data[j].roles[i].tags[0]].push(graphTuple);
                        console.log("\n graph_form : " + JSON.stringify(graph_form[data[j].roles[i].tags[0]]));
                    } else {
                        var graphList1 = [];
                        console.log("\n Section2 : " + data[j].roles[i].tags[0]);
                        graphList1.push(graphTuple);
                        graph_form[data[j].roles[i].tags[0]] = graphList1;
                        console.log("\n graph_form : " + JSON.stringify(graph_form[data[j].roles[i].tags[0]]));
                        
                    }
                }
                count++
                verb_id++;
            }
        }
        var playbook_graph = {
            "Verbs": verb_list,
            "Graph": graph_form
        }
        //console.log("\n Graph Fromat : \n-----------\n" + JSON.stringify(playbook_graph))
        return playbook_graph
    } else {
        console.log("\n --> No such Playbook has been created")
        return '';
    }

}
module.exports = getPlaybookGraph;

//getPlaybookData()