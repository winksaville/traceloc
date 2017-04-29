"use strict";
exports.__esModule = true;
var traceloc_1 = require("traceloc");
var LOGGING = true;
function log(prompt) {
    if (LOGGING) {
        var loc = traceloc_1.here(1); // Get the location of the caller
        console.log(prompt + ": " + loc.func + ":" + loc.line);
    }
}
function sub() {
    log("enter");
    LOGGING = false;
    log("no output expected");
    LOGGING = true;
    console.log("Ready to exit");
    log("exit");
}
sub();
//# sourceMappingURL=t3.js.map