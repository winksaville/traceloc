"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const alsatian_1 = require("alsatian");
const traceloc_1 = require("../out/traceloc");
const os = require("os");
const path = require("path");
class TracingTests {
    testSetProjectRoot() {
        let loc;
        let orgVal = traceloc_1.setProjectRoot("weirdValue");
        alsatian_1.Expect(traceloc_1.setProjectRoot(orgVal)).toBe("weirdValue");
        alsatian_1.Expect(traceloc_1.setProjectRoot(orgVal)).toBe(orgVal);
        traceloc_1.setProjectRoot(undefined);
        loc = new traceloc_1.TraceLoc();
        alsatian_1.Expect(loc.file).toBe("src/traceloc.spec.ts");
        traceloc_1.setProjectRoot(null);
        loc = new traceloc_1.TraceLoc();
        alsatian_1.Expect(loc.file).toBe("src/traceloc.spec.ts");
        traceloc_1.setProjectRoot(".");
        loc = new traceloc_1.TraceLoc();
        alsatian_1.Expect(loc.file).toBe("src/traceloc.spec.ts");
        traceloc_1.setProjectRoot("");
        loc = new traceloc_1.TraceLoc();
        if (os.type() === "Linux") {
            alsatian_1.Expect(loc.file.indexOf("/")).toBe(0);
        }
        alsatian_1.Expect(loc.file.indexOf("src/traceloc.spec.ts")).toBeGreaterThan(0);
        traceloc_1.setProjectRoot("/");
        loc = new traceloc_1.TraceLoc();
        if (!path.relative("/", ".")) {
            // Current working directory is / be careful :)
            alsatian_1.Expect(loc.file.indexOf("src/traceloc.spec.ts")).toBe(0);
        }
        else {
            // Current working directory is not /
            alsatian_1.Expect(loc.file.indexOf("src/traceloc.spec.ts")).toBeGreaterThan(0);
        }
        traceloc_1.setProjectRoot(path.join(__dirname));
        loc = new traceloc_1.TraceLoc();
        alsatian_1.Expect(loc.file).toBe("../src/traceloc.spec.ts");
        traceloc_1.setProjectRoot(orgVal);
    }
    testTracing() {
        const loc = traceloc_1.here();
        alsatian_1.Expect(loc.toString())
            .toBe(`${loc.func} ${loc.file}:${loc.line}:${loc.col}`);
    }
    testTraceLocEmptyStack() {
        const loc = new traceloc_1.TraceLoc();
        alsatian_1.SpyOnProperty(loc, "stackState").andReturnValue("");
        alsatian_1.Expect(loc.file).not.toBeTruthy();
        alsatian_1.Expect(loc.func).not.toBeTruthy();
        alsatian_1.Expect(loc.line).toBeLessThan(0);
        alsatian_1.Expect(loc.col).toBeLessThan(0);
    }
    testTraceLocShortStack() {
        const loc = new traceloc_1.TraceLoc();
        alsatian_1.SpyOnProperty(loc, "stackState").andReturnValue("Error");
        alsatian_1.Expect(loc.file).not.toBeTruthy();
        alsatian_1.Expect(loc.func).not.toBeTruthy();
        alsatian_1.Expect(loc.line).toBeLessThan(0);
        alsatian_1.Expect(loc.col).toBeLessThan(0);
    }
    testTraceLocNotEnoughFieldsInStack() {
        const loc = new traceloc_1.TraceLoc();
        alsatian_1.SpyOnProperty(loc, "stackState")
            .andReturnValue("Error\n  at aFunc (/xyz/file.xx:12)");
        alsatian_1.Expect(loc.file).not.toBeTruthy();
        alsatian_1.Expect(loc.func).not.toBeTruthy();
        alsatian_1.Expect(loc.line).toBeLessThan(0);
        alsatian_1.Expect(loc.col).toBeLessThan(0);
    }
    normal() {
        const loc = new traceloc_1.TraceLoc();
        alsatian_1.Expect(loc.func).toBe("TracingTests.normal");
        alsatian_1.Expect(loc.file).toBe("src/traceloc.spec.ts");
        alsatian_1.Expect(loc.line).toBeGreaterThan(0);
        alsatian_1.Expect(loc.col).toBeGreaterThan(0);
    }
    normalHere() {
        const loc = traceloc_1.here();
        alsatian_1.Expect(loc.func).toBe("TracingTests.normalHere");
        alsatian_1.Expect(loc.file).toBe("src/traceloc.spec.ts");
        alsatian_1.Expect(loc.line).toBeGreaterThan(0);
        alsatian_1.Expect(loc.col).toBeGreaterThan(0);
    }
    anon() {
        (function () {
            const loc = traceloc_1.here();
            alsatian_1.Expect(loc.func).not.toBeTruthy();
            alsatian_1.Expect(loc.file).toBe("src/traceloc.spec.ts");
            alsatian_1.Expect(loc.line).toBeGreaterThan(0);
            alsatian_1.Expect(loc.col).toBeGreaterThan(0);
        })();
    }
    testSameLineHere() {
        let loc1, loc2; // tslint:disable-line
        loc1 = traceloc_1.here(), loc2 = traceloc_1.here();
        alsatian_1.Expect(loc1.line).toBeGreaterThan(0);
        alsatian_1.Expect(loc1.line).toBe(loc2.line);
        alsatian_1.Expect(loc1.col).toBeGreaterThan(0);
        alsatian_1.Expect(loc1.col).toBeLessThan(loc2.col);
    }
    testAjacentHeres() {
        const loc1 = traceloc_1.here();
        const loc2 = traceloc_1.here();
        alsatian_1.Expect(loc2.line).toBe(loc1.line + 1);
        alsatian_1.Expect(loc2.line).toBeGreaterThan(loc1.line);
        alsatian_1.Expect(loc1.col).toBeGreaterThan(0);
        alsatian_1.Expect(loc1.col).toBe(loc2.col);
    }
    testHere() {
        const loc1 = traceloc_1.here(); // tslint:disable-line
        const loc2 = traceloc_1.here(); // tslint:disable-line
        alsatian_1.Expect(loc1.line).toBeGreaterThan(0);
        alsatian_1.Expect(loc2.line).toBe(loc1.line + 2);
        alsatian_1.Expect(loc1.col).toBe(1);
        alsatian_1.Expect(loc2.col).toBe(2);
    }
}
__decorate([
    alsatian_1.Test(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TracingTests.prototype, "testSetProjectRoot", null);
__decorate([
    alsatian_1.Test(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TracingTests.prototype, "testTracing", null);
__decorate([
    alsatian_1.Test("stack is empty"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TracingTests.prototype, "testTraceLocEmptyStack", null);
__decorate([
    alsatian_1.Test("stack is shorter then where current location is"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TracingTests.prototype, "testTraceLocShortStack", null);
__decorate([
    alsatian_1.Test("stack doesn't contain enough fields"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TracingTests.prototype, "testTraceLocNotEnoughFieldsInStack", null);
__decorate([
    alsatian_1.Test("test normal loc"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TracingTests.prototype, "normal", null);
__decorate([
    alsatian_1.Test("test normal function here"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TracingTests.prototype, "normalHere", null);
__decorate([
    alsatian_1.Test("Execute anon"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TracingTests.prototype, "anon", null);
__decorate([
    alsatian_1.Test("test here on the same line"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TracingTests.prototype, "testSameLineHere", null);
__decorate([
    alsatian_1.Test("test here on two adjacent lines"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TracingTests.prototype, "testAjacentHeres", null);
__decorate([
    alsatian_1.Test("test column"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TracingTests.prototype, "testHere", null);
exports.TracingTests = TracingTests;
//# sourceMappingURL=traceloc.spec.js.map