/*!
 * Module dependencies.
 */
var fs = require("fs");
var Parser = require('commandline-parser').Parser
var pjson = require('./package.json');

var logscanner = require('./lib/logscanner');
var echelog = require('./lib/echelog-client');

/* configure command line parser */
var cliParser = new Parser({name: 'lib.js <log-file>', desc: pjson.description});
cliParser.addArgument('host', 'Hostname for echelog service. Default: http://echelog.com');
cliParser.addArgument('port', 'Port for echelog service. Default: 80');
cliParser.addArgument('network', 'Name of network');
cliParser.addArgument('channel', 'Name of channel');
cliParser.addArgument('key', 'API Key for interactive with the echelog-server');

// process command line arguments
var host = cliParser.get('host') || 'http://echelog.com';
var port = cliParser.get('port') || '80';
var network = cliParser.get('network');
var channel = cliParser.get('channel');
var apiKey = cliParser.get('key');
var logfile = cliParser.getArguments();

// sanity check
if(!network) { console.error("Missing name for network"); cliParser.printHelp(); return; }
if(!channel) { console.error("Missing name for channel"); cliParser.printHelp(); return; }
if(!apiKey) { console.error("Missing key"); cliParser.printHelp(); return; }
if(logfile.length < 1) { console.error("Missing file to process"); cliParser.printHelp(); return; }

// double check file
try {
    var stat = fs.lstatSync(logfile[0]);
    if(!stat.isFile()) {
        console.error("Unable to open %s for reading. %s is not a file", logfile[0], logfile[0]);
        return;
    }
} catch (err) {
    console.error("Unable to stat file '%s', cause: %s", logfile[0], err);
    return;
}

/* main entry point */

// forgo promise and just chain up
logscanner.scanLogFile(logfile[0], channel, network, function(logs) {
    if(logs) {
        console.log("Scanned %d entries", logs.length);
        echelog.submitLogEntries(logs, host, port, apiKey);
    }
});