var grunt = require('grunt');
var gruntfile = require('./Gruntfile.js');
// const Regex = require("regex");

gruntfile(grunt);

console.log(grunt.config('onWatch'));


var filepath = 'c:\\a\\b\\c\\d.js';
var pattern = new RegExp(/\\/g);
console.log(filepath.replace(pattern, '/'));