exports.createPostValidator = (req, res, next) => {
    //title

    req.check('title', "write a title").notEmpty()
    req.check('title', "Title must be between 4 - 150 character").isLength({
        min: 4,
        max: 150
    });

    //body

    req.check('description', "write a body").notEmpty()
    req.check('description', "Body must be between 4 - 150 character").isLength({
        min: 4,
        max: 2000
    });

    //check for other erors

    const errors = req.validationErrors()

    //if error shows first one as they happens

    if (errors) {
        const firstError = errors.map((error) => error.msg)[0];
        return res.status(400).json({ error: firstError })
    }

    //proceed

    next();

};

exports.userSignUpValidator = (req, res, next) => {
    //name is not null
    req.check("name", "Name is required").notEmpty();

    //email is not null, valid and normalised

    req.check("email", "Email must be between 3 to 32 characters")
        .matches(/.+\@.+\..+/)
        .withMessage("invalid email")
        .isLength({
            min: 4,
            max: 150
        })

    //check for password
    req.check("password", "Password is required").notEmpty()
    req.check("password")
        .isLength({
            min: 6
        })
        .withMessage("Password must be at least 6 characters")
        .matches(/\d/)
        .withMessage("Password must contail at least a number")

    //check confirm password
    req.check("confirmPassword", "ConfirmPassword is required").notEmpty()


    //check other errors
    const errors = req.validationErrors()

    //if error shows first one as they happens

    if (errors) {
        const firstError = errors.map((error) => error.msg)[0];
        return res.status(400).json({ error: firstError })
    }

    //proceed

    next();

}