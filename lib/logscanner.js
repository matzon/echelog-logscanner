/*!
 * Module dependencies.
 */
var fs = require('fs');
var read_line = require('read-line')
var moment = require('moment');
var trim = require('trim');

/**
 * format:
 *  [date]  [text]
 */
function processLine(line) {
    var timestamp   = line.substr(1, line.indexOf(']')-1).trim();
    var date        = moment(timestamp, "DD-MMM-YYYY HH:mm:ss").toDate();
    var text        = trim.left(line.substr(line.indexOf(']')+1));

    return {date: date, text: text};
}

function scanLogFile(logfile, channel, network, cb) {
    console.log("Processing %s for log entries for %s on %s.", logfile, channel, network);
    var logEntries = [];
    var input = fs.createReadStream(logfile);
    input.pipe(read_line);

    // per-line processing
    read_line.on('readable', function () {
        var line;
        while (line = read_line.read()) {
            var logEntry = processLine(line);
            logEntries.push(logEntry);
        }
    });

    // done - do callback
    read_line.on('end', function() {
       cb(logEntries);
    });
}

/*!
 * Module exports.
 */
module.exports = {
    scanLogFile: scanLogFile
};
