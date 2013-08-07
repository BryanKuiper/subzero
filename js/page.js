define("page", ["backbone", "view"], function(Backbone, View) {

    "use strict";

    return Backbone.View.extend({

        constructor: function(context, options) {

            console.log(context);

            // context may be an Application or View object.
            var application;
            if (context instanceof View) {
                application = context.application;
            } else {
                application = context;
            }

            /**
             * Reference to the application object.
             */
            this.application = application;
            if (!this.application) {
                console.log("Page instantiated without Application reference");
            }

            Backbone.View.call(this, options);
        }
    });

});
