const express = require ('express');
const fs = require ('fs');
const util = require ('util');
const uuid = require("./helpers/uuid")
const path = require('path');
const { readFromFile, writeToFile, readAndAppend } = require('./helpers/fsUtils');
// Added process.env.port for Heroku deployment
const PORT = process.env.PORT || 3001;
const app = express();
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
// GET route for index HTML homepage.
app.get('/', (req, res) => 
    res.sendFile(path.join(__dirname, '/public/index.html'))
);
// GET route for notes HTML page.
app.get('/notes', (req, res) => 
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);
// GET route to retrieve all notes.
app.get('/api/notes', (req, res) => {
    console.info(`${req.method} request received.`);
    // Using Read From File helper function to display all notes from the database.
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
  });
// POST route to make a new note.
app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received.`); 
    const { title, text } = req.body; 
    if (req.body) {
      const newNote = {
        title,
        text,
        id: uuid(),
      };
      // Using Read & Append helper function to display and add new note to the database.
      readAndAppend(newNote, './db/db.json');
      res.json(`Note added successfully!`);
    } else {
      res.error('Error in adding note.');
    }
  });
// BONUS: Delete request!
// DELETE ROUTE function for deleting notes.
app.delete(`/api/notes/:id`, (req, res) => {
  // Make a DELETE request, log a message.
  console.info(`${req.method} request received.`);
  // Console log and make a variable for note object id property.
  // console.log("req params", req.params.id)
  const { id } = req.params.id;
  // READ entire note object data and turn it into JSON format.
  readFromFile('./db/db.json').then((notesData) => {
      let data = JSON.parse(notesData);
      // This function filters through all the notes and collects everything except the note that has an ID assosiated with delete request.
      data = data.filter(({ id }) => id !== req.params.id);
      // Now we take all the notes, except the one we just excluded, and we write them all back into our dabase.
      writeToFile('./db/db.json', data);
      res.json(`Note deleted successfully!`);
    });
  });
// This function is used to bind and listen the connections on the specified host and port.
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);