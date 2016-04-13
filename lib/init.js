var readline = require('readline')
var path = require('path')
var glob = require('glob')
var mm = require('minimatch')
var exec = require('child_process').exec

var helper = require('./helper')
var logger = require('./logger')

var log = logger.create('init')

var StateMachine = require('./init/state_machine')
var COLOR_SCHEME = require('./init/color_schemes')
var formatters = require('./init/formatters')

// TODO(vojta): coverage
// TODO(vojta): html preprocessors
// TODO(vojta): SauceLabs
// TODO(vojta): BrowserStack

var logQueue = []
var printLogQueue = function () {
  while (logQueue.length) {
    logQueue.shift()()
  }
}

var NODE_MODULES_DIR = path.resolve(__dirname, '../..')

// Karma is not in node_modules, probably a symlink,
// use current working dir.
if (!/node_modules$/.test(NODE_MODULES_DIR)) {
  NODE_MODULES_DIR = path.resolve('node_modules')
}

var installPackage = function (pkgName) {
  // Do not install if already installed.
  try {
    require(NODE_MODULES_DIR + '/' + pkgName)
    return
  } catch (e) {}

  log.debug('Missing plugin "%s". Installing...', pkgName)

  var options = {
    cwd: path.resolve(NODE_MODULES_DIR, '..')
  }

  exec('npm install ' + pkgName + ' --save-dev', options, function (err, stdout, stderr) {
    // Put the logs into the queue and print them after answering current question.
    // Otherwise the log would clobber the interactive terminal.
    logQueue.push(function () {
      if (!err) {
        log.debug('%s successfully installed.', pkgName)
      } else if (/is not in the npm registry/.test(stderr)) {
        log.warn('Failed to install "%s". It is not in the NPM registry!\n' +
          '  Please install it manually.', pkgName)
      } else if (/Error: EACCES/.test(stderr)) {
        log.warn('Failed to install "%s". No permissions to write in %s!\n' +
          '  Please install it manually.', pkgName, options.cwd)
      } else {
        log.warn('Failed to install "%s"\n  Please install it manually.', pkgName)
      }
    })
  })
}

var validatePattern = function (pattern) {
  if (!glob.sync(pattern).length) {
    log.warn('There is no file matching this pattern.\n')
  }
}

var questions = [{
  id: 'css',
  question: 'Where should I look for your CSS?',
  hint: 'Should be a set of file paths.\n' +
    'You can use glob patterns, eg. "css/*.css" or "./src/css/**/*.css".\n' +
    'You can list any flavour of CSS (.css, .sass, .scss, .less, .styl).\n' +
    'No need for quote marks.\n' +
    'Enter empty string to move to the next question.',
  multiple: true,
  validate: validatePattern
}, {
  id: 'styleguideSrc',
  question: 'Where are you going to put your style guide templates?',
  hint: 'Should be a folder path, e.g. "/css/styleguide".\n' +
  'No need for quote marks.',
  multiple: false,
  validate: validatePattern
}, {
  id: 'styleguideDest',
  question: 'Where should I put the generated style guide?',
  hint: 'Should be a folder path, e.g. "/public/styles".\n' +
  'No need for quote marks.',
  multiple: false
}, {
  id: 'singlePage',
  question: 'Do you want the style guide to all be on a single page?',
  hint: 'Setting "no" will create a new page for each component.',
  options: ['yes', 'no'],
  boolean: true,
}]

var getBasePath = function (configFilePath, cwd) {
  var configParts = path.dirname(configFilePath).split(path.sep)
  var cwdParts = cwd.split(path.sep)
  var base = []

  while (configParts.length && configParts[0] === cwdParts[0]) {
    configParts.shift()
    cwdParts.shift()
  }

  while (configParts.length) {
    var part = configParts.shift()
    if (part === '..') {
      base.unshift(cwdParts.pop())
    } else if (part !== '.') {
      base.unshift('..')
    }
  }

  return base.join(path.sep)
}

var processAnswers = function (answers, basePath, testMainFile) {
  var processedAnswers = {
    basePath: basePath,
    css: answers.css,
    styleguideSrc: answers.styleguideSrc,
    styleguideDest: answers.styleguideDest,
    singlePage: answers.singlePage
  }
  return processedAnswers
}

exports.init = function (config) {

  logger.setupFromConfig(config)

  var colorScheme = COLOR_SCHEME.ON

  if (helper.isDefined(config.colors)) {
    colorScheme = config.colors ? COLOR_SCHEME.ON : COLOR_SCHEME.OFF
  }
  // need to be registered before creating readlineInterface
  process.stdin.on('keypress', function (s, key) {
    sm.onKeypress(key)
  })

  var rli = readline.createInterface(process.stdin, process.stdout)
  var sm = new StateMachine(rli, colorScheme)

  rli.on('line', sm.onLine.bind(sm))

  // clean colors
  rli.on('SIGINT', function () {
    sm.kill()
    process.exit(0)
  })

  sm.on('next_question', printLogQueue)

  sm.process(questions, function (answers) {
    var cwd = process.cwd()
    var configFile = config.configFile || 'snowman.conf.js'
    var testMainFile = 'test-main.js'
    var formatter = formatters.createForPath(configFile)
    var processedAnswers = processAnswers(answers, getBasePath(configFile, cwd), testMainFile)
    var configFilePath = path.resolve(cwd, configFile)
    var testMainFilePath = path.resolve(cwd, testMainFile)

    formatter.writeConfigFile(configFilePath, processedAnswers)
    console.log(colorScheme.success('Config file generated at "' + configFilePath + '".\n'))
  })
}