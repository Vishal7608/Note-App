const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    title:{
        type: String,
        require: true
    },
    content:{
        type: String,
        require: true
    },
    isPublic:{
        type: Boolean,
        default: false
    },
    ower:{
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
}, {timestamps: true});

module.exports = mongoose.model("Note", noteSchema);