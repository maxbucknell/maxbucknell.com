'use strict';


/**
 * Module dependencies
 */

var path = require('path')
var fs = require('fs')

var _ = require('lodash-node')


/**
 * Dependency tree — the raison d'être
 */

var dependencies = {}


/**
 * Export public API
 *
 * The public API in this case is a middleware function, which adds a method
 * to the response object
 */

module.exports = scriptManager


/**
 * Middleware script loader
 *
 * This middleware adds one method to the response object: `addScript`,
 * adds the given script to the page. It will also preload any
 * dependencies specified in the script by an `//@include` directive.
 *
 * The middleware also adds a function accessible to the view, which
 * outputs a call to `$LAB`.
 *
 * Caching enabled.
 */

function scriptManager (req, res, next) {
  res.addScript = addScript
  res.locals.getLabChain = getLabChain

  next()
}


/**
 * Add the given script to the dependency tree.
 *
 * It will also add any depencies specified to the tree, underneath the
 * given script.
 */

function addScript (script) {
  addToDependencyTree(script, dependencies, 0)
}


/**
 * Add the given script to the dependency tree.
 */

function addToDependencyTree (script, parent, depth) {
  if (depth > 100) throw new Error('Circular dependency in script.')

  if (_.isObject(parent[script])) return
  else parent[script] = {}

  var file = path.join(__dirname, '..', script)

  var content = fs.readFileSync(file, { encoding: 'utf-8' })

  var includeCalls = content.match(/\/\/@include .+\.js\s/g)

  var deps = _.map(includeCalls, getScriptUrl)

  _.each( deps
        , function wrapper (dep) {
            addToDependencyTree(dep, parent[script], depth + 1)
          }
        )
}


/**
 * Strip the include declaration
 */

function getScriptUrl (includeCall) {
  return includeCall.replace('//@include ', '').trim()
}


/**
 * Wrap script in script call
 */

function wrapInScript (script) {
  var templateText = 'script(\'<%= script %>\')'
  var data = { script: script }

  return _.template(templateText, data)
}

function convertToScriptCalls (level) {
  return _.map(level, wrapInScript).join('.')
}


/**
 * Parse the dependency tree into a LABjs call.
 *
 * Also cache the call.
 */

function getLabChain () {
  var levels = getDependencyLevels()

  var scriptCalls = _.map(levels, convertToScriptCalls)

  var labChain = scriptCalls.join('.wait().')

  var templateText = '$LAB.<%= labChain %>'
  var data = { labChain: labChain }

  return _.template(templateText, data)
}


/**
 * Parse the dependency tree into various levels
 */

function getDependencyLevels () {
  var levels = _getDependencyLevels(dependencies)

  var sanitisedLevels = []

  for (var i = 0, len = levels.length; i < len; i += 1) {
    sanitisedLevels[i] = _.partial(_.difference, levels[i])
      .apply(null, levels.slice(0, i))
  }

  return sanitisedLevels
}


/**
 * Add a level onto the dependency tree
 */

function _getDependencyLevels (deps) {
    var level = Object.keys(deps)

    function getDeps (script) {
      return deps[script]
    }

    var nextGeneration = merge.apply(null, _.map(level, getDeps))

    if (_.isEmpty(nextGeneration)) return [level]
    else return _getDependencyLevels(nextGeneration).concat([level])

}


/**
 * Merge all object properties into a new object
 */

function merge () {
  return _.merge.apply(null, [{}].concat(_.toArray(arguments)))
}
