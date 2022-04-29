const fs = require('fs');
const { v4: uuidv4 } =  require('uuid');
const util = require('util');

const promiseReadFile = util.promisify(fs.readFile);

const overwriteData = (path, note) => fs.writeFile(path, JSON.stringify(note, null, 4), (error) => error ? console.error("Error: ", error) : console.log(`Successfully added ${note} to ${path}`));

const addNote = (path, note) => {
    promiseReadFile(path, "utf8", (error, data) => {
        if (error) {
            console.error("Error: ", error)
        } else {
            let fileContent = JSON.parse(data);
            fileContent.push(note);
            overwriteData(path, fileContent);
        }
    });
}

const generateID = (path, note) => {
    promiseReadFile(path, "utf8", (error, data) => {
        if (error) {
            console.error("Error: ", error)
        } else {
            let fileContent = JSON.parse(data);
            let tempUUID = uuidv4(); 
            note.id = tempUUID;
        }
    });
}

const removeNote = (path, noteID) => {
    promiseReadFile(path, "utf8", (error, data) => {
        if (error) {
            console.error("Error: ", error)
        } else {
            let fileContent = JSON.parse(data);
            for(let i = 0; i < fileContent.length; i++) {
                if(fileContent[i].id == noteID){
                    console.log(`Removed note: ${fileContent[i]}`);
                    fileContent.splice(i, 1);
                } 
            }
            overwriteData(path, fileContent);
        }
    });
}

module.exports = {
    addNote,
    generateID,
    promiseReadFile,
    removeNote
};