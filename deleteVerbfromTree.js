var fs = require('fs'), //package required to read/write the file
    dirName = require('./config').morph_path, //call the config file to get the morph file path
    activity_log_file = require('./log_file.js'); //call the log_file script to create the log statements

var req = {
    "Playbook": "sample_tree_graph",
    "verbId": 7,
    "section": "pre-maintenance",
};

//deleteVerb <request input = section, verbId>
deleteVerb(req);


//delete the verb
function deleteVerb(req) {
    console.log("\n --> Playbook : " + req.Playbook);

    var playbook_tree_path = dirName + '/playbooks/draft/' + req.Playbook + '_tree.json'

    //read the playbook tree file
    if (fs.existsSync(playbook_tree_path)) {
        var tree = fs.readFileSync(playbook_tree_path, 'utf8');
        tree = JSON.parse(tree);
        //console.log("\n tree : " + JSON.stringify(tree));

        //check for the requested section and send verbs associated in that phase
        if (req.section in tree) {
            tree[req.section] = inordertoDel(tree[req.section], req);
            //write the updated tree format in the playbook tree file
            fs.writeFileSync(playbook_tree_path, JSON.stringify(tree, null, 2));
        }
    } else {
        console.log("\n No such Playbook has been created")
    }
}

//delete the requested verb from the playbook
function inordertoDel(tree, req) {
    if (tree !== undefined) {
        //check for the requested verb id
        if (tree["id"] == req.verbId) {
            console.log("\n tree: " + JSON.stringify(tree))
            /*
                check whether the requested verb to be deleted is having both right & left child
                if both child exists, then the verb cannot be deleted
            */
            if (JSON.stringify(tree['cl']) != '{}' && JSON.stringify(tree['cr']) != '{}') {
                console.log("\n --> Cannot delete -- Having both left and right child");
            }

            /*
                check whether the requested verb to be deleted is having left child or not
                if left child exists & right child doen't exists, then the verb cannot be deleted
            */
            else if (JSON.stringify(tree['cl']) != '{}' && JSON.stringify(tree['cr']) == '{}') {
                console.log("\n --> Cannot delete -- Having Left Child")
            }

            /*
                check whether the requested verb to be deleted is having right child or not
                if left child doen't exists & right child exists, then the verb can be deleted
                and update the parent verb of the deleted verb with the child verb of the deleted verb to the deleted verb side(right/left)
            */
            else if (JSON.stringify(tree['cl']) == '{}' && JSON.stringify(tree['cr']) != '{}') {
                console.log("\n Having only Right Child")
                tree["verb"] = tree["cr"]["verb"]
                tree["id"] = tree["cr"]["id"]
                tree["cl"] = tree["cr"]["cl"]
                tree["cr"] = tree["cr"]["cr"]
            }

            /*
                check whether the requested verb to be deleted is having left & right child or not
                if it doen't have any child, then the verb can be deleted
                and make the left/right child(based on the side of the verb to be deleted) of the parent verb as empty
            */
            else if (JSON.stringify(tree['cl']) == '{}' && JSON.stringify(tree['cr']) == '{}') {
                console.log("\n Having no Child : " + JSON.stringify(tree))
                delete tree['verb'];
                delete tree['id'];
                delete tree['cl'];
                delete tree['cr'];
            }
        }
        //call the function recursively to check for the requested verb id
        inordertoDel(tree.cl, req);
        inordertoDel(tree.cr, req);
        return tree;
    }
}
