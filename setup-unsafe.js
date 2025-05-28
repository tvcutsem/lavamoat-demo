// in this setup alice and bob run in the same JS environment
// alice is prone to bob's attacks

const args = process.argv.slice(2);
const attack = args[0] || "";

const alice = require('./alice.js');
const bob = require('./bob-maker.js')(attack);

class Log {
  constructor() {
    this.messages_ = [];
  }
  write(msg) { this.messages_.push(msg); }
  read() { return this.messages_; }
}

let log = new Log();
const runAlice = alice.setup(log);
const runBob = bob.setup(log);

runAlice();
runBob();

console.log('log contents: ', log.read());