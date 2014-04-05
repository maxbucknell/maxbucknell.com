'use strict';


/**
 * Module dependencies
 */

var fs = require('fs')
var path = require('path')


/**
 * Export route — humans.txt
 */

module.exports = index


/**
 * Home page route
 */

function index (req, res) {
  res.type('text/plain')

  res.send(fs.readFileSync(path.join(__dirname, '../public/humans.txt')))
}
