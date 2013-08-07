define("router", ["jquery", "underscore", "backbone"], function($, _, Backbone) {

    "use strict";

    return Backbone.Router.extend({

        "initialize": function(context, options) {
            this.application = context;
        },

        "start": function() {
            Backbone.history.start();
        },

        "openPage": function(page) {
            var context = this.application.pageFactory.openPage(page);
            $("#Blog1").html(context.render().el);
        },

        "routes": {
            "": function() { this.openPage("home"); },
            "home": function() { this.openPage("home"); },
            "lol": function() { this.openPage("lol"); }
        }
    });
});
