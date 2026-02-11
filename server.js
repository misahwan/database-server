const net = require('net'); // I need this for TCP networking
const fs = require('fs');   // I need this to read/write files

// --- 1. MY DATABASE STORE ---
// I'm using a Map because it's faster for key-value lookups than a plain object.
// This is where all my data lives in memory.
const store = new Map();

// --- 2. PERSISTENCE (Load data on startup) ---
// Before the server starts, I check if I have a save file.
// If I do, I load it so I don't lose my data when I restart.
const DB_FILE = 'database.json';

if (fs.existsSync(DB_FILE)) {
    try {
        const data = fs.readFileSync(DB_FILE, 'utf8');
        const json = JSON.parse(data);
        
        // I loop through the file and put everything back into my Map
        for (const key in json) {
            store.set(key, json[key]);
        }
        console.log('✅ I found previous data and loaded it.');
    } catch (err) {
        console.error('❌ Something went wrong loading the data:', err);
    }
}

// --- 3. SERVER LOGIC ---
const server = net.createServer((socket) => {
    console.log('Client connected to my server');

    // This is where I handle incoming messages
    socket.on('data', (data) => {
        // 1. Clean the input (remove messy newlines)
        const command = data.toString().trim();
        
        // 2. Parse the command
        // e.g. "SET name alex" becomes ["SET", "name", "alex"]
        const parts = command.split(' ');
        const action = parts[0].toUpperCase();
        const key = parts[1];
        const value = parts[2];

        // --- COMMAND HANDLERS ---
        if (action === 'SET') {
            if (!key || !value) {
                socket.write('ERROR: I need a key and a value (e.g. SET name alex)\n');
            } else {
                store.set(key, value);
                socket.write('OK\n');
            }

        } else if (action === 'GET') {
            if (!key) {
                socket.write('ERROR: I need a key (e.g. GET name)\n');
            } else {
                const result = store.get(key);
                if (result) {
                    socket.write(result + '\n');
                } else {
                    socket.write('(nil)\n'); // Standard Redis response for "not found"
                }
            }

        } else if (action === 'SAVE') {
            try {
                // I convert my Map -> Object -> JSON String
                const json = JSON.stringify(Object.fromEntries(store));
                
                // I save it to the hard drive so it's safe
                fs.writeFileSync(DB_FILE, json);
                
                socket.write('OK\n');
                console.log('💾 I saved the database to disk.');
            } catch (err) {
                socket.write('ERROR: I could not save the file\n');
                console.error(err);
            }

        } else {
            socket.write('ERROR: I do not know that command\n');
        }
    });

    // Handle when they leave
    socket.on('end', () => {
        console.log('Client disconnected');
    });

    // Handle errors so the server doesn't crash
    socket.on('error', (err) => {
        console.error('Socket error:', err.message);
    });
});

// --- 4. START LISTENING ---
server.listen(6379, () => {
    console.log('🚀 My Database Server is running on port 6379');
});