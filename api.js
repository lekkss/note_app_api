const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const expressValidator = require('express-validator')
require('dotenv').config();
const fs = require('fs')
const cookiePerser = require('cookie-parser')
const cors = require("cors")
const app = express();

 




// BodyParser Middleware
app.use(bodyParser.json())
app.use(cookiePerser())
app.use(morgan('dev'))
app.use(expressValidator())

app.use(cors())
//DB config
//const db = require('./config/keys').mongoURI;

//connect to mongo db
//console.log(process.env.MONGO_URI)
mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true })
    .then(() => console.log('mongoDB connected'))
    .catch(err => console.log(err));

//routes
const notes = require('./routes/notes');
const user = require('./routes/user');
const auth = require('./routes/auth');



// use Routes
app.use('/', notes);
app.use('/', user);
app.use('/', auth);

//apiDocs
app.get("/", (req, res) => {
    fs.readFile('docs/apiDocs.json', (err, data) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        }
        const docs = JSON.parse(data)
        res.json(docs)
    }
    )
})


app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({
            error: "Unauthorised"
        });
    }
});

const port = process.env.PORT || 5000

app.listen(port, () => console.log(`server started on port ${port}`));