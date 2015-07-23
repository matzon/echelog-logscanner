var fs = require('fs');
var expect = require("chai").expect;
var logscanner = require('../lib/logscanner');
var tmp = require("tmp");

tmp.setGracefulCleanup();

describe("logscanner", function() {
   describe("#scanLogFile", function() {
       it("Should process into 2 log entries", function() {
          var tmpLogFile = tmp.fileSync();
          fs.writeFileSync(tmpLogFile.name, "[08-Nov-2005 00:26:59] line1\n[08-Nov-2005 01:26:59] line2", 'utf8');
          logscanner.scanLogFile(tmpLogFile.name, "channel", "network", function(logEntries) {
             expect(logEntries.length).to.equal(2);
          });
       });
   }); 
});
