(function() {

    "use strict";

    var casper = require("casper").create();
    casper.start("http://localhost:4002/build/", function() {

        this.waitForSelector(".header-title", function() {
            this.test.assertTitle("Welcome at jsHeaven", "The header title is present");
        });
    });

    casper.run();
})();
