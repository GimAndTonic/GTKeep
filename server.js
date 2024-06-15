const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Serve the static HTML file
app.use(express.static(path.join(__dirname)));

// Endpoint to list files in the current directory
app.get('/list-files', (req, res) => {
    fs.readdir(__dirname, (err, files) => {
        if (err) {
            res.status(500).json({ error: 'Unable to list files' });
        } else {
            res.json(files.filter(file => file.endsWith('.html') || file.endsWith('.md')));
        }
    });
});

// Serve the index.html file at the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

