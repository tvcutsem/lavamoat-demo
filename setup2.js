import initAlice from "./alice.js";
import initBob from "./bob.js";

const args = process.argv.slice(2);
const flag = args[0] || "";

// as an alternative to using lavamoat, we can use 'ses' sandboxes directly:
// run `npm i ses`, then:
// import 'ses';
// lockdown();

function makeLog() {
  const messages = [];
  function write(msg) { messages.push(msg); }
  function read() { return [...messages]; }
  function size() { return messages.length(); }
  return harden({
    reader: {read, size},
    writer: {write, size}
  });
}

const log = makeLog();

const alice = initAlice(log.writer);
const bob = initBob(log.reader, flag);

alice();
bob();

console.log('log contents: ', log.reader.read());