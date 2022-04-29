const fs = require('fs');
const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 80;
const utils = require('./public/assets/js/utils');

const app = express();

const notesDb = "db.json";
const absoluteDBPath = path.join(path.join(__dirname, "db"), notesDb);

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(express.static("public"));

// ----- Requests Handler -----
// GET existing notes on db.json file
app.get('/api/notes', (req, res) => {
    utils.promiseReadFile(absoluteDBPath, "utf8", (error, data) => {
        if(error) {
            console.error(error);
        } else {
            let curNotes = JSON.parse(data);
            res.send(JSON.stringify(curNotes));
        }
    });
});

//Add a new note to db.json
app.post('/api/notes', (req, res) => {
    console.log(req.body);
    const {title, text} = req.body;
    if(title  && text) {
        let addedNote = {
            title,
            text
        }

        utils.generateID(absoluteDBPath, addedNote);

        utils.addNote(absoluteDBPath, addedNote);

        const response = {
            status: "success",
            body: addedNote,
          };

        res.status(200).json(response);
        
    } else {
        console.log("Invalid note submision");
    }
});

// Delete selected note
app.delete('/api/notes/:id', (req, res) => {
    const deletedNoteID = req.params.id;

    utils.removeNote(absoluteDBPath, deletedNoteID);
    res.status(200).send(`Successfully deleted note: ${deletedNoteID}`);
})

// ------------------------


// ----- GET Redirects -----
//Homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

//Notes
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

//Redirect to homepage
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);
// ------------------------


//Run server
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);