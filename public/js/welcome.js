/* jshint browser: true, jquery: true */
/* globals mbcom: false */

/**
 * Module dependencies
 */

//@include /public/lib/jquery/dist/jquery.js

//@include /public/js/bootstrap.js
//@include /public/js/welcome/state-machine.js


/**
 * Welcome panel manager
 */

$(function welcomeBoxInit () {
  'use strict';


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
    .on('mouseenter.welcome tap.welcome', breakBubblesOut)
    .on('mouseleave.welcome', putBubblesBack)
    .on('click.welcome tap.welcome', '.welcome-bubble', bubbleSelect)

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
   * Spread the bubbles out for easy tapping.
   */

  function breakBubblesOut (e) {
    $(e.currentTarget).addClass('welcome-focus')
  }


  /**
   * Clump the bubbles back together to look cool.
   */

  function putBubblesBack (e) {
    $(e.currentTarget).removeClass('welcome-focus')
  }


  /**
   * Change the selected bubble based on an event
   */

  function bubbleSelect (e) {
    var state = $(e.currentTarget).data('stateName')

    if (stateMachine.can(state)) stateMachine[state]()
  }

})
