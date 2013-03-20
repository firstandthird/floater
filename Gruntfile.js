module.exports = function(grunt) {
  grunt.initConfig({
    info: grunt.file.readJSON('component.json'),
    meta: {
      banner: '/*!\n'+
              ' * <%= info.name %> - <%= info.description %>\n'+
              ' * v<%= info.version %>\n'+
              ' * <%= info.homepage %>\n'+
              ' * copyright <%= info.copyright %> <%= grunt.template.today("yyyy") %>\n'+
              ' * <%= info.license %> License\n'+
              '*/\n'
    },
    jshint: {
      all: ['lib/**/*.js', 'grunt.js', 'component.json']
    },
    concat: {
      options: {
        banner: '<%= meta.banner %>'
      },
      dist: {
        src: 'lib/floater.js',
        dest: 'dist/fidel.floater.js'
      },
      full: {
        src: ['components/fidel/dist/fidel.js', 'lib/floater.js'],
        dest: 'dist/floater.js'
      }
    },
    uglify: {
      options: {
        banner: '<%= meta.banner %>'
      },
      dist: {
        src: 'dist/fidel.floater.js',
        dest: 'dist/fidel.floater.min.js'
      },
      full: {
        src: 'dist/floater.js',
        dest: 'dist/floater.min.js'
      }
    },
    watch: {
      js: {
        files: '<%= jshint.all %>',
        tasks: 'default' 
      }
    },
    reloadr: {
      test: [
        'example/*',
        'test/*',
        'dist/*'
      ]
    },
    connect: {
      server:{
        port: 8000,
        base: '.'
      }
    }
  });
  grunt.loadNpmTasks('grunt-reloadr');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.registerTask('default', ['jshint',  'concat', 'uglify']);
  grunt.registerTask('dev', ['connect', 'reloadr', 'watch']);
};
