module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-screeps');

    grunt.initConfig({
        creds: grunt.file.readJSON('config/screeps-creds.json'),
        screeps: {
            options: {
                email: '<%= creds.email %>',
                password: '<%= creds.password %>',
                branch: grunt.option('branch') || 'default',
                ptr: false
            },
            dist: {
                src: ['dist/*.js']
            }
        }
    });
};