const net = require('net');
const readline = require('readline');

// Create the connection to your server
const client = new net.Socket();

// Setup the tool to read what you type
const rl = readline.createInterface({ 
    input: process.stdin, 
    output: process.stdout 
});

client.connect(6379, '127.0.0.1', () => {
    console.log('✅ Connected to Database! Type a command (e.g., SET name alex)');
    
    // When you type a line and hit Enter, send it to the server
    rl.on('line', (input) => {
        client.write(input);
    });
});

// When the server replies, show it on the screen
client.on('data', (data) => {
    console.log('🤖 Server says:', data.toString().trim());
});

client.on('close', () => {
    console.log('Connection closed');
    process.exit(0);
});