export default function initAlice(log) {
    return function run() {
        console.log('alice: writing to log');
        log.write('alice');    
    }
}