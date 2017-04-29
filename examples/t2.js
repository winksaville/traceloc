"use strict";
exports.__esModule = true;
var traceloc_1 = require("traceloc");
function sub() {
    var loc = traceloc_1.here();
    console.log("sub: func=" + loc.func + " file=" + loc.file + " line=" + loc.line + " col=" + loc.col);
}
sub();
//# sourceMappingURL=t2.js.map