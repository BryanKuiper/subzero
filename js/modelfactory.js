define("modelfactory", ["models/blog"], function(BlogModel) {

    "use strict";

    return {

        createModel: function(type, attributes) {

            var newModel;
            if (type === "blog") {
                newModel = new BlogModel(attributes);
            }
            return newModel;
        }
    };

});
