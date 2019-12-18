var express = require('express')
var router = express.Router()
const fetch = require('node-fetch');

router.post('/', function (req, res, next) {
    const user = {
        username: req.body.username,
        password: req.body.password
    }

    const option = {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(user)
    };

    fetch("http://localhost:5000/login", option)
    .then(response => {
        response.json().then(function(data) {
            if(data.status){
                console.log(data)
                req.session.activeUser = data;
                res.redirect('/chat');
            }else{ 
                req.flash('error', data.error)
                res.redirect('/');
            }
        });
    });
});

module.exports = router;
