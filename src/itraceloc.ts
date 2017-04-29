export interface ITraceLoc {
    readonly func: string;
    readonly file: string;
    readonly line: number;
    readonly col: number;

    toString(): string;
}
