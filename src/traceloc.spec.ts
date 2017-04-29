// import * as debugModule from "debug";
// const log = debugModule("traceloc");

import {
    Expect,
    IgnoreTest,
    SpyOnProperty,
    Test,
} from "alsatian";

import { TraceLoc, TraceMarker } from "../out/traceloc";

export class TracingTests {

    @Test()
    public testTracing() {
        const loc = TraceLoc.here();

        Expect(loc.toString())
            .toBe(`${loc.func} ${loc.file}:${loc.line}:${loc.col}`);
    }

    @Test("stack was never marked location will be empty")
    public testTraceMarkerEmpty() {
        const emptyMarker =  new TraceMarker();
        const loc = emptyMarker.getLocation();
        Expect(loc.file).not.toBeTruthy();
        Expect(loc.func).not.toBeTruthy();
        Expect(loc.line).toBeLessThan(0);
        Expect(loc.col).toBeLessThan(0);
    }

    @Test("stack is shorter then where current location is")
    public testTraceMarkerShortStack() {
        const marker = new TraceMarker().mark();
        SpyOnProperty(marker, "stackState").andReturnValue("Error");
        const loc = marker.getLocation();
        Expect(loc.file).not.toBeTruthy();
        Expect(loc.func).not.toBeTruthy();
        Expect(loc.line).toBeLessThan(0);
        Expect(loc.col).toBeLessThan(0);
    }

    @Test("stack doesn't contain enough fields")
    public testTraceMarkerNotEnoughFieldsInStack() {
        const marker = new TraceMarker().mark();
        SpyOnProperty(marker, "stackState")
            .andReturnValue("Error\n  at aFunc (/xyz/file.xx:12)");
        const loc = marker.getLocation();
        Expect(loc.file).not.toBeTruthy();
        Expect(loc.func).not.toBeTruthy();
        Expect(loc.line).toBeLessThan(0);
        Expect(loc.col).toBeLessThan(0);
    }

    @Test("test normal function mark & loc")
    public normalMarkAndLoc() {
        const mark = new TraceMarker().mark();
        const loc = mark.getLocation();
        Expect(loc.func).toBe("TracingTests.normalMarkAndLoc");
        Expect(loc.file).toBe("src/traceloc.spec.ts");
        Expect(loc.line).toBeGreaterThan(0);
        Expect(loc.col).toBeGreaterThan(0);
    }

    @Test("test normal function here")
    public normalHere() {
        const loc = TraceLoc.here();
        Expect(loc.func).toBe("TracingTests.normalHere");
        Expect(loc.file).toBe("src/traceloc.spec.ts");
        Expect(loc.line).toBeGreaterThan(0);
        Expect(loc.col).toBeGreaterThan(0);
    }

    @Test("Execute anon")
    public anon() {
        (function() { // tslint:disable-line
            const loc = TraceLoc.here();
            Expect(loc.func).not.toBeTruthy();
            Expect(loc.file).toBe("src/traceloc.spec.ts");
            Expect(loc.line).toBeGreaterThan(0);
            Expect(loc.col).toBeGreaterThan(0);
        })();
    }

    // Ignore because fails with nyc
    @IgnoreTest()
    @Test("test here on the same line")
    public testSameLineHere() {
        let loc1, loc2: TraceLoc; // tslint:disable-line
        loc1 = TraceLoc.here(), loc2 = TraceLoc.here();
        Expect(loc1.line).toBeGreaterThan(0);
        Expect(loc1.line).toBe(loc2.line);
        Expect(loc1.col).toBeGreaterThan(0);
        Expect(loc1.col).toBeLessThan(loc2.col);
    }

    // Ignore because fails with nyc
    @IgnoreTest()
    @Test("test here on two adjacent lines")
    public testAjacentHeres() {
        const loc1 = TraceLoc.here();
        const loc2 = TraceLoc.here();
        Expect(loc2.line).toBe(loc1.line + 1);
        Expect(loc2.line).toBeGreaterThan(loc1.line);
        Expect(loc1.col).toBeGreaterThan(0);
        Expect(loc1.col).toBe(loc2.col);
    }

    // Ignore because fails with nyc
    @IgnoreTest()
    @Test("test column")
    public testHere() {
        const loc1 = TraceLoc
.here(); // tslint:disable-line
        const loc2 = TraceLoc
 .here(); // tslint:disable-line
        Expect(loc1.line).toBeGreaterThan(0);
        Expect(loc2.line).toBe(loc1.line + 2);
        Expect(loc1.col).toBe(2);
        Expect(loc2.col).toBe(3);
    }
}
