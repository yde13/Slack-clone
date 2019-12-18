var express = require('express')
var router = express.Router()
const fetch = require('node-fetch');

/* Getting our register client route */ 
router.post('/', function (req, res, next) {
    const user = {
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    }

    const option = {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(user) 

    };
    fetch("http://localhost:5000/register", option)
    .then(response => {
        response.json().then(function(data) {
            if(data.status){
                req.flash("success",data.success);
                res.redirect('/');
            }else{
                req.flash("error",data.error);
                res.redirect('/');
            }
        });
    });
});

module.exports = router;