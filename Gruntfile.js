module.exports = function(grunt) {

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['/js/**/*.js'],
                dest: 'build/js/<%= pkg.name %>.js'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                    'build/js/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
                }
            }
        },
        jshint: {
            files: ['gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
            options: {
                // options here to override JSHint defaults
                globals: {
                    jQuery: true,
                    console: true,
                    module: true,
                    document: true
                }
            }
        },
        watch: {
            files: ['<%= jshint.files %>', 'index.html.tmpl'],
            tasks: ['jshint', 'index']
        },

        connect: {
            server: {
                options: {
                    port: 4002,
                    base: ".",
                    middleware: function(connect, options) {
                        return [
                            connect.static(options.base),
                            function(req, res) {
                                // hackery to get pushState support in the dev server
                                if (req.url.substr(0, 7) === "/build/" &&
                                    req.url.substr(7, 4) !== "css/" &&
                                    req.url.substr(7, 5) !== "tmpl/") {
                                    var numSlashes = req.url.substr(7).split("/").length - 1;
                                    var pathPrefix = "";
                                    for (var i = 0; i < numSlashes; i++) {
                                        pathPrefix += "../";
                                    }

                                    var fs = require("fs");
                                    var indexPath = "/build/index.html";
                                    var html = fs.readFileSync(indexPath, "utf-8");
                                    html = html.replace(/(src|href)="/g, "$1=\"" + pathPrefix);
                                    html = html.replace(/:"..\/js\//g,
                                        ":\"" + pathPrefix + "../js/");
                                    html = html.replace(/:"tmpl\//g,
                                        ":\"" + pathPrefix + "tmpl/");
                                    res.end(html);
                                } else {
                                    res.statusCode = 404;
                                    res.end("File not found, 404");
                                }
                            }
                        ];
                    }
                }
            }
        },

        less: {
            development: {
                options: {
                    paths: ["css"]
                },
                files: {
                    "build/css/jsheaven.css": "css/jsheaven.less"
                }
            },
            production: {
                options: {
                    paths: ["css"],
                    yuicompress: true
                },
                files: {
                    "build/css/jsheaven.css": "css/jsheaven.less"
                }
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-connect');

    grunt.registerTask("index", "Generate index.html depending on configuration", function() {
        var tmpl = grunt.file.read("index.html.tmpl");
        grunt.file.write("build/index.html", grunt.template.process(tmpl));
    });

    grunt.registerTask('test', ['jshint']);

    grunt.registerTask('default', ['jshint', 'less', 'concat', 'uglify', 'index', 'connect', 'watch']);
    //grunt.registerTask('default', ['watch'])

};
