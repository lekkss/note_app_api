
const Note = require("../models/note");

const _ = require('lodash');


exports.getNotes = (req, res) => {
    const notes = Note.find()
        .populate("postedBy", "_id, name")
        .select("_id title description")
        .sort({ date: -1 })
        .then(notes => { res.status(200).json(notes) })
        .catch(err => console.log(err));
}

exports.noteById = (req, res, next, id) => {
    Note.findById(id)
        .populate("postedBy", "_id, name")
        .exec((err, note) => {
            if (err || !note) {
                return res.status(400).json({
                    error: err
                })
            }
            req.note = note
            next();
        })
}

exports.noteByUserId = (req, res) => {
    Note.find({ postedBy: req.profile._id })
        //.populate("postedBy")
        .sort("_created")
        .exec((err, notes) => {
            if (err) {
                return res.status(400).json({
                    error: err
                })
            }
            res.json(notes)
        })
}


exports.createNote = async (req, res) => {
    const newNote = new Note({
        title: req.body.title,
        description: req.body.description,
        postedBy: req.profile._id

    })
    try {
        const note = await newNote.save()
        res.status(201).json(note)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }

    // newNote.save()
    //     .then(note => res.json(note));
}


exports.isPoster = (req, res, next) => {
    let isPoster = req.note && req.auth && req.note.postedBy._id == req.auth._id


    if (!isPoster) {
        return res.status(403).json({
            error: "user is not authorised"
        })
    }
    next();
}

exports.updateNote = (req, res, next) => {
    let post = req.post
    post = _.extend(post, req.body)
    post.update = Date.now()
    post.save((err, post) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        }
        res.json(post)
    })
}


exports.deleteNote = (req, res) => {
    let note = req.note
    note.remove((err, note) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        }
        res.json({
            message: 'deleted successfully'
        })
    })
}

