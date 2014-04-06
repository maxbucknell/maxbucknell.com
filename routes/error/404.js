'use strict';


/**
 * Export route — home page
 */

module.exports = notFound


/**
 * Home page route
 */

function notFound (req, res) {
  res.send(404, 'not found')
}
