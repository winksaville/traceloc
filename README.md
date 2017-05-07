# Trace the current location in a program [![Build Status](https://travis-ci.org/winksaville/traceloc.svg?branch=master)](https://travis-ci.org/winksaville/traceloc)[![bitHound Overall Score](https://www.bithound.io/github/winksaville/traceloc/badges/score.svg)](https://www.bithound.io/github/winksaville/traceloc)
Allows access to the file, func, line and col while executing

## Prerequisites
- node 
- yarn

## Usage
Note: typescript types, `traceloc.d.ts` are integral so there are no @types/traceloc
```
yarn add traceloc
```

## API
A very simple API there two routines, here(), setProjectRoot()
and an interface, ITraceLoc exported:
```
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
 * @param root is the full path to the directory containing the project
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
```
## Examples:
Before running these examples run `yarn install-self`.

The simplest possible example is something like:
```
$ cat -n examples/t1.ts
     1	import { here } from "traceloc";
     2	console.log(`Hello from ${here()}`);
$ tsc --sourceMap examples/t1.ts
$ node examples/t1.js
Hello from Object.<anonymous> examples/t1.ts:2:27
```
Here using here() in a subroutine and the location variables:
```
$ cat -n examples/t2.ts
     1	import { here } from "traceloc";
     2	
     3	function sub() {
     4	    let loc = here();
     5	    console.log(`sub: func=${loc.func} file=${loc.file} line=${loc.line} col=${loc.col}`);
     6	}
     7	
     8	sub();
$ tsc --sourceMap examples/t2.ts
$ node examples/t2.js
sub: func=sub file=examples/t2.ts line=4 col=15
```
The final example we create our own log subroutine calling `here(1)`. The callDepth
parameter, `1`, requests `here` to get the location of the caller of `log(sring)`:
```
$ cat -n examples/t3.ts
     1	import { here } from "traceloc";
     2	
     3	let LOGGING = true;
     4	
     5	function log(prompt: string) {
     6	    if (LOGGING) {
     7	        let loc = here(1); // Get the location of the caller
     8	        console.log(`${prompt}: ${loc.func}:${loc.line}`);
     9	    }
    10	}
    11	
    12	function sub() {
    13	    log("enter");
    14	    LOGGING = false;
    15	    log("no output expected");
    16	    LOGGING = true;
    17	    console.log("Ready to exit");
    18	    log("exit");
    19	}
    20	
    21	sub();
$ tsc --sourceMap examples/t3.ts
$ node examples/t3.js
enter: sub:13
Ready to exit
exit: sub:18
```
## To Hack on this code

### Clone the repo
git clone https://github.com/winksaville/traceloc

### Install dependencies
```
yarn install
```
### Test
The `test` target also builds.

```
yarn test
```
You can also `build` separately.
```
yarn build
```
There is also `Coverage` which target builds, tests and output coverage data using `nyc`
```
yarn coverage
```
## Benchmark
On my laptop here() runs at about 7,000 ops/sec this
is quite slow, for comparison a routine that increaments
its parameter runs at 80,000,000 ops/sec.

To run the benchmark:
```
yarn benchmark
```
To run and append the results:
```
yarn benchmark:save
```
