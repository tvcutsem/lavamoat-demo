// module Bob exploiting api poisoning attack
exports.setup = function(log) {
    console.log("bob: staging api poisoning attack");
    // attack 2: Bob can replace the ‘write’ function on the log object:
    log.write = function(msg) {
        console.log("called Bob's evil write() function");
    }
    return function run() {
        console.log('bob: reading the log: ', log.read());
    };
}