import initAlice from "./alice.js";
import initBob from "./bob.js";

const args = process.argv.slice(2);
const flag = args[0] || "";

class Log {
  constructor() {
    this.messages_ = [];
  }
  write(msg) { this.messages_.push(msg); }
  read() { return this.messages_; }
}

let log = new Log();

const alice = initAlice(log);
const bob = initBob(log, flag);

alice();
bob();

console.log('log contents: ', log.read());