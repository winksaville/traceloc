import { install } from "source-map-support";
install();

import * as path from "path";

export interface ITraceLoc {
    readonly func: string;
    readonly file: string;
    readonly line: number;
    readonly col: number;

    toString(): string;
}

export function here(callDepth = 0): ITraceLoc {
    return new TraceLoc(callDepth + 1);
}

export class TraceLoc implements ITraceLoc {
    private stackState: string | undefined;

    private _func: string = "";
    private _file: string = "";
    private _line: number = -1;
    private _col: number = -1;

    public get func(): string {
        if (!this._func) {
            this.updateLocation();
        }
        return this._func;
    }
    public get file(): string {
        if (!this._file) {
            this.updateLocation();
        }
        return this._file;
    }
    public get line(): number {
        if (this._line < 0) {
            this.updateLocation();
        }

        return this._line;
    }
    public get col(): number {
        if (this._col < 0) {
            this.updateLocation();
        }

        return this._col;
    }

    /**
     * Mark the "current" location.
     *
     * @param callDepth is the call nesting if used directly no
     *        value is necessary and the default is 0. But if you
     *        use TraceMarker.mark in a subroutine and you want to
     *        mark where that subroutine was called from you need
     *        callDepth = 1 or the approprate value.
     */
    public constructor(callDepth: number = 0) {
        const saveStackTraceLimit = Error.stackTraceLimit;
        Error.stackTraceLimit = callDepth + 1;
        const err = new Error();
        Error.captureStackTrace(err, this.constructor);
        Error.stackTraceLimit = saveStackTraceLimit;
        this.stackState = err.stack;
        // log(`${this.stackState}`);
        return this;
    }

    public toString(): string {
        return `${this.func} ${this.file}:${this.line}:${this.col}`;
    }

    /**
     * Update the location info
     *
     */
    private updateLocation() {
        // log(`getLocation: ${this.stackState}`);
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
                    this._file = relative;
                    this._func = r[1];
                    this._line = Number(r[3]);
                    this._col = Number(r[4]);
                } else {
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
