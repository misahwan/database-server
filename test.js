const net = require('net');

const client = new net.Socket();

// The commands we want to test
const tests = [
    { command: 'SET test_key 12345', expected: 'OK' },
    { command: 'GET test_key',       expected: '12345' },
    { command: 'SAVE',               expected: 'OK' }
];

let currentTest = 0;

function runNextTest() {
    if (currentTest >= tests.length) {
        console.log('\n✅ ALL SYSTEMS GO! The database is working perfectly.');
        client.end();
        return;
    }

    const test = tests[currentTest];
    console.log(`\n🔹 Running Test #${currentTest + 1}: "${test.command}"`);
    client.write(test.command);
}

client.connect(6379, '127.0.0.1', () => {
    console.log('🔌 Connected to Server for Testing...');
    runNextTest();
});

client.on('data', (data) => {
    const response = data.toString().trim();
    const test = tests[currentTest];

    if (response === test.expected) {
        console.log(`   ✅ PASS: Expected "${test.expected}", Got "${response}"`);
    } else {
        console.log(`   ❌ FAIL: Expected "${test.expected}", but Got "${response}"`);
        process.exit(1); // Stop the test if something fails
    }

    currentTest++;
    runNextTest();
});

client.on('close', () => {
    console.log('Connection closed.');
});