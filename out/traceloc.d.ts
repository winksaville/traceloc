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
export declare function setProjectRoot(root: string | undefined | null): string | undefined | null;
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
export declare function here(callDepth?: number): ITraceLoc;
export declare class TraceLoc implements ITraceLoc {
    private stackState;
    private _func;
    private _file;
    private _line;
    private _col;
    readonly func: string;
    readonly file: string;
    readonly line: number;
    readonly col: number;
    /**
     * Mark the "current" location.
     *
     * @param callDepth is the call nesting if used directly no
     *        value is necessary and the default is 0. But if you
     *        use TraceMarker.mark in a subroutine and you want to
     *        mark where that subroutine was called from you need
     *        callDepth = 1 or the approprate value.
     */
    constructor(callDepth?: number);
    toString(): string;
    getRelativeFileName(prjRoot: string | undefined | null, fileName: string): string;
    /**
     * Update the location info
     *
     */
    private updateLocation();
}
