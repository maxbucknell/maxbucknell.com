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
 * Keybase requires a very specific route
 */

app.use( '/.well-known'
       , express.static(path.join(__dirname, 'public/.well-known'))
       )

/**
 * Load default scripts
 */

app.use(require('./helpers/script-manager.js'))


/**
 * Configure routes
 */

app.get('/', require('./routes/index'))
app.get('/humans.txt', require('./routes/humans.txt'))


/**
 * Configure jade for views
 */

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

/**
 * Configure 404 handler
 */

app.use(require('./routes/error/404'))

/**
 * Export public api
 */

module.exports = app
