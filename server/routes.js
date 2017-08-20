const express = require('express');
const User = require('./models/user');
const passwordHash = require("password-hash");
const authHelpers = require('./auth-helpers');

const router = express.Router();

router.post('/register', (req, res, next) => {
    const name = req.body.name;
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({username: username}, (err, user) => {
        if(user) { 
            return res.send({"error": "User already exists."});
        }

        const hashedPassword = passwordHash.generate(password);

        const newUser = new User({
            name: name,
            email: email,
            username: username,
            password: hashedPassword
        });

        const newUserPromise = newUser.save();

        return newUserPromise.then((user) => {
            return authHelpers.createToken(user);
        }).then((token) => {
            res.status(200).json({
                status: 'success',
                token: token
            });
        }).catch(err => {
            res.status(500).json({
                status: 'error'
            });
        });
    });
});

router.post('/login', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({username: username}, (err, user) => {
        const isMatch = passwordHash.verify(password, user.password);
        if(isMatch) {
            return res.status(200).json({
                status: 'success',
                token: authHelpers.createToken(user)
            });
        } else {
            return res.status(500).json({
                status: 'error'
            });
        }        
    });
});

router.get('/authenticated', authHelpers.ensureAuthenticated);

module.exports = router;