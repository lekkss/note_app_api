const express = require('express')
const { signup, signin, signout } = require("../controllers/auth");
const { userById } = require("../controllers/user");
const { userSignUpValidator } = require('../validator/index')

const router = express.Router()


router.post("/signup", userSignUpValidator, signup);
router.post("/signin", signin);
router.get("/signout", signout);

//any routh containind userId, app will first execute userById
router.param("userId", userById);

module.exports = router;
