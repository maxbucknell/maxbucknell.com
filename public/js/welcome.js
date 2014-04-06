/* jshint browser: true, jquery: true */
/* globals mbcom: false, _: false */

/**
 * Module dependencies
 */

//@include /public/lib/jquery/dist/jquery.js
//@include /public/lib/lodash/dist/lodash.js

//@include /public/js/bootstrap.js
//@include /public/js/welcome/state-machine.js


/**
 * Welcome panel manager
 */

$(function welcomeBoxInit () {
  'use strict';

  /**
   * Add
   */

  /**
   * Set up the state machine
   */

  var stateMachine = mbcom('welcome/stateMachine')

  stateMachine.onenterstate = addBubbleFocus
  stateMachine.onleavestate = removeBubbleFocus


  /**
   * Our elements
   */

  var $bubblesContainer = $('.welcome-bubbles')
  var $bubbles = $('.welcome-bubble')

  /**
   * Bind event handlers
   */

  $bubblesContainer
    .on('click.welcome tap.welcome', '.welcome-bubble', bubbleSelect)


  /**
   * Show the welcome discs
   */

  _.delay(showBubbles, 800)

  function showBubbles () {
    $bubblesContainer.removeClass('condensed')
  }


  /**
   * Make the bubble a hand cursor
   */

  $bubbles.addClass('clickable')


  /**
   * Make a bubble the active bubble
   */

  function addBubbleFocus (bubble) {
    $('.' + bubble + '-welcome-bubble').addClass('bubble-active')
    $('.' + bubble + '-welcome-description').addClass('description-active')
  }


  /**
   * Don't let any bubble be the active bubble
   */

  function removeBubbleFocus () {
    $('.bubble-active').removeClass('bubble-active')
    $('.description-active').removeClass('description-active')
  }


  /**
   * Change the selected bubble based on an event
   */

  function bubbleSelect (e) {
    var state = $(e.currentTarget).data('stateName')

    if (stateMachine.can(state)) stateMachine[state]()
  }

})
