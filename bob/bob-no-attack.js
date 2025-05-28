// module Bob with no attack vector (benign)
exports.setup = function(log) {
    console.log("bob: no attack");
    return function run() {
        console.log('bob: reading the log: ', log.read());
    };
}