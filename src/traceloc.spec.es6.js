const Expect = require("alsatian").Expect;
// const @Test = require("alsatian").@Test;
const TraceLoc = require("../out/traceloc").TraceLoc;
const TraceMarker = require("../out/traceloc").TraceMarker;
const here = require("../out/traceloc").here;

// A self executing anonymous function
(function() {
    console.log("anonymous function");
    let mark = new TraceMarker().mark();
    let loc = mark.getLocation();
    Expect(loc.func).not.toBeTruthy();
    Expect(loc.file).toBe("src/traceloc.spec.es6.js");
    Expect(loc.line).toBeGreaterThan(0);
    Expect(loc.col).toBeGreaterThan(0);
})();

function test() {
    console.log("test");
    let loc = here();
    Expect(loc.func).toBe("test");
    Expect(loc.file).toBe("src/traceloc.spec.es6.js");
    Expect(loc.line).toBeGreaterThan(0);
    Expect(loc.col).toBeGreaterThan(0);
}

test();
