module.exports = function(grunt) {

	grunt.initConfig({

		browserify: {
			options: {
				transform: [
					["babelify"]
				]
			},
			dev: {
				options: {
					watch: true,
					keepAlive: true,
					browserifyOptions: {
						debug: true
					},
				},
				files: [{
					src: ['assets/js/app.js'],
					dest: 'static/js/app.min.js'
				}]
			},
			dist: {
				files: [{
					src: ['assets/js/app.js'],
					dest: 'assets/js/app.compiled.js'
				}]
			}
		},

        uglify: {
            dist: {
                files: [{
                    src: ['assets/js/app.compiled.js'],
                    dest: 'static/js/app.min.js',
                }]
            }
        },

        sass: {
            dist: {
                files: [{
                    src: ['assets/scss/main.scss'],
                    dest: 'assets/css/main.css'
                }]
            }
        },

        cssmin: {
            dist: {
                files: [{
                    src: ['assets/css/main.css'],
                    dest: 'static/css/main.min.css'
                }]
            }
        },

        copy: {
            install: {
                files: [{
                    expand: true,
                    src: ['static/**'],
                    dest: grunt.option('target')
                },{
                    expand: true,
                    src: ['index.html'],
                    dest: grunt.option('target')
                }]
            }
        },

        watch: {
            stylesheets: {
                files: [
                    'assets/scss/**',
                ],
                tasks: ['sass', 'cssmin'],
                options: {
                    spawn: false,
                },
            },
        },

	});

	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-sass');

	grunt.registerTask('default', ['browserify:dist', 'uglify:dist', 'sass:dist', 'cssmin:dist']);
    grunt.registerTask('install', ['default', 'copy:install'])
};
