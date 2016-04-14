var cfg = require("./config");
var glob = require('glob');
var logger = require("./logger");
var path = require("path");

exports.start = function(cliOptions, done) {

  logger.setupFromConfig(cliOptions);
  this.log = logger.create();
  this.loadErrors = [];

  var config = cfg.parseConfig(cliOptions.configFile, cliOptions);

  var files = []
  for(var i = 0; i < config.css.length; i++) {
    files[i] = glob.sync((path.join(__dirname, "../" + config.css[i])));
  }
  files = files.reduce(function(a,b) {
    return a.concat(b);
  });

  //do something with files

}