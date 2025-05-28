// in this setup alice and bob run in separate compartments thanks to lavamoat
// also, alice properly hardens the log object and attenuates bob's authority
// alice is no longer prone to bob's attacks

// as an alternative to using lavamoat, we can use 'ses' sandboxes directly:
// run `npm i ses`, then:
// import 'ses';
// lockdown();

const args = process.argv.slice(2);
const attack = args[0] || "";

const alice = require('./alice.js');
const bob = require('./bob-maker.js')(attack);

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
let log = makeLog();
const runAlice = alice.setup(log.writer);
const runBob = bob.setup(log.reader);

runAlice();
runBob();

console.log('log contents: ', log.reader.read());