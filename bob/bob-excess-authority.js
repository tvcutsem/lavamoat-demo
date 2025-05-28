// module Bob exploiting excess authority
exports.setup = function(log) {
    return function run() {
        // Bob can just write to the log
        console.log("bob: exploiting excess write authority");
        log.write("evil message from bob");
    };
}