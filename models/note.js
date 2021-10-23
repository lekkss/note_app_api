const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

//Create Schema
const noteSchema = new Schema({
    title: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 150
    },

    description: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 2000
    },

    date: {
        type: Date,
        default: Date.now
    },

    postedBy: {
        type: ObjectId,
        ref: 'user'
    },
    created: {
        type: Date,
        default: Date.now
    },

});

module.exports = mongoose.model("Note", noteSchema)