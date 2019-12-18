const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fetch = require('node-fetch');



router.get('/profile', function(req, res, next) {
    if(req.session.activeUser == undefined){
        res.redirect('/')
    }else{
        const profile = {
            id: req.session.activeUser.id
        }
        
        const option = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(profile)
        };
        fetch("http://localhost:5000/api/profiles", option)
                .then(r =>  r.json().then(data => ({status: r.status, body: data})))
                .then(function(data){
                    renderData(data);
                });
        function renderData(data){
            res.render('profile', {defaultPicture: data.body.image, email: data.body.email, name: data.body.name, msg: ''})
        }
    }
});


//Set storage engine
const storage = multer.diskStorage({
    destination: './client/public/uploads',
    filename: function(req, file, cb){
        cb(null, file.fieldname + '-' + Date.now() + 
        path.extname(file.originalname));
    }
})

//Init upload
const upload = multer({
    storage: storage,
    limits:{fileSize: 1000000}
}).single('profilePicture');


router.post('/upload', function(req, res, next) {
    upload(req, res, (err) => {
        if(err){
            const profile = {
                id: req.session.activeUser.id
            }
            
            const option = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(profile)
            };
            fetch("http://localhost:5000/api/profiles/upload/error", option)
            .then(r =>  r.json().then(data => ({status: r.status, body: data})))
            .then(function(data){
                renderData(data);
            });
            function renderData(data){
                res.render('profile', {defaultPicture: data.body.image, email: data.body.email, name: data.body.name, msg: ` - ${err.message}`})
            };  
                 
        } else{
            if(req.file == undefined){
                res.render('profile', {
                    msg: '',
                    defaultPicture: 'uploads/defaultPicture.png'
                });
            } else{
                const profile = {
                    image: `uploads/${req.file.filename}`,
                    id: req.session.activeUser.id
                }
                
                const option = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(profile)
                };
                
                req.session.activeUser.image = `uploads/${req.file.filename}`;
                fetch("http://localhost:5000/api/profiles/upload", option)
                .then(r =>  r.json().then(data => ({status: r.status, body: data})))
                .then(function(data){
                    renderData(data);
                });
                function renderData(data) {
                    res.render('profile', {
                        defaultPicture: 'uploads/defaultPicture.png',
                        file: `uploads/${req.file.filename}`,
                        name: data.body.name,
                        email: data.body.email,
                        msg: '- changed'
                    });
                }
               
            }
        }
    });
});

router.post('/savedChanges', function(req, res, next){
    
    const profile = {
        id: req.session.activeUser.id,
        name: req.body.name,
        email: req.body.email
    }

    const option = {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(profile)
    };
    fetch("http://localhost:5000/api/profiles/upload/info", option)
            .then(r =>  r.json().then(data => ({status: r.status, body: data})))
            .then(function(data){
                renderData(data);
            });
    function renderData(data){
        res.render('profile', {defaultPicture: data.body.image, email: data.body.email, name: data.body.name, msg: ''})
    }
})


router.post('/delete', function(req, res, next){
    const profile = {
        id: req.session.activeUser.id,
        image: 'uploads/defaultPicture.png'
    }
    const option = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(profile)
    };
        req.session.activeUser.image = 'uploads/defaultPicture.png'
        fetch("http://localhost:5000/api/profiles/delete", option)
        .then(r =>  r.json().then(data => ({status: r.status, body: data})))
        .then(function(data){
            renderData(data);
        });
        function renderData(data){
            res.render('profile', {defaultPicture: data.body.image, email: data.body.email, name: data.body.name, msg: '- deleted'})
        };
    
})

module.exports = router;