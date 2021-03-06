const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
uuidv4();
const crypto = require('crypto')


const userSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    email: {
        type: String,
        trim: true,
        require: true,
    },
    hash_password: {
        type: String,
        require: true,
    },
    hash_confirmPassword: {
        type: String,
        require: true
    },
    salt: String,
    saltConfirmPassword: String,
    created: {
        type: Date,
        default: Date.now
    },
    updated: Date
})

//virtual field
userSchema.virtual("password")
    .set(function (password) {
        //create temp variable _password
        this._password = password;

        //generate tmestamp and install uuid
        this.salt = uuidv4()

        //encrypt password
        this.hash_password = this.encryptPassword(password)
    })
    .get(function () {
        return this._password
    })


//Confirm
userSchema.virtual("confirmPassword")
    .set(function (confirmPassword) {
        //create temp variable _password
        this._confirmPassword = confirmPassword;

        //generate tmestamp and install uuid
        this.saltConfirmPassword = uuidv4()

        //encrypt password
        this.hash_confirmPassword = this.encryptConfirmPassword(confirmPassword)
    })
    .get(function () {
        return this._confirmPassword
    })



//methods

userSchema.methods = {
    authenticate: function (plainText) {
        return this.encryptPassword(plainText) === this.hash_password;
    },
    encryptPassword: function (password) {
        if (!password) {
            return ''
        }
        try {
            return crypto.createHmac('sha1', this.salt)
                .update(password)
                .digest('hex')
        }
        catch (err) {
            return ""
        }
    },

    //confirmPassword
    // authenticateConfirm: function (plainT) {
    //     return this.encryptPassword(plainT) === this.hash_confirmPassword;
    // },
    encryptConfirmPassword: function (confirmPassword) {
        if (!confirmPassword) {
            return ''
        }
        try {
            return crypto.createHmac('sha1', this.salt)
                .update(confirmPassword)
                .digest('hex')
        }
        catch (err) {
            return ""
        }
    }
},



    module.exports = mongoose.model("User", userSchema);