const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Define the directory paths
const projectRoot = path.join(__dirname, '..');
const srcDir = path.join(projectRoot, 'src');
const notesDir = path.join(projectRoot, 'notes');

// Serve the static HTML file from the src directory
app.use(express.static(srcDir));

// Serve static files from the notes directory
app.use(express.static(notesDir));

// Serve static files from the notes directory
app.use(express.static(path.join(projectRoot, 'media')));

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

// Endpoint to list files in the notes directory
app.get('/list-files', async (req, res) => {
    try {
        let notesDirFiles = await listFilesInDirectory(notesDir);
        notesDirFiles = notesDirFiles.map(file => path.relative(notesDir, file));
        res.json(notesDirFiles.filter(file => file.endsWith('.html') || file.endsWith('.md') || file.endsWith('.txt')));
    } catch (err) {
        res.status(500).json({ error: 'Unable to list files' });
    }
});

// Serve the index.html file at the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(srcDir, 'index.html'));
});

// Endpoint to serve individual note files
app.get('/notes/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(notesDir, filename);

    fs.access(filePath, fs.constants.R_OK, (err) => {
        if (err) {
            res.status(404).send('File not found');
        } else {
            res.sendFile(filePath);
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
