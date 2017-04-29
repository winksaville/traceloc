import { here } from "traceloc";

let LOGGING = true;

function log(prompt: string) {
    if (LOGGING) {
        let loc = here(1); // Get the location of the caller
        console.log(`${prompt}: ${loc.func}:${loc.line}`);
    }
}

function sub() {
    log("enter");
    LOGGING = false;
    log("no output expected");
    LOGGING = true;
    console.log("Ready to exit");
    log("exit");
}

sub();
