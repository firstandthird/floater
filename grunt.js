module.exports = function(grunt) {
  grunt.initConfig({
    info: '<json:component.json>',
    meta: {
      banner: '/*!\n'+
              ' * <%= info.name %> - <%= info.description %>\n'+
              ' * v<%= info.version %>\n'+
              ' * <%= info.homepage %>\n'+
              ' * copyright <%= info.copyright %> <%= grunt.template.today("yyyy") %>\n'+
              ' * <%= info.license %> License\n'+
              '*/'
    },
    lint: {
      all: ['lib/**/*.js', 'grunt.js', 'component.json']
    },
    concat: {
      dist: {
        src: ['<banner>', 'lib/floater.js'],
        dest: 'dist/fidel.floater.js'
      }
    },
    min: {
      dist: {
        src: ['<banner>', 'dist/fidel.floater.js'],
        dest: 'dist/fidel.floater.min.js'
      }
    },
    watch: {
      js: {
        files: '<config:lint.all>',
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
    server:{
      port: 8000,
      base: '.'
    }
  });
  grunt.loadNpmTasks('grunt-reloadr');
  grunt.registerTask('default', 'lint concat min');
  grunt.registerTask('dev', 'server reloadr watch');
};
