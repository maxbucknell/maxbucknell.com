'use strict';

/**
 * Let's talk about methodology
 *
 * I used to like require.js. I thought it was the bees knees as far as
 * dependency management was concerned. After a reasonably lengthy email
 * conversation with Kyle Simpson (@getify everywhere), I was forced to
 * reconsider this opinion.
 *
 * After much reconsideration, I decided that I would do something else.
 * Here you find a server side dependency management toolchain for
 * JavaScript.
 *
 * The system is based only on files and urls, rather than modules. I
 * have elected to implement a module namespace separately to
 * dependency management. That feels cleaner to me. The interface by
 * which I declare dependencies is almost verbatim taken from Kyle
 * Simpson. Given that a script has been loaded in the current request,
 * a dependency can be specified by a special annotation
 *
 *     //@include /public/js/dependency/a.js
 *
 * This script will then be pulled down and analysed for any other such
 * calls. Note that this means circular dependencies are verboten. So
 * bear that in mind. From these, a dependency tree is generated.
 *
 * When it comes time to actually send these scripts to the client, the
 * tree is separated into levels. The first level is the set of scripts
 * that are directly loaded into the request. The second level is made
 * up of their dependencies, and so on. Each of these levels is loaded
 * in reverse order. Each level loads in parallel, but depends on the
 * layer before it.
 *
 * Note that a script is only loaded in a level if it has not been
 * loaded in any previous level.
 *
 * So, that just about explains it.
 *
 */


/**
 * Module dependencies
 */

var path = require('path')
var fs = require('fs')

var _ = require('lodash-node')


/**
 * Dependency tree — the raison d'être
 *
 * Every dependency is an object under the object representing the
 * dependency above it. First generation properties of this object
 * are scripts that were directly loaded in the request.
 */

var dependencies = {}


/**
 * Export public API
 *
 * The public API in this case is a middleware function, which itself
 * defines the interface.
 */

module.exports = scriptManager


/**
 * Middleware script loader
 *
 * This middleware adds one function to the response object, and one
 * function to accessible to the template.
 *
 */

function scriptManager (req, res, next) {
  res.addScript = addScript
  res.locals.getLabChain = getLabChain

  next()
}


/**
 * Add the given script to the dependency tree.
 *
 * This is the function used to directly include a script in a request.
 *
 * The real work of this function is done by `addToDependencyTree`, but
 * I needed to hide some state in that function, which is why the logic
 * is not here.
 */

function addScript (script) {
  addToDependencyTree(script, dependencies, 0)
}


/**
 * The workhorse of the previous function.
 *
 * Add script as a dependency to the dependent script.
 */

function addToDependencyTree (dependency, dependent, depth) {
  if (depth > 100) throw new Error('Circular dependency in script.')

  // We don't want to parse a script twice if it's redeclared.
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


/**
 * Convert an array of js files into script chain
 *
 * This can be used as a fragment of a call to LABjs
 */

function convertToScriptCall (level) {
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

  // Remove dependencies that are present in a previous generation
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
 *
 * This is a utility function and probably shouldn't be here.
 */

function merge () {
  return _.merge.apply(null, [{}].concat(_.toArray(arguments)))
}
