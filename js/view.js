define("view", ["backbone", "page"], function(Backbone, Page) {

    "use strict";

    var View = Backbone.View.extend({

        constructor: function(context, options) {

            var page = (context instanceof View) ? context.page : context;

            /**
             * Reference to the application object.
             */
            this.application = context.application;
            if (!this.application) {
                console.log("View instantiated without Application reference");
            }

            /**
             * Reference to the page the view belongs to (optional).
             */
            this.page = page;

            Backbone.View.call(this, options);
        }
    });

    return View;
});
