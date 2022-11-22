import alice from "./alice.js";
import bob from "./bob.js";
import assert from 'node:assert';

class Log {
  constructor() {
    this.messages_ = [];
  }
  write(msg) { this.messages_.push(msg); }
  read() { return this.messages_; }
}

let log = new Log();


alice(log);
bob(log);

log.write('host');

assert.deepEqual(log.read(), ['alice', 'host']);

console.log('done');
