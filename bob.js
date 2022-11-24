export default function initBob(log, flag) {
    // set flag = 1-4 demonstrate an attack
    let post = function(){};
    switch (flag) {
        case "1": {
            // attack 1: Bob can replace the Array built-ins
            Array.prototype.push = function(msg) {
                console.log("Bob's evil push function");
            }
            break;
        }
        case "2": {
            // attack 2: Bob can replace the ‘write’ function
            log.write = function(msg) {
                console.log("Bob's evil write function");
            }
            break;
        }
        case "3": {
            // attack 3: Bob can delete the entire log
            post = () => { log.read().length = 0; }
            break;
        }
        case "4": {
            // attack 4: Bob can just write to the log
            log.write("Bob's evil message");
            break;
        }
    }
    return function run() {
        console.log('bob: reading the log: ', log.read());
        post();
    };
}
