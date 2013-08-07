define("model", ["backbone"], function(Backbone) {

    "use strict";

    return Backbone.Model.extend({

        clone: function() {

            var Constructor = this.constructor;
            return new Constructor(this.application, this.type, this.attributes);
        }
    });

});
