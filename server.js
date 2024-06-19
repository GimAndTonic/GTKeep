const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Serve the static HTML file
app.use(express.static(path.join(__dirname)));

// Function to list files in a directory
function listFilesInDirectory(directory) {
    return new Promise((resolve, reject) => {
        fs.readdir(directory, (err, files) => {
            if (err) {
                reject(err);
            } else {
                resolve(files.map(file => path.join(directory, file)));
            }
        });
    });
}

// Endpoint to list files in the current directory and the notes directory
app.get('/list-files', async (req, res) => {
    try {
        // Load samples
        // samplesDirFiles = await listFilesInDirectory(path.join(__dirname, 'samples'));
        // samplesDirFiles = samplesDirFiles.map(file => path.relative(__dirname, file));

        // Load files from notes
        const path_notes = path.join(__dirname, 'notes')
        notesDirFiles = await listFilesInDirectory(path_notes)
        notesDirFiles = notesDirFiles.map(file => path.relative(path_notes, file));
        //notesDirFiles = notesDirFiles.map(file => path.parse(file).name); // Disable .md filter if used
        

        // Join lists
        const allFiles = notesDirFiles;
        res.json(allFiles.filter(file => file.endsWith('.html') || file.endsWith('.md') || file.endsWith('.txt')));
    } catch (err) {
        res.status(500).json({ error: 'Unable to list files' });
    }
});

// Serve the index.html file at the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

