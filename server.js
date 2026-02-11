const net = require('net');
const fs = require('fs'); // <--- NEW: File System module (The Robot's Printer)

// The "Brain" - In-memory key-value store
const store = new Map();

const server = net.createServer((socket) => {
    console.log('Client connected');

    // "Event Loop": The robot waits for data.
    socket.on('data', (data) => {
        
        // 1. Clean the input (remove spaces/newlines)
        const command = data.toString().trim();
        
        // 2. Parse: "SET name alex" -> ["SET", "name", "alex"]
        // The robot interprets the command and breaks it into parts
        const parts = command.split(' ');
        const action = parts[0].toUpperCase();
        const key = parts[1];
        const value = parts[2];

        // 3. Logic: Execute command based on action
        if (action === 'SET') {
            store.set(key, value);
            socket.write('OK\n');
            
        } else if (action === 'GET') {
            const result = store.get(key);
            if (result) {
                socket.write(result + '\n');
            } else {
                socket.write('(nil)\n');
            }
            
        } else if (action === 'SAVE') { // <--- NEW COMMAND
            try {
                // Step A: Convert the Map (Brain) into a text string
                const json = JSON.stringify(Object.fromEntries(store));
                
                // Step B: Write that string to a real file on the hard drive
                fs.writeFileSync('database.json', json);
                
                socket.write('OK\n');
                console.log('Database saved to disk.');
            } catch (err) {
                socket.write('ERROR: Could not save\n');
                console.error(err);
            }
            
        } else {
            socket.write('ERROR: Unknown Command\n');
        }
    });
    
    // If the client disconnects, log it so we know they left
    socket.on('end', () => {
        console.log('Client disconnected');
    });
});

server.listen(6379, () => {
    console.log('Database Server listening on port 6379');
});