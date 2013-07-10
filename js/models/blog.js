define("blog", ["backbone"], function(Backbone) {

    "use strict";

    return Backbone.Model.extend({

        defaults: {
            "title": "",
            "body": "",
            "author": "",
            "numOfComments": 0
        }

    });

});
