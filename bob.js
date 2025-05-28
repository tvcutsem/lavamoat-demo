export default function initBob(log, attack) {
    // set attack to demonstrate a specific attack vector
    let post = function(){};
    console.log("bob: staging attack: ", attack);
    switch (attack) {
        case "proto-poisoning": {
            // attack 1: Bob can replace the Array built-ins
            Array.prototype.push = function(msg) {
                console.log("called Bob's evil push() function");
            }
            break;
        }
        case "api-poisoning": {
            // attack 2: Bob can replace the ‘write’ function
            log.write = function(msg) {
                console.log("called Bob's evil write() function");
            }
            break;
        }
        case "leak-mutable-state": {
            // attack 3: Bob can delete the entire log
            post = () => { log.read().length = 0; }
            break;
        }
        case "excess-authority": {
            // attack 4: Bob can just write to the log
            log.write("evil message from bob");
            break;
        }
    }
    return function run() {
        console.log('bob: reading the log: ', log.read());
        post();
    };
}
