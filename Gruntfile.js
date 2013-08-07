module.exports = function(grunt) {

    var locale = grunt.option("locale") || "en";

    // default external config
    var config = {
        isPackaged: false,
        isProduction: false
    };

    var sources = {
        // let grunt handle it
        "js": [],
        "libs": [],
        "tmpl": [],

        // only specified tests
        "tests": [
            "setup"
        ]
    };

    grunt.file.recurse("js", function(abspath, rootdir, subdir, filename) {
        var include = false;
        if (filename.substr(-3) === ".js") {
            include = true;
        }

        if (include) {
            if (subdir === "lib") {
                if (filename === "less" || filename === "require") {
                    // less will take care of itself
                    // require.js is never packaged
                } else {
                    sources.libs.push(filename.substr(0, filename.length - 3));
                }
            } else {
                sources.js.push((subdir ? subdir + "/" : "") +
                    filename.substr(0, filename.length - 3));
            }
        }
    });

    grunt.file.recurse("tmpl", function(abspath, rootdir, subdir, filename) {
        if (filename.substr(-11) === ".handlebars") {
            sources.tmpl.push((subdir ? subdir + "/" : "") +
                filename.substr(0, filename.length - 11));
        }
    });

    function requirePaths(options) {

        options = options || {};

        var paths = {};
        var jsPrefix = (config.isPackaged ? "js/" : "../js/");
        if (options.compiled) {
            sources.js.forEach(function(baseName) {
                paths[baseName] = jsPrefix + "app";
            });
            sources.libs.forEach(function(baseName) {
                paths[baseName] = jsPrefix + "libs";
            });
            sources.tmpl.forEach(function(baseName) {
                paths["tmpl/" + baseName] = jsPrefix + "tmpl";
            });
        } else {
            sources.js.forEach(function(baseName) {
                paths[baseName] = jsPrefix + baseName;
            });
            sources.libs.forEach(function(baseName) {
                paths[baseName] = jsPrefix + "lib/" + baseName;
            });
            sources.tmpl.forEach(function(baseName) {
                paths["tmpl/" + baseName] = "tmpl/" + baseName;
            });
        }
        if (!config.isProduction) {
            paths.mockdata = "../tests/mockdata";
        }
        paths.tmpl = jsPrefix + "tmpl";
        return paths;
    }

    grunt.initConfig({

        "pkg": grunt.file.readJSON("package.json"),
        "concat": {
            "options": {
                "separator": ";"
            },
            "dist": {
                "src": ["/js/**/*.js"],
                "dest": "build/js/<%= pkg.name %>.js"
            }
        },
        "uglify": {
            "options": {
                "banner": "/*! <%= pkg.name %> <%= grunt.template.today('dd-mm-yyyy') %> */\n"
            },
            "dist": {
                "files": {
                    "build/js/<%= pkg.name %>.min.js": ["<%= concat.dist.dest %>"]
                }
            }
        },
        "jshint": {
            "files": ["gruntfile.js", "src/**/*.js", "test/**/*.js"],
            "options": {
                // options here to override JSHint defaults
                "globals": {
                    "jQuery": true,
                    "console": true,
                    "module": true,
                    "document": true
                }
            }
        },
        "watch": {
            "files": ["<%= jshint.files %>", "index.html.tmpl"],
            "tasks": ["jshint", "index"]
        },

        requirejs: {
            options: {
                paths: requirePaths(),
                shim: {
                    "backbone": { deps: ["underscore", "jquery"], exports: "Backbone" },
                    "handlebars": { exports: "Handlebars" },
                    "underscore": { exports: "_" }
                }
            },
            compile: {
                options: {
                    appDir: ".",
                    baseUrl: "./",
                    dir: "build",
                    enforceDefine: true,
                    optimizeCss: false,
                    keepBuildDir: true,
                    fileExclusionRegExp: /^\.|^Gruntfile.js$|^node_modules/,

                    modules: [
                        {
                            name: "js/app",
                            include: createPaths("js/", sources.js, ".js"),
                            exclude: sources.libs
                        },
                        {
                            name: "js/libs",
                            include: sources.libs
                        },
                        {
                            name: "js/tmpl",
                            include: createPaths("tmpl/", sources.tmpl, ".js"),
                            exclude: sources.libs
                        }
                    ]
                }
            }
        },

        "connect": {
            "server": {
                "options": {
                    "port": 4002,
                    "base": ".",
                    "middleware": function(connect, options) {
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

        "less": {
            "development": {
                "options": {
                    "paths": ["css"]
                },
                "files": {
                    "build/css/jsheaven.css": "css/jsheaven.less",
                    "build/css/bootstrap.css": "css/bootstrap.css"
                }
            },
            "production": {
                "options": {
                    "paths": ["css"],
                    "yuicompress": true
                },
                "files": {
                    "build/css/jsheaven.css": "css/jsheaven.less",
                    "build/css/bootstrap.min.css": "css/bootstrap.min.css"
                }
            }
        },

        "casperjs": {
            "options": {
                "verbose": true,
                "logLevel": "debug"
            },
            "files": createPaths("tests/test", sources.tests, ".js")
        },

        handlebars: {
            options: {
                namespace: "JSH.Templates",
                amd: true,
                processContent: function(content) {
                    return content.replace(/^[\x20\t]+/mg, '').replace(/[\x20\t]+$/mg, "")
                        .replace(/^[\r\n]+/, '').replace(/[\r\n]*$/, "\n");
                },
                processName: function(path) {
                    // refer to templates by the key defined in sources.tmpl
                    for (var i = 0; i < sources.tmpl.length; i++) {
                        var name = sources.tmpl[i];
                        if (path.indexOf("tmpl/" + name + ".handlebars") > -1) {
                            return name;
                        }
                    }
                    return "unknown template key";
                }
            },
            target: {
                files: handlebarsFiles("build/tmpl/", sources.tmpl)
            }
        }

    });

    function handlebarsFiles(prefix, fileNames) {
        var result = {};
        fileNames.forEach(function(fileName) {
            result[prefix + fileName + ".js"] = (config.isPackaged ? prefix : "tmpl/") +
                fileName + ".handlebars";
        });
        return result;
    }

    function createPaths(prefix, fileNames, extension) {
        var paths = [];
        fileNames.forEach(function(fileName) {
            paths.push(prefix + fileName + (extension || ""));
        });
        return paths;
    }

    function abstractTags(srcFile) {

        var gruntPackage = grunt.file.readJSON("package.json");
        var project = gruntPackage.project;

        for (var i in project) {
            if ((project.hasOwnProperty(i)) && (srcFile.indexOf("{{" + i + "}}") > -1)) {
                var replaceItem = new RegExp("{{" + i + "}}", "g");
                srcFile = srcFile.replace(replaceItem, project[i]);
            }
        }
        return srcFile;
    }

    // generate the client-side require.js configuration set in the HTML head
    var requirejsConfig = grunt.config("requirejs").options;
    if (config.isPackaged) {
        requirejsConfig.paths = requirePaths({ compiled: true });
    }
    grunt.config("requirejsConfig", requirejsConfig);

    grunt.loadNpmTasks("grunt-casperjs");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-less");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-requirejs");
    grunt.loadNpmTasks("grunt-contrib-connect");
    grunt.loadNpmTasks("grunt-contrib-handlebars");

    grunt.registerTask("test", ["jshint", "handlebars", "connect", "casperjs"]);
    grunt.registerTask("index", "Generate index.html depending on configuration", function() {
        var src = abstractTags(grunt.file.read("index.html.tmpl"));
        grunt.file.write("build/index.html", grunt.template.process(src));
    });

    grunt.registerTask("default", ["jshint", "less", "concat", "uglify", "handlebars", "index", "connect", "watch"]);

};
