import {
    Expect,
    SpyOnProperty,
    Test,
} from "alsatian";

import { here, ITraceLoc, setProjectRoot, TraceLoc } from "../out/traceloc";

import * as os from "os";
import * as path from "path";

function myHere(): ITraceLoc {
    return here(1);
}

function nestHere2(): ITraceLoc {
    return here(2);
}

function nestHere1(): ITraceLoc {
    return nestHere2();
}

function customHere(): string {
    const loc = here(1);
    return `customHere: ${loc.func}:${loc.line}`;
}

export class TracingTests {

    @Test()
    public testSetProjectRoot() {
        let loc: ITraceLoc;

        const orgVal = setProjectRoot("weirdValue");
        Expect(setProjectRoot(orgVal)).toBe("weirdValue");
        Expect(setProjectRoot(orgVal)).toBe(orgVal);

        setProjectRoot(undefined);
        loc = new TraceLoc();
        Expect(loc.file).toBe("src/traceloc.spec.ts");

        setProjectRoot(null);
        loc = new TraceLoc();
        Expect(loc.file).toBe("src/traceloc.spec.ts");

        setProjectRoot(".");
        loc = new TraceLoc();
        Expect(loc.file).toBe("src/traceloc.spec.ts");

        setProjectRoot("");
        loc = new TraceLoc();
        if (os.type() === "Linux") {
            Expect(loc.file.indexOf("/")).toBe(0);
        }
        Expect(loc.file.indexOf("src/traceloc.spec.ts")).toBeGreaterThan(0);

        setProjectRoot("/");
        loc = new TraceLoc();
        if (!path.relative("/", ".")) {
            // Current working directory is / be careful :)
            Expect(loc.file.indexOf("src/traceloc.spec.ts")).toBe(0);
        } else {
            // Current working directory is not /
            Expect(loc.file.indexOf("src/traceloc.spec.ts")).toBeGreaterThan(0);
        }

        setProjectRoot(path.join(__dirname));
        loc = new TraceLoc();
        Expect(loc.file).toBe("../src/traceloc.spec.ts");

        setProjectRoot(orgVal);
    }

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

    @Test("Test we can have our own here()")
    public testMyHere() {
        const locMyHere = myHere();
        const locHere = here();
        Expect(locMyHere.func).toBe("TracingTests.testMyHere");
        Expect(locMyHere.file).toBe("src/traceloc.spec.ts");
        Expect(locMyHere.line).toBe(locHere.line - 1);
        Expect(locMyHere.col).toBe(locHere.col + 2);
    }

    @Test("Test we can have nest here beyond 1")
    public testNestingHereBeyond1() {
        const locNestHere1 = nestHere1();
        const locHere      = here();
        Expect(locNestHere1.func).toBe("TracingTests.testNestingHereBeyond1");
        Expect(locNestHere1.file).toBe("src/traceloc.spec.ts");
        Expect(locNestHere1.line).toBe(locHere.line - 1);
        Expect(locNestHere1.col).toBe(locHere.col);
    }

    @Test("Test custom here that returns string")
    public testCustomHere() {
        const locCustomHere = customHere();
        const locHere = here();
        Expect(locCustomHere).toBe(`customHere: ${locHere.func}:${locHere.line - 1}`);
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
        let loc1: ITraceLoc;
        let loc2: ITraceLoc;
        loc1 = here(); loc2 = here();
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
