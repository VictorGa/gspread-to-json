module.exports = function (grunt) {
    grunt.initConfig({

        // define source files and their destinations
        uglify: {
            files: {
                src: [
                    'build/main.js',
                    'build/src/*.js'],  // source files mask
                dest: 'min/',    // destination folder
                expand: true,    // allow dynamic building
                flatten: true,   // remove all unnecessary nesting
                ext: '.min.js'   // replace .js to .min.js
            }
        },
        webpack: {
            prod: require('./webpack.config')
        }
    });

    // load plugins
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks("grunt-webpack");

    // register at least this one task
    grunt.registerTask('default', [ 'uglify' ]);
    //grunt.registerTask('build', [ 'webpack:prod' ]);
};
