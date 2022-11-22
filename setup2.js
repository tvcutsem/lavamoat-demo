import alice from "./alice.js";
import bob from "./bob.js";
import assert from 'node:assert';

// as an alternative to using lavamoat, we can use 'ses' sandboxes directly:
// run `npm i ses`, then:
// import 'ses';
// lockdown();

function makeLog() {
  let messages = [];
  function write(msg) {
    messages.push(msg);
  }
  function read() {
    return [...messages];
  }
  return harden({read, write});
}

let log = makeLog();

alice(harden({write: log.write}));
bob(harden({read: log.read}));

log.write('host');

assert.deepEqual(log.read(), ['alice', 'host']);