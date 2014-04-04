'use strict';


/**
 * Module dependencies
 */

// var _ = require('lodash-node')


/**
 * Export route — home page
 */

module.exports = index


/**
 * Home page route
 */

function index (req, res) {
  res.addScript('/public/js/welcome.js')
  res.render('index')
}
