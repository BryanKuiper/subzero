define("blogpost", ["model"], function(Model) {

    "use strict";

    return Model.extend({

        defaults: {
            "title": "",
            "body": "",
            "author": "",
            "numOfComments": 0
        }

    });

});
