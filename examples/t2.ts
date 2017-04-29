import { here } from "traceloc";

function sub() {
    let loc = here();
    console.log(`sub: func=${loc.func} file=${loc.file} line=${loc.line} col=${loc.col}`);
}

sub();
