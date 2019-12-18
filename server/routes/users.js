const express = require('express');
const router = express.Router();

/* Import database models */ ;
const Users = require('../models/users')

/* POST all users information */
router.get('/', function (req, res, next) {
    Users.find({},'username',function(err, data) {   
        if(err){
          res.status(500).send();
        }
        res.send(data);
    }).sort( { username: 1 } );;
})



module.exports = router