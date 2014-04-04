/* jshint browser: true, jquery: true */
/* globals StateMachine: false, mbcom: false */

/**
 * Module dependencies
 */

//@include /public/lib/jquery/dist/jquery.js
//@include /public/lib/javascript-state-machine/state-machine.js

//@include /public/js/bootstrap.js

(function () {
  'use strict';

  var events = [ { name: 'me'
                 , from: ['university', 'work', 'init']
                 , to: 'me'
                 }
               , { name: 'university'
                 , from: ['me', 'work', 'init']
                 , to: 'university'
                 }
               , { name: 'work'
                 , from: ['me', 'university', 'init']
                 , to: 'work'
                 }
               ]

  var stateMachine = StateMachine.create({ initial: 'init', events: events })

  mbcom('welcome').stateMachine = stateMachine
})()
