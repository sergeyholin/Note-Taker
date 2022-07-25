const express = require ('express');
const fs = require ('fs');
const util = require ('util');
const uuid = require("./helpers/uuid")

const path = require('path');
const { readFromFile, writeToFile, readAndAppend } = require('./helpers/fsUtils');

const PORT = 3001;
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
// -------------------------------------------------------------
// Get route for homepage
app.get('/', (req, res) => 
    res.sendFile(path.join(__dirname, '/public/index.html'))
);
// Get route for notes page
app.get('/notes', (req, res) => 
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);
// ----------------------------------
// Get route for retrieving all notes
app.get('/api/notes', (req, res) => {
    console.info(`${req.method} request received`);
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
  });
// POST route for new note
app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received`);
  
    const { title, text } = req.body;
  
    if (req.body) {
      const newNote = {
        title,
        text,
        id: uuid(),

      };
  
      readAndAppend(newNote, './db/db.json');
      res.json(`Note added successfully 🚀`);
    } else {
      res.error('Error in adding note');
    }
  });
  // Delete route
  app.delete(`/api/notes/:id`, (req, res) => {
    console.info(`${req.method} request received`);
    // res.send("DELETE Request Called")
      readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
      console.log(data)
  });
  
//   -----------------------------
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);