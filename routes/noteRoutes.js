const express = require('express');
// const app = express();
require('dotenv').config();
const router = express.Router();
const Note = require('../Models/note');
const authMiddleware = require('../middleware/authMiddleware');

//Create note..
 router.post('/notes/create', authMiddleware, async (req, res)=>{ 
    try { 
        const {title, content,isPublic} = req.body;
        // console.log(req.body);

        const newNote = new Note({title, content,isPublic, owner:req.body});
        await newNote.save();

        return res.status(201).json({newNote, message: 'Note Created..'});

    } catch (error) {
        res.status(500).json({error: error.message});
        
    }
 });

 //Get all Public Notes..

 router.get('/notes/public', async (req, res)=>{
    try {

        const notes = await Note.find({isPublic: false});

        res.json({notes});

    } catch (error) {
        res.status(500).json({error: error.message});
    }
 });

//Update the note..

router.put('/notes', authMiddleware , async ( req, res)=>{
    try {
        
        const note = await Note.findById(req.body.id);

        if (!note) {
            return res.status(404).send({ message: "Note not found" });
        }
  

        // Update the note fields. You can pass the new data from req.body
        const updatedNote = await Note.findByIdAndUpdate(
            req.body.id, 
            {
                title: req.body.title, 
                content: req.body.content,
                // Add more fields as needed
            },  
        );

        res.status(200).send({ message: "Note updated successfully", updatedNote });



        note.title = req.body.title;
        note.content = req.body.content;
        note.isPublic = req.body.isPublic;

        await note.save();

        res.json(note,{message: 'Note Updated.'});

    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

//Delete..

router.delete('/notes', authMiddleware, async (req,res)=>{
    try {
        const note = await Note.findById(req.body.id);
 
        if(!note){
            return res.json({message: "Note not found."});
        }

        await Note.findByIdAndDelete(req.body.id);
        res.json({message: 'Note deleted Successfully.'});
 
        
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

module.exports = router;