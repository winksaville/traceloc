import { install } from "source-map-support";
install();

import * as path from "path";

/**
 * The TraceLoc interface it provides the location
 * infomration and a toString function.
 */
export interface ITraceLoc {
    readonly func: string;
    readonly file: string;
    readonly line: number;
    readonly col: number;

    toString(): string;
}

let projectRoot: string | undefined | null;

/**
 * The user may change to expected root of the project
 * and filepaths returned file ITraceLoc.file will be
 * relative to the root parameter. The default if not set
 * (i.e. "", undefined or null) is ".", the current
 * working directory.
 *
 * @param root is the path to the directory containing the project
 *        it may be relative or absolute.
 * @param returns previous value
 */
export function setProjectRoot(root: string | undefined | null): string | undefined | null {
    const prev = projectRoot;
    projectRoot = root;
    return prev;
}

/**
 * Return the ITraceLoc oject.
 *
 * @param callDepth is the stackframe index which to retrieve
 *        the location information. Defaults to 0. A non-zero
 *        value can be used to provide the location for the
 *        n'th entry on stackframe. This is useful if custom
 *        here() is created that calls this here(). See
 *        example/t3.ts.
 * @return ITraceLoc
 */
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

    public getRelativeFileName(prjRoot: string | undefined | null, fileName: string): string {
        let relative: string;

        // If nothing the use __dirname
        if (prjRoot === undefined || prjRoot === null) {
            prjRoot = ".";
        }

        if (prjRoot) {
            relative = path.relative(prjRoot, fileName);
        } else {
            // If no prjRoot return fileName
            relative = fileName;
        }
        return relative;
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

                // Check for non-anonymous function which means
                // location string is of the form; " at func (file:line:col)"
                let r = /.*? at (.*?) \((.*?):(\d+):(\d+)\)/.exec(`${stack[stack.length - 1]}`);
                let relative: string;
                if (r && r.length > 4) {
                    relative = this.getRelativeFileName(projectRoot, r[2]);
                    // log(`len > 4 projectRoot=${projectRoot} r[2]=${r[2]} relative=${relative}`);
                    this._file = relative;
                    this._func = r[1];
                    this._line = Number(r[3]);
                    this._col = Number(r[4]);
                } else {
                    // Check for anonymous function which means location
                    // string has no func and is of the form; " at file:line:col"
                    r = /.*? at *(.*?):(\d+):(\d+)/.exec(`${stack[stack.length - 1]}`);
                    if (r && r.length > 3) {
                        relative = this.getRelativeFileName(projectRoot, r[1]);
                        // log(`len > 3 projectRoot=${projectRoot} r[1]=${r[1]} relative=${relative}`);
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
