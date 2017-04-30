"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const source_map_support_1 = require("source-map-support");
source_map_support_1.install();
const path = require("path");
// import * as debugModule from "debug";
// const log = debugModule("traceloc");
function here(callDepth = 0) {
    return new TraceLoc(callDepth + 1);
}
exports.here = here;
class TraceLoc {
    /**
     * Mark the "current" location.
     *
     * @param callDepth is the call nesting if used directly no
     *        value is necessary and the default is 0. But if you
     *        use TraceMarker.mark in a subroutine and you want to
     *        mark where that subroutine was called from you need
     *        callDepth = 1 or the approprate value.
     */
    constructor(callDepth = 0) {
        this._func = "";
        this._file = "";
        this._line = -1;
        this._col = -1;
        const saveStackTraceLimit = Error.stackTraceLimit;
        Error.stackTraceLimit = callDepth + 1;
        const err = new Error();
        Error.captureStackTrace(err, this.constructor);
        Error.stackTraceLimit = saveStackTraceLimit;
        this.stackState = err.stack;
        // log(`${this.stackState}`);
        return this;
    }
    get func() {
        if (!this._func) {
            this.updateLocation();
        }
        return this._func;
    }
    get file() {
        if (!this._file) {
            this.updateLocation();
        }
        return this._file;
    }
    get line() {
        if (this._line < 0) {
            this.updateLocation();
        }
        return this._line;
    }
    get col() {
        if (this._col < 0) {
            this.updateLocation();
        }
        return this._col;
    }
    toString() {
        return `${this.func} ${this.file}:${this.line}:${this.col}`;
    }
    /**
     * Update the location info
     *
     */
    updateLocation() {
        // log(`getLocation: ${this.stackState}`);
        if (this.stackState) {
            const stack = this.stackState.split("\n");
            if (stack.length >= 2) {
                // log(`getLocation: stack[tos]=${stack[stack.length - 1]}`);
                const projectRoot = path.dirname(__dirname);
                // Check for non-anonymous function which means
                // location string is of the form; " at func (file:line:col)"
                let r = /.*? at (.*?) \((.*?):(\d+):(\d+)\)/.exec(`${stack[stack.length - 1]}`);
                let relative;
                if (r && r.length > 4) {
                    relative = path.relative(projectRoot, r[2]);
                    this._file = relative;
                    this._func = r[1];
                    this._line = Number(r[3]);
                    this._col = Number(r[4]);
                }
                else {
                    // Check for anonymous function which means location
                    // string has no func and is of the form; " at file:line:col"
                    r = /.*? at *(.*?):(\d+):(\d+)/.exec(`${stack[stack.length - 1]}`);
                    if (r && r.length > 3) {
                        relative = path.relative(projectRoot, r[1]);
                        this._file = relative;
                        this._func = "";
                        this._line = Number(r[2]);
                        this._col = Number(r[3]);
                    }
                }
            }
        }
        // log(`getLocation: ${location}`);
        return this;
    }
}
exports.TraceLoc = TraceLoc;
//# sourceMappingURL=traceloc.js.map