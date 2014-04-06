'use strict';


/**
 * Module dependencies
 */

var fs = require('fs')
var path = require('path')

var marked = require('marked')


/**
 * Export route — home page
 */

module.exports = index

function getMarkdownContent (file) {
  var location = path.join(__dirname, '..', file)

  var markdownString = fs.readFileSync(location, { encoding: 'utf-8' })

  return marked(markdownString)
}

/**
 * Home page route
 */

function index (req, res) {
  res.addScript('/public/js/welcome.js')

  res.locals.title = 'Max Bucknell'

  res.locals.me = getMarkdownContent('/content/me.markdown')
  res.locals.work = getMarkdownContent('/content/work.markdown')
  res.locals.university = getMarkdownContent('/content/university.markdown')

  res.render('index')
}
