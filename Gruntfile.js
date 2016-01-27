module.exports = function(grunt) {

	const path = require('path');
	const fs = require('fs');
	const util = require('util');

	grunt.initConfig({
			
		pkg: grunt.file.readJSON('package.json'),
		
		readDeployNumber: function() {

			var numberFile = '.deployrc';

			if(!grunt.file.exists(numberFile)) {
				grunt.fail.fatal(util.format('deploy file "%s" does not exist.', numberFile));
			}

			var number = grunt.file.read(numberFile, {encoding: 'utf8'});

			if(number.length === 0) {
				grunt.fail.fatal('deploy number is empty');
			}

			return number;
		},
		
		onWatch:  function(action, filepath) {
			
			var pattern = new RegExp(/\\/g);
			filepath = filepath.replace(pattern, '/');
			var trimedSrcPath = filepath.replace(grunt.config('dirs.srcBase') , '');
			grunt.log.debug('trimedSrcPath = ' + trimedSrcPath);
			var maps = grunt.config('dirs.maps');
			var dest = '';
			for(var key in maps) {
				grunt.log.debug('key = ' + key);
				if(trimedSrcPath.startsWith(key)) {
					grunt.config('copy.files.cwd', grunt.config('dirs.srcBase') + key);
					dest = util.format(maps[key], grunt.config('dirs.deployNumber'));
					trimedSrcPath = trimedSrcPath.replace(key, '');
				}
			}

			grunt.config('copy.files.src', trimedSrcPath);
			
			dest = util.format('%s/%s', grunt.config('dirs.distBase'), dest);
			
			grunt.log.debug('dest = ' + dest);
			
			grunt.config('copy.files.dest', dest);
		},
		
		dirs: {
			srcBase: 'Web-Server/',
			distBase: 'D:/java-practise/tools/jboss/server/web-jboss-eap-4.3_CP08/jboss-as/server/ec/deploy/jboss-web.deployer/ROOT.war',
			maps: {
				'css/': 'css_%s/',
				'js/':	'js_%s/'
			}
		},
		
		watch: {
			livereload: {
				options: {
					livereload: true
				},
				files: ['<%= dirs.distBase %>/**/*']
			},
			all: {
				files: ['<%= dirs.srcBase %>/**/*.js', '<%= dirs.srcBase %>/**/*.css'],
				tasks: ['copy'],
				options: {
					spawn: false
				}
			}
		},
		
		//Overrideinheritedtaskconfig
		browserify: {
			dev: {
				src: ['js/*.js'],
				dest: 'i/now/go/somewhere/else.js'				
			}
		},
		
		concat: {   
			dist: {
				src: [
					'js/libs/*.js', // All JS in the libs folder
					'js/global.js'  // This specific file
				],
				dest: 'js/build/production.js'
			}
		},
		
		uglify:{
			build:{
                src: 'js/build/production.js',
                dest: 'js/build/production.min.js'
			}
		},
		
		// sync: {
			// main: {
				// src: ['**/*.js', '**/*.css'],
				// dest: 'dest/',
				// verbose: true, //Default: false
				// pretend: false, //Don't do any disk operations-just write log. Default: false
				// failOnError: true, //Fail the task when copying is not possible.Default: false
				// compareUsing: "md5"//comparesviamd5hashoffilecontents,
			// }
		// },
				
		copy: {
			files: {
				cwd: '<%= dirs.srcBase %>',
				src: '*',
				dest: '<%= dirs.distBase %>/',
				expand: true
			}
		}
	});
	
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-sync');
	
	grunt.registerTask('default', ['watch']);
	
	grunt.registerTask('log', 'Log to console', function(msg) {
		grunt.log.writeln('src: ' + this.name);
	});
	
	grunt.event.on('watch', grunt.config('onWatch'));
	
	var number = grunt.config('readDeployNumber')();
	grunt.config('dirs.deployNumber', number);
};