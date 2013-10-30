path = require 'path'

# Build configurations.
module.exports = (grunt) ->
    grunt.initConfig
        cmpnt: grunt.file.readJSON('bower.json'),
        banner: '/*! bzUploader v<%= cmpnt.version %> by Vitalii Savchuk(esvit666@gmail.com) - ' +
                    'https://github.com/esvit/bz-uploader - New BSD License */\n',
            
        # Deletes built file and temp directories.
        clean:
            working:
                src: [
                    'bz-uploader.*'
                    './.temp/views'
                    './.temp/'
                ]
        copy:
            styles:
                files: [
                    src: './src/styles/bz-uploader.less'
                    dest: './bz-uploader.less'
                ]

        uglify:
            # concat js files before minification
            js:
                src: ['bz-uploader.src.js']
                dest: 'bz-uploader.js'
                options:
                    banner: '<%= banner %>'
                    #sourceMap: (fileName) ->
                        #fileName.replace /\.js$/, '.map'
        concat:
            # concat js files before minification
            js:
                src: [
                    'src/scripts/01-*.js'
                    'src/scripts/02-*.js'
                    'src/scripts/03-*.js'
                    'src/scripts/04-*.js'
                    'src/scripts/05-*.js'
                    './.temp/scripts/views.js'
                    'src/scripts/06-*.js'
                ]
                dest: 'bz-uploader.src.js'

        less:
            css:
                files:
                    'bz-uploader.css': 'src/styles/bz-uploader.less'

        cssmin:
            css:
                files:
                    'bz-uploader.css': 'bz-uploader.css'
                options:
                    banner: '<%= banner %>'

        ngTemplateCache:
            views:
                files:
                    './.temp/scripts/views.js': 'src/bz-uploader/**/*.html'
                options:
                    trim: 'src/'
                    module: 'bzUploader'

    # Register grunt tasks supplied by grunt-contrib-*.
    # Referenced in package.json.
    # https://github.com/gruntjs/grunt-contrib
    grunt.loadNpmTasks 'grunt-contrib-clean'
    grunt.loadNpmTasks 'grunt-contrib-copy'
    grunt.loadNpmTasks 'grunt-contrib-less'
    grunt.loadNpmTasks 'grunt-contrib-cssmin'
    grunt.loadNpmTasks 'grunt-contrib-uglify'
    grunt.loadNpmTasks 'grunt-contrib-concat'


    # Register grunt tasks supplied by grunt-hustler.
    # Referenced in package.json.
    # https://github.com/CaryLandholt/grunt-hustler
    grunt.loadNpmTasks 'grunt-hustler'

    grunt.registerTask 'dev', [
        'clean'
        'ngTemplateCache'
        'concat'
        'less'
        'copy'
    ]
    grunt.registerTask 'default', [
        'dev'
        'uglify'
        'cssmin'
    ]
