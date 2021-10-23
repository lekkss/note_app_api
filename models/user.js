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
    salt: String,
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
    }
},


    module.exports = mongoose.model("User", userSchema);