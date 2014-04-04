/* jshint browser: true, jquery: true */
/* globals _: false */

/**
 * Module dependencies
 */

//@include /public/lib/lodash/dist/lodash.js

(function () {
  'use strict';

  function exportedNamespace (id) {
    return _.reduce(id.split('/'), createNamespace, exportedNamespace)
  }

  function createNamespace (o, key) {
    if (!_.isObject(o[key])) o[key] = {}

    return o[key]
  }


  window.mbcom = exportedNamespace
})()
