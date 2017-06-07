var http = require('http'),
    fs = require('fs'),
    url = require("url"),
    path = require('path'),
    dirName = require('./config');

const hostname = 'localhost';
const port = 8080;
var direct_name = dirName.morph_path;

var req = {
    "Playbook": "router_check_sample_playbook",
    "verbName": "router_create_check",
    "Phase": "maintenance",
    "predecessorId": 0,
    "succesorId": -1,
    "condition": "",
    "side": "Right",
    "parameter": [{
        "router_ip": "{{ inventory_hostname }}"
    }]
};

var server = http.createServer(function(request, response) {
    var headers = request.headers;
    var path_name = url.parse(request.url).pathname;
    console.log("Query : " + path_name);

    var query = path_name.split("/");
    var module = query[3];

    switch (module) {
        case '':
            response.writeHead(200, {
                'Content-Type': 'text/html'
            });
            response.write('Give some Pathname in the URL');
            response.end();
            break;

        case 'getSummary':
            var getSummary = require('./getSummary.js');
            var body = getSummary();
            if (body != "0") {
                response.statusCode = 200;
                response.writeHead(200, {
                    "Content-Type": "application-json"
                });
                response.write(JSON.stringify(body));
                response.end();
            } else {
                response.writeHead(404);
                response.write("OOPS! some error occurs - 404");
                response.end();
            }
            break;

        case 'logs':
            var getActivitylog = require('./ansible_logs.js');
            var body = getActivitylog(query[4]);
            if (body != '') {
                response.statusCode = 200;
                for (var key in headers) {
                    response.setHeader(key, headers[key])
                }
                response.writeHead(200, {
                    "Content-Type": "application-json"
                });
                response.write(JSON.stringify(body));
                response.end();
            } else {
                response.writeHead(404);
                response.write("Path doesn't exist - 404");
                response.end();
            }

            break;

        case 'verbs':
            if (query[4] != undefined) {
                var getVerbDetail = require('./verbs_content.js');
                var body = getVerbDetail(query[4]);
                if (body != '') {
                    response.statusCode = 200;
                    for (var key in headers) {
                        response.setHeader(key, headers[key])
                    }
                    response.writeHead(200, {
                        "Content-Type": "application-json"
                    });
                    response.write(JSON.stringify(body));
                    response.end();
                } else {
                    response.writeHead(404);
                    response.write("Path doesn't exist - 404");
                    response.end();
                }
            } else {
                var getVerbsList = require('./available_verbs.js');
                var body = getVerbsList();
                if (body != '') {
                    response.statusCode = 200;
                    response.writeHead(200, {
                        "Content-Type": "application-json"
                    });
                    response.write(JSON.stringify(body));
                    response.end();
                } else {
                    response.writeHead(404);
                    response.write("Path doesn't exist - 404");
                    response.end();
                }
            }
            break;

        case 'specs':
            if (query[4] != undefined) {
                var getVerbInParam = require('./specs_details.js');
                var body = getVerbInParam(query[4]);
                if (body != '') {
                    response.statusCode = 200;
                    for (var key in headers) {
                        response.setHeader(key, headers[key])
                    }
                    response.writeHead(200, {
                        "Content-Type": "application-json"
                    });
                    response.write(JSON.stringify(body));
                    response.end();
                } else {
                    response.writeHead(404);
                    response.write("Path doesn't exist - 404");
                    response.end();
                }
            }
            break;

        case 'playbooks':
            if (query[4] != undefined) {
                var getPlaybookDetail = require('./playbooks_content.js');
                var body = getPlaybookDetail(query[4], query[5]);
                if (body != '') {
                    response.statusCode = 200;
                    for (var key in headers) {
                        response.setHeader(key, headers[key])
                    }
                    response.writeHead(200, {
                        "Content-Type": "application-json"
                    });
                    response.write(JSON.stringify(body));
                    response.end();
                } else {
                    response.writeHead(404);
                    response.write("Path doesn't exist - 404");
                    response.end();
                }
            } else {
                var getPlaybookList = require('./available_playbooks.js');
                var body = getPlaybookList();
                if (body != '') {
                    response.statusCode = 200;
                    response.writeHead(200, {
                        "Content-Type": "application-json"
                    });
                    response.write(JSON.stringify(body));
                    response.end();
                } else {
                    response.writeHead(404);
                    response.write("Path doesn't exist - 404");
                    response.end();
                }
            }
            break;

        case 'addVerb':
            var addVerbToPlaybook = require('./playbook_graph_build.js');
            var body = addVerbToPlaybook(req);
            if (body != '') {
                response.statusCode = 200;
                for (var key in headers) {
                    response.setHeader(key, headers[key])
                }
                response.writeHead(200, {
                    "Content-Type": "application-json"
                });
                response.write(JSON.stringify(body));
                response.end();
            } else {
                response.writeHead(404);
                response.write("Path doesn't exist - 404");
                response.end();
            }
            break;

        case 'getPlaybookGraph':
            var getPlaybookGraph = require('./getPlaybookGraph.js');
            var body = getPlaybookGraph(query[4], query[5]);
            if (body != '') {
                response.statusCode = 200;
                for (var key in headers) {
                    response.setHeader(key, headers[key])
                }
                response.writeHead(200, {
                    "Content-Type": "application-json"
                });
                response.write(JSON.stringify(body));
                response.end();
            } else {
                response.writeHead(404);
                response.write("Path doesn't exist - 404");
                response.end();
            }
            break;

        case 'rebuildPlaybook':
            var createPlaybook = require('./createPlaybookdraft.js');
            var body = createPlaybook(query[4]);
            if (body != '') {
                response.statusCode = 200;
                for (var key in headers) {
                    response.setHeader(key, headers[key])
                }
                response.writeHead(200, {
                    "Content-Type": "application-json"
                });
                response.write(JSON.stringify(body));
                response.end();
            } else {
                response.writeHead(404);
                response.write("Path doesn't exist - 404");
                response.end();
            }
            break;

        case 'buildPlaybook':
            var createPlaybookFinal = require('./createPlaybookFinal.js');
            var body = createPlaybookFinal(query[4]);
            if (body != '') {
                response.statusCode = 200;
                for (var key in headers) {
                    response.setHeader(key, headers[key])
                }
                response.writeHead(200, {
                    "Content-Type": "application-json"
                });
                response.write(JSON.stringify(body));
                response.end();
            } else {
                response.writeHead(404);
                response.write("Path doesn't exist - 404");
                response.end();
            }
            break;

        default:
            response.writeHead(404);
            response.write("opps this doesn't exist - 404");
            response.end();
            break;
    }
});
server.listen(port, hostname, function() {
    console.log("Listeneing " + hostname + ":" + port);
})