var express = require('express')
var router = express.Router()
const bcrypt = require('bcrypt');

/* Import database models */ ;
const Users = require('../models/users')

/* POST login information and checking if the login is correct. */
router.post('/', function (req, res, next) {
  let image;
  let enteredUsername = req.body.username.toLowerCase();
  let enteredPassword = req.body.password.toLowerCase();
  Users.findOne({username: enteredUsername}, async function(err, data) {  
    try{ 
        if(err || data == null){
          res.status(400).json({status: false, error: "Username don't exist."})
        }
        else if(await bcrypt.compare(enteredPassword,data.password)){
          console.log(data.username);
          res.status(200).json({ status: true, error: "Successful login", username: data.username, id: data._id, image: data.image});
        }else{
          res.status(400).json({ status: false, error: "Wrong password"});
        }
      }catch{
        res.status(500).json({ status: false, error: "ERROR" });
      }
  });
})

module.exports = router