module.exports = function(grunt)
{
	var config = require('./.screeps.json');

	var branch = grunt.option('branch') || config.branch;
	var ptr = grunt.option('ptr') ? false : config.ptr;
	var email = config.email;
	var password = config.password;
	
	grunt.loadNpmTasks('grunt-screeps');
	grunt.loadNpmTasks('grunt-combine-js');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-concat');
	
	grunt.initConfig({
		screeps: {
			options: {
				email: email,
				password: password,
				branch: branch,
				ptr: ptr
			},
			dist: {
				//src: ["src/" + branch + "/*.js"]
				src: ["dist/*.js"]
			}
		},
		
		combine_js: {
			files: [{
				combine_folder: "dist/*.js"
			}]
		},

		concat: {
			dist: {
				//src: ["src/" + branch + "/*.js"],
				src: ["dist/*.js"],
				dest: 'dist/main.js'
			},
		},

		copy: {
			screeps: {
				files: [{
					expand: true,
					cwd: 'src/' + branch + "/",
					src: '*',
					dest: 'dist/'
				}]
			}
		},

		// clean the dist folder
		clean: {
			'dist': ['dist']
		}
	})

	// combine into default task
	//grunt.registerTask('default', ['clean', 'copy', 'combine_js', 'screeps']);
	grunt.registerTask('default', ['clean', 'copy', 'concat', 'screeps']);
}
