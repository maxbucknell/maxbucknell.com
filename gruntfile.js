'use strict';

module.exports = function (grunt) {
  var config = { jshint: { options: { jshintrc: true }
                         , dist: [ 'gruntfile.js'
                                 , 'public/js/**/*.js'
                                 , 'app.js'
                                 , 'helpers/**/*.js'
                                 , 'routes/**/*.js'
                                 ]
                         }
               , sass: { options: { style: 'expanded' }
                       , dist: { files: { 'public/css/main.css': 'public/sass/main.sass' }}
                       }
               }


  grunt.initConfig(config)

  grunt.loadNpmTasks('grunt-contrib-jshint')
	grunt.loadNpmTasks('grunt-contrib-sass')

  // Default task
  grunt.registerTask('default', ['jshint', 'sass'])
};
