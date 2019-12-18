const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');


/* Import database models */ ;
const User = require('../models/user');
const Users = require('../models/users')

/* POST login information and checking if the login is correct. */
router.post('/', function (req, res, next) {
    let enteredUsername = req.body.username.toLowerCase();
    Users.findOne({username: enteredUsername }, async function(err, data) {   
        if(err){
          res.status(500).send();
        }
        else if(data == null) {
            try{
                let hashedPassword = await bcrypt.hash(req.body.password,10);
                req.body.password = hashedPassword;
                let user = new User(req.body);
                user.save(function (err, userObject) {
                    if (err){
                        res.status(500).send();
                    }
                });
                res.status(201).json({ status: true, success: "Account created!" });
            }catch{
                res.status(500).send();
            }
        }
        else{
            res.status(400).json({ status: false, error: "Username is already taken!" });
        }
      });
})



module.exports = router