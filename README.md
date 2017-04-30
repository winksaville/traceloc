# Trace the current location in a program [![Build Status](https://travis-ci.org/winksaville/traceloc.svg?branch=master)](https://travis-ci.org/winksaville/traceloc)
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
A very simple API there one routine, here(), and an
interface, ITraceLoc, are exported:
```
interface ITraceLoc {
    readonly func: string;
    readonly file: string;
    readonly line: number;
    readonly col: number;

    toString(): string;
}

export here(callDepth=0): ITraceLoc;
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
