var fs = require('graceful-fs')
var util = require('util')
var path = require('path')

var JS_TEMPLATE_PATH = path.join(__dirname, '/../../config.tpl.js')

var JavaScriptFormatter = function () {
  var quote = function (value) {
    return "'" + value + "'"
  }

  var quoteNonIncludedPattern = function (value) {
    return util.format('{pattern: %s, included: false}', quote(value))
  }

  var pad = function (str, pad) {
    return str.replace(/\n/g, '\n' + pad).replace(/\s+$/gm, '')
  }

  var formatQuottedList = function (list) {
    return list.map(quote).join(', ')
  }

  this.TEMPLATE_FILE_PATH = JS_TEMPLATE_PATH

  this.formatFiles = function (includedFiles, onlyServedFiles) {
    var files = includedFiles.map(quote)

    onlyServedFiles.forEach(function (onlyServedFile) {
      files.push(quoteNonIncludedPattern(onlyServedFile))
    })

    files = files.map(function (file) {
      return '\n      ' + file
    })

    return files.join(',')
  }

  this.formatAnswers = function (answers) {
    return {
      DATE: new Date(),
      CSS: this.formatFiles(answers.css, []),
      STYLEGUIDE_SRC: answers.styleguideSrc,
      STYLEGUIDE_DEST: answers.styleguideDest,
      SINGLEPAGE: answers.singlePage ? 'true' : 'false',
    }
  }

  this.generateConfigFile = function (answers) {
    var template = fs.readFileSync(this.TEMPLATE_FILE_PATH).toString()
    var replacements = this.formatAnswers(answers)

    return template.replace(/%(.*)%/g, function (a, key) {
      return replacements[key]
    })
  }

  this.writeConfigFile = function (path, answers) {
    fs.writeFileSync(path, this.generateConfigFile(answers))
  }

}

exports.JavaScript = JavaScriptFormatter

exports.createForPath = function (path) {
  return new JavaScriptFormatter()
}