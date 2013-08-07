define("pages/home", ["underscore", "page", "tmpl/blog", "tmpl/blogpost"], function(_, Page, tmpl) {

    "use strict";

    return Page.extend({

        initialize: function() {
            this.el = this.$el.html(tmpl.blog());
        },

        render: function() {
            $(".blog-posts", this.el).html(tmpl.blogpost());
            return this;
        }
    });
});
