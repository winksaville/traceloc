export interface ITraceLoc {
    readonly func: string;
    readonly file: string;
    readonly line: number;
    readonly col: number;
    toString(): string;
}
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
    /**
     * Update the location info
     *
     */
    private updateLocation();
}
