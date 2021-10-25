const User = require("../models/user")
const jwt = require('jsonwebtoken')
const expressJwt = require("express-jwt")
require('dotenv').config()

exports.signup = async (req, res) => {
    const userExists = await User
        .findOne({ email: req.body.email })
    if (userExists) {
        return res.status(403).json({
            error: "Email is Taken"
        })
    }
    // const confirmPassword = await User.findOne({
    //     confirmPassword: req.body.confirmPassword
    // })
    // if (confirmPassword !== req.body.password) {
    //     returnres.status(403).json({
    //         error: "password do not match"
    //     })
    // }

    const user = await new User(req.body);
    await user.save()
    res.status(200).json({
        message: "Signup succesful, login"
    })
}

exports.signin = (req, res) => {

    //find the user based on email
    const { email, password } = req.body
    User.findOne({ email }, (err, user) => {
        //if error or no user
        if (err || !user) {
            return res.status(404).json({
                error: "user with that email does not exist, try again"
            })
        }

        //if user is found, make sure email and password match
        //authenticate method in model and use here
        if (!user.authenticate(password)) {
            res.status(404).json({
                error: "Email and password do not match"
            })
        }

        //generate token with user id
        const token = jwt.sign({ _id: user._id }, process.env.SALT_SECRET);

        //persist token as "t" in cookies with expiry date
        res.cookie('t', token, { expire: new Date() + 999 });

        //return response with user and token to front end client
        const { _id, name, email } = user;
        return res.json({ token, user: { _id, name, email } })
    })
};

exports.signout = (req, res) => {
    //clear cookies
    res.clearCookie("t")
    res.json({
        message: "singout successful"
    })
}

exports.requireSignin = expressJwt({
    //if token is valid, express jwt appends the verified user id
    //in the auth key to the request object
    secret: process.env.SALT_SECRET,
    userProperty: "auth",
    algorithms: ['HS256']
})