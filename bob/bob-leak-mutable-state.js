// module Bob exploiting leaked mutable state
exports.setup = function(log) {
    return function run() {
        const messages = log.read();
        console.log('bob: reading the log: ', messages);
        // Bob can delete the entire log after reading it:
        console.log("bob: corrupting leaked mutable state - deleting messages");
        messages.length = 0;
    };
}