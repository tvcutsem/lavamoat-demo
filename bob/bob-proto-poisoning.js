// module Bob exploiting prototype poisoning attack
exports.setup = function(log) {
    console.log("bob: staging prototype poisoning attack");
    // Bob replaces the Array built-ins so Alice's log messages are lost
    Array.prototype.push = function(msg) {
        console.log("called Bob's evil push() function");
    }
    return function run() {
        console.log('bob: reading the log: ', log.read());
    };
}