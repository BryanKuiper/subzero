define("application", ["i18n", "Handlebars"], function(i18n, Handlebars) {

    "use strict";

    /**
     * Application
     *
     * This is the main application object, maintaining global context.
     */
    function Application(configurations) {

        /**
         * The base URL of the application.
         */
        this.baseUrl = "";

        /**
         * Locale in which the application is displayed.
         */
        this.locale = "en";

        this._init(configurations);
    }

    _.extend(Application.prototype, {

        _init: function(config) {

            this.locale = config.locale || this.locale;

            var basePath = (window.location.pathname.substr(0, 7) === "/build/" ? "/build/" : "/");
            this.baseUrl = window.location.protocol + "//" + window.location.host + basePath;

            this._registerHandlebarsHelpers();
        },

        _registerHandlebarsHelpers: function() {

            Handlebars.registerHelper("i18n", function(key) {
                var text = i18n(key);
                if (arguments.length > 1) {
                    text = text.arg(arguments[1]);
                }
                return text.toString();
            });

            Handlebars.registerHelper("img", function(path) {
                return "/img/" + path;
            });
        },

        navigateToBase: function() {
            window.location = this.baseUrl;
        }
    });

    return Application;
});
