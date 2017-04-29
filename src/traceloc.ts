import { install } from "source-map-support";
install();

import * as path from "path";

// import * as debugModule from "debug";
// const log = debugModule("traceloc");

export class TraceLoc {
    /**
     * Return the location of where this routine was called from
     */
    public static here(callDepth = 0): TraceLoc {
        const tm = new TraceMarker();
        return tm.mark(1 + callDepth).getLocation();
    }

    public func: string;
    public file: string;
    public line: number;
    public col: number;

    public constructor() {
        this.file = "";
        this.func = "";
        this.line = -1;
        this.col  = -1;
    }

    /**
     * Return string of the form:
     *  "func file:line:col" if func is anonymous then there will be a leading space
     *  /(.*?) (.*?):(\d*):(\d*)/
     */
    public toString(): string {
        return `${this.func} ${this.file}:${this.line}:${this.col}`;
    }
}

export class TraceMarker {
    private stackState: string | undefined;

    /**
     * Mark the "current" location.
     *
     * @param callDepth is the call nesting if used directly no
     *        value is necessary and the default is 0. But if you
     *        use TraceMarker.mark in a subroutine and you want to
     *        mark where that subroutine was called from you need
     *        callDepth = 1 or the approprate value.
     */
    public mark(callDepth: number = 0): TraceMarker {
        const saveStackTraceLimit = Error.stackTraceLimit;
        Error.stackTraceLimit = callDepth + 1;
        const err = new Error();
        Error.captureStackTrace(err, this.mark);
        Error.stackTraceLimit = saveStackTraceLimit;
        this.stackState = err.stack;
        // log(`${this.stackState}`);
        return this;
    }

    /**
     * Return the TraceLoc
     *
     */
    public getLocation(): TraceLoc {
        // log(`getLocation: ${this.stackState}`);
        const location = new TraceLoc();
        if (this.stackState) {
            const stack = this.stackState.split("\n");
            if (stack.length >= 2) {
                // log(`getLocation: stack[tos]=${stack[stack.length - 1]}`);
                const projectRoot = path.dirname(__dirname);

                // Check for non-anonymous function which means
                // location string is of the form; " at func (file:line:col)"
                let r = /.*? at (.*?) \((.*?):(\d+):(\d+)\)/.exec(`${stack[stack.length - 1]}`);
                let relative: string;
                if (r && r.length > 4) {
                    relative = path.relative(projectRoot, r[2]);
                    location.file = relative;
                    location.func = r[1];
                    location.line = Number(r[3]);
                    location.col = Number(r[4]);
                } else {
                    // Check for anonymous function which means location
                    // string has no func and is of the form; " at file:line:col"
                    r = /.*? at *(.*?):(\d+):(\d+)/.exec(`${stack[stack.length - 1]}`);
                    if (r && r.length > 3) {
                        relative = path.relative(projectRoot, r[1]);
                        location.file = relative;
                        location.func = "";
                        location.line = Number(r[2]);
                        location.col = Number(r[3]);
                    }
                }
            }
        }
        // log(`getLocation: ${location}`);
        return location;
    }
}
