module.exports = function(grunt) {
  grunt.initConfig({
    'html-inspector': {
      all: ['*.html']
    },
    csslint: {
      all: ['css/*.css']
    },
    jshint: {
      all: ['js/*.js']
    },
    watch: {
      html: {
        files: ['*.html'],
        tasks: ['html-inspector']
      },
      css: {
        files: ['css/*.css'],
        tasks: ['csslint']
      },
      js: {
        files: ['js/*.js'],
        tasks: ['jshint']
      }
    }
  });
  grunt.loadNpmTasks('grunt-html-inspector');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', 'watch');
  grunt.registerTask('lint', ['html-inspector', 'csslint', 'jshint']);
};
