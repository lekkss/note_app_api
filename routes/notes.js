const express = require('express');
const router = express.Router();
const { getNotes, createNote, deleteNote, noteByUserId, noteById, isPoster } = require('../controllers/note');
const { userById } = require("../controllers/user");
const { createPostValidator } = require('../validator/index')
const { requireSignin } = require("../controllers/auth");


router.get('/notes', getNotes)
router.post("/note/new/:userId", requireSignin, createNote, createPostValidator);

router.get("/note/by/:userId", requireSignin, noteByUserId)
router.delete("/note/:noteId", requireSignin, isPoster, deleteNote)

//router.put("/note/:noteId", requireSignin, isPoster, updatePost)

//any routh containind userId, app will first execute userById()
router.param("userId", userById);

//any routh containind noteId, app will first execute postById()
router.param("noteId", noteById);

module.exports = router;