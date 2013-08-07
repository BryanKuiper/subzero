define("pagefactory", ["underscore", "page", "pages/home"], function(_, Page, Home) {

    "use strict";

    var pageFactory = function() {},
        pages = {
            "home": Home
        };


    pageFactory.prototype.openPage = function(category) {
        return new pages[category](this);
    };

    return pageFactory;
});
