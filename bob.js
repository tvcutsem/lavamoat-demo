function attack1(log) {
    // attack 1: Bob can replace the Array built-ins
    Array.prototype.push = function(msg) {
        console.log("Bob's evil push function");
    }
}

function attack2(log) {
    // attack 2: Bob can replace the ‘write’ function
    log.write = function(msg) {
        console.log("Bob's evil write function");
    }
}

function attack3(log) {
    // attack 3: Bob can delete the entire log
    log.read().length = 0;
    console.log('log after bobs attack:', log.read());
}

function attack4(log) {
    // attack 4: Bob can just write to the log
    log.write("Bob's evil message");
    console.log('log after bobs write:', log.read());
}

export default function bob(log) {
    console.log('bob: reading the log: ', log.read());
    // uncomment one of the below lines to demonstrate an attack
    // attack1(log);
    // attack2(log);
    // attack3(log);
    // attack4(log);
}
