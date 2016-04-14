var contstants = require("./constants");
var fs = require("graceful-fs");
var helper = require('./helper');
var optimist = require("optimist");
var path = require("path");

var _argsBeforeDoubleDash = function (argv) {

  var idx = argv.indexOf("--");
  return idx === -1 ? argv : argv.slice(0, idx);

}

var _describeInit = function() {

  optimist
    .usage("Snowman - Automatic Style Guide Generator.\n\n" +
      "INIT - Initialize a config file.\n\n" +
      "Usage:\n" +
      "  $0 init [<configFile>]")
    .describe("help", "Print usage and options.")

}

var _describeShared = function() {

  optimist
    .usage("Snowman - Automatic Style Guide Generator.\n\n" +
      "Usage:\n" +
      "  $0 <command>\n\n" +
      "Commands:\n" +
      "  start [<configFile>] [<options>] Compile the style guide.\n" +
      "  init [<configFile>] Initialize a config file.\n" +
      "Run --help with particular command to see its description and available options.")
    .describe("help", "Print usage and options.")

}

var _describeStart = function() {

  optimist
    .usage("Snowman - Automatic Style Guide Generator.\n\n" +
      "START - Compile the style guide.\n\n" +
      "Usage:\n" +
      "  $0 start [<configFile>] [<options>]")
    .describe("help", "Print usage and options.")

}

var _process = function() {

  var argv = optimist.parse(_argsBeforeDoubleDash(process.argv.slice(2)));

  var options = {
    cmd: argv._.shift()
  }

  switch(options.cmd) {

    case "start":
      _describeStart();
      break;

    case "init":
      _describeInit();
      break;

    default:
      _describeShared();
      if(!options.cmd) {
        _processArgs(argv, options, fs, path);
        console.error("Command not specified.");
      } else {
        console.error("Unknown command '" + options.cmd + "'.");
      }
      optimist.showHelp();
      process.exit(1);

  }

  return _processArgs(argv, options, fs, path);

}

var _processArgs = function(argv, options, fs, path) {

  if(argv.help) {
    console.log(optimist.help());
    process.exit(0);
  }

  if(argv.version) {
    console.log("Snowman version: " + constants.VERSION);
    process.exit(0);
  }

  var configFile = argv._.shift();

  if (!configFile) {
    // default config file (if exists)
    if (fs.existsSync('./snowman.conf.js')) {
      configFile = './snowman.conf.js'
    } else if (fs.existsSync('./.config/snowman.conf.js')) {
      configFile = './.config/snowman.conf.js'
    }
  }

  options.configFile = configFile ? path.resolve(configFile) : null;

  return options;

}

var Snowman = (function () {

  var config;

  function Snowman() {

    config = _process();

  }

  Snowman.prototype.run = function() {

    switch(config.cmd) {

      case "start":
        require("./start").start(config);
        break;
      case "init":
        require("./init").init(config);
        break;
      default:
        console.log("create style guide");
        break;

    }

  }

  return Snowman;

})();

module.exports = new Snowman;