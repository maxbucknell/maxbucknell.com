/**
 * Module dependencies
 */

var path = require('path')

var express = require('express')


/**
 * Initialise app
 */

var app = express()


/**
 * Server static files from public directory
 */

app.use('/public', express.static(path.join(__dirname, 'public')))


/**
 * Load default scripts
 */

app.use(require('./helpers/script-manager.js'))


/**
 * Configure routes
 */

app.get('/', require('./routes/index'))


/**
 * Configure jade for views
 */

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')


/**
 * Export public api
 */

module.exports = app
