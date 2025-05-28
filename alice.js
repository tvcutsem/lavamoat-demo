exports.setup = function(log) {
    return function run() {
        console.log('alice: writing to log');
        log.write('message from alice');    
    }
}