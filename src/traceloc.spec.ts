// import * as debugModule from "debug";
// const log = debugModule("traceloc");

import {
    Expect,
    SpyOnProperty,
    Test,
} from "alsatian";

import { here, TraceLoc } from "../out/traceloc";

import { ITraceLoc } from "../out/itraceloc";

export class TracingTests {

    @Test()
    public testTracing() {
        const loc = here();

        Expect(loc.toString())
            .toBe(`${loc.func} ${loc.file}:${loc.line}:${loc.col}`);
    }

    @Test("stack is empty")
    public testTraceLocEmptyStack() {
        const loc = new TraceLoc();
        SpyOnProperty(loc, "stackState").andReturnValue("");
        Expect(loc.file).not.toBeTruthy();
        Expect(loc.func).not.toBeTruthy();
        Expect(loc.line).toBeLessThan(0);
        Expect(loc.col).toBeLessThan(0);
    }

    @Test("stack is shorter then where current location is")
    public testTraceLocShortStack() {
        const loc = new TraceLoc();
        SpyOnProperty(loc, "stackState").andReturnValue("Error");
        Expect(loc.file).not.toBeTruthy();
        Expect(loc.func).not.toBeTruthy();
        Expect(loc.line).toBeLessThan(0);
        Expect(loc.col).toBeLessThan(0);
    }

    @Test("stack doesn't contain enough fields")
    public testTraceLocNotEnoughFieldsInStack() {
        const loc = new TraceLoc();
        SpyOnProperty(loc, "stackState")
            .andReturnValue("Error\n  at aFunc (/xyz/file.xx:12)");
        Expect(loc.file).not.toBeTruthy();
        Expect(loc.func).not.toBeTruthy();
        Expect(loc.line).toBeLessThan(0);
        Expect(loc.col).toBeLessThan(0);
    }

    @Test("test normal loc")
    public normal() {
        const loc = new TraceLoc();
        Expect(loc.func).toBe("TracingTests.normal");
        Expect(loc.file).toBe("src/traceloc.spec.ts");
        Expect(loc.line).toBeGreaterThan(0);
        Expect(loc.col).toBeGreaterThan(0);
    }

    @Test("test normal function here")
    public normalHere() {
        const loc = here();
        Expect(loc.func).toBe("TracingTests.normalHere");
        Expect(loc.file).toBe("src/traceloc.spec.ts");
        Expect(loc.line).toBeGreaterThan(0);
        Expect(loc.col).toBeGreaterThan(0);
    }

    @Test("Execute anon")
    public anon() {
        (function() { // tslint:disable-line
            const loc = here();
            Expect(loc.func).not.toBeTruthy();
            Expect(loc.file).toBe("src/traceloc.spec.ts");
            Expect(loc.line).toBeGreaterThan(0);
            Expect(loc.col).toBeGreaterThan(0);
        })();
    }

    @Test("test here on the same line")
    public testSameLineHere() {
        let loc1, loc2: ITraceLoc; // tslint:disable-line
        loc1 = here(), loc2 = here();
        Expect(loc1.line).toBeGreaterThan(0);
        Expect(loc1.line).toBe(loc2.line);
        Expect(loc1.col).toBeGreaterThan(0);
        Expect(loc1.col).toBeLessThan(loc2.col);
    }

    @Test("test here on two adjacent lines")
    public testAjacentHeres() {
        const loc1 = here();
        const loc2 = here();
        Expect(loc2.line).toBe(loc1.line + 1);
        Expect(loc2.line).toBeGreaterThan(loc1.line);
        Expect(loc1.col).toBeGreaterThan(0);
        Expect(loc1.col).toBe(loc2.col);
    }

    @Test("test column")
    public testHere() {
        const loc1 =
here(); // tslint:disable-line
        const loc2 =
 here(); // tslint:disable-line
        Expect(loc1.line).toBeGreaterThan(0);
        Expect(loc2.line).toBe(loc1.line + 2);
        Expect(loc1.col).toBe(1);
        Expect(loc2.col).toBe(2);
    }
}
