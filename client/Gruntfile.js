module.exports = function(grunt) {
    'use strict';

    var _ = grunt.util._;

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        env: {
            options: {
            },
            dev: {
                NODE_ENV: 'DEVELOPMENT'
            },
            prd: {
                NODE_ENV: 'PRODUCTION'
            }
        },
        preprocess: {
            dev: {
                src: 'source/index.html',
                dest: 'build/index.html',
                options: {
                    context: {
                        cssFiles: '' // set this with the list cssFiles task
                    }
                }
            },
            prd: {
                src: 'source/index.html',
                dest: 'build/index.html'
            }
        },
        bower: {
            target: {
                rjsConfig: 'source/main.js',
                options: {
                    baseUrl: 'source'
                }
            }
        },
        jshint: {
            all: ['Gruntfile.js', 'source/**/*.js'],
            options: {
                multistr: true,
                browser: true,
                globals: {
                    jQuery: true
                },
            },

        },
        requirejs: {
            options: {
                baseUrl:'./'
            },
            build: {
                options: {
                    modules: [{name:'script/main'}],
                    dir: 'build',
                    appDir: 'source',
                    fileExclusionRegExp: /.*\.less/,
                    removeCombined:true,
                    mainConfigFile: "source/main.js",
                }
            }
        },
        less: {
            build: {
                options: {
                    cleancss: true,
                    optimization: 2
                },
                files: {
                    'build/forum.min.css': ['source/**/*.less']
                }
            },
            dev: {
                options: {
                    cleancss: false
                },
                files: [
                    {
                        expand: true,
                        cwd: 'source',
                        src: ['**/*.less'],
                        dest: 'build/',
                        ext: '.css'
                    }
                ]
            }
        },
        copy: {
            build: {
                files: [{
                    src: 'bower_components/requirejs/require.js',
                    dest: 'build/require.js'
                }, {
                    src: 'bower_components/bootstrap/dist/css/bootstrap.min.css',
                    dest: 'build/bootstrap.min.css'
                }]
            },
            dev: {
                files: [{
                        src: 'bower_components/requirejs/require.js',
                        dest: 'build/require.js'
                    }, {
                        expand: true,
                        cwd: 'source/',
                        src: ['**','!**/*.less'],
                        dest: 'build/'
                    }, {
                        expand: true,
                        src: 'bower_components/**/*.*',
                        dest: 'build/'
                    },
                        
                ]
            }
        }
    });

    //this replaces the need to load all grunt tasks manually
    require('matchdep').filterDev('grunt-*').forEach(function(mod) {
        // these are not grunt plugins
        if (!mod.match('grunt-template') && !mod.match('grunt-cli')) {
            grunt.loadNpmTasks(mod);
        }
    });

    grunt.registerTask('listcss', 'creates a variable which holds a list of css links', function(target) {
        var files = ['source/**/*.less'];
        var cssList = '';
        _.forEach(grunt.file.expand(files), function (file) {
                cssList += '        <link rel="stylesheet" href="' + file.replace('source/','').replace('less','css') + '"/>\r\n';
        });
        grunt.config.set('preprocess.dev.options.context.cssFiles', cssList);
    });
    
    grunt.registerTask('clean', 'Clean up output files.', function (target) {
        var output = grunt.config('build');
        var files = [ 'build/**/*.*' ];
        var options = { force: (target == 'force') };
        _.forEach(grunt.file.expand(files), function (file) {
            if (grunt.file.exists(file))
                grunt.file.delete(file, options);
        });
        return !this.errorCount;
    });
    
    // Default task(s).
    grunt.registerTask('default', ['install', 'jshint']);
    grunt.registerTask('build', ['env:prd', 'clean', 'requirejs:build', 'less:build', 'copy:build', 'preprocess:prd']);
    grunt.registerTask('dev', ['env:dev', 'clean', 'less:dev', 'listcss', 'copy:dev', 'preprocess:dev']);

};
