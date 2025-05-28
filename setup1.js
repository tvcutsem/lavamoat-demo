// in this setup alice and bob run in the same JS environment
// alice is prone to bob's attacks

import initAlice from "./alice.js";
import initBob from "./bob.js";

const args = process.argv.slice(2);
const attack = args[0] || "no-attack";

class Log {
  constructor() {
    this.messages_ = [];
  }
  write(msg) { this.messages_.push(msg); }
  read() { return this.messages_; }
}

let log = new Log();

const alice = initAlice(log);
const bob = initBob(log, attack);

alice();
bob();

console.log('log contents: ', log.read());