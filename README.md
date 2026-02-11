A Simple and Fast Key-Value Database Server CLI Application This application offers a lightweight solution for storing and retrieving data via a custom TCP protocol.

Key Features SET Command: Securely store data using a key value pairing system. GET Command: Instantly retrieve stored values by their unique keys. Persistence: A custom SAVE feature that snapshots memory to a local JSON file. Auto Load: The server automatically restores its previous state on startup. Stability: Includes a built in automated test suite to verify system health.

Tech Stack Runtime: Node.js.
Protocol: TCP Transmission Control Protocol.
Storage: In memory JavaScript Map and JSON Disk Storage.
Libraries: Net Networking, FS File System, Readline CLI Interaction.

Thanks for taking a look!

Setup Instructions

Clone the Repository Download the project files to your local machine.

Start the Server Before connecting clients, initialize the brain by running: node server.js

Run the Client Open a separate terminal and run: node client.js

Optional: Run System Tests To verify the logic is 100 percent correct, ensure the server is running and execute: node test.js
