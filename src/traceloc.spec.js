const Expect = require("alsatian").Expect;
const here = require("../out/traceloc").here;

// A self executing anonymous function
(function() {
    console.log("anonymous function");
    let loc = here();
    Expect(loc.func).not.toBeTruthy();
    Expect(loc.file).toBe("src/traceloc.spec.js");
    Expect(loc.line).toBeGreaterThan(0);
    Expect(loc.col).toBeGreaterThan(0);
})();

function test() {
    console.log("test");
    let loc = here();
    Expect(loc.func).toBe("test");
    Expect(loc.file).toBe("src/traceloc.spec.js");
    Expect(loc.line).toBeGreaterThan(0);
    Expect(loc.col).toBeGreaterThan(0);
}

test();
