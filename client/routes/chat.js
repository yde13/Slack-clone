var express = require('express');
var router = express.Router();
const fetch = require('node-fetch');

/* GET chat view/page. */
router.get('/', async function(req, res, next) {
    if(req.session.activeUser == undefined){
        res.redirect('/');
    }else{
        const id = req.session.activeUser.id;
        const responseChannels = await fetch('http://localhost:5000/channels/' + id )
        const allChannels = await responseChannels.json()
        const responseDirectMessage = await fetch('http://localhost:5000/channels/directMessage/' + id )
        const allDirectMessage = await responseDirectMessage.json()
        const responseUsers = await fetch('http://localhost:5000/users');
        const allUsers = await responseUsers.json()
        res.render('chat', {
            image: req.session.activeUser.image,
            username: req.session.activeUser.username, 
            channels: allChannels,
            directMessages: allDirectMessage,
            allUsers: allUsers
        });
    }
});

/* POST new message */ 
router.post('/new-message', function(req,res,next){
    const option = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(req.body) 
    }
    fetch('http://localhost:5000/messages/new', option)
    .then(response => response.json())
    .then(data => {
        res.send(data);
    })
});

router.put('/message/edit/:id', function(req,res,next){
    const option = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(req.body) 
    }
    fetch('http://localhost:5000/messages/edit/' + req.params.id, option)
    .then(response => response.json())
    .then(data => {
        res.send(data);
    })
})

router.delete('/message/delete/:id', function(req,res,next){
    const option = {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    }
    fetch('http://localhost:5000/messages/delete/' + req.params.id, option)
    .then(response => response.json())
    .then(data => {
        res.send(data);
    })
});

/* Getting all messages for each chat */
router.get('/messages/:id', async function(req,res,next){
    let channelID = req.params.id;
    const responseAllChannelMessages = await fetch('http://localhost:5000/channels/messages/' + channelID);
    const allChannelMessages = await responseAllChannelMessages.json();
    res.send(allChannelMessages)
})


router.get('/all-channels', async function(req, res, next){
    const userID = req.session.activeUser.id;
    const responseAllChannels = await fetch('http://localhost:5000/channels/join/' + userID);
    const allChannels = await responseAllChannels.json();
    res.send(allChannels);
});

router.post('/check-new-channel', function (req, res, next) {
    const searchValue = {
        createdByUserID: req.session.activeUser.id,
        channelSearchValue: req.body.searchChannel
    }
    const option = {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(searchValue) 

    };
    
    fetch("http://localhost:5000/channels/check-new-channel", option)
    .then(response => {
        response.json().then(function(data) {
            res.send(data);
        });
    });
});


/* Create a new Channel route */ 
router.post('/new-channel', function (req, res, next) {
    const newChannel = {
       createdByUserID: req.session.activeUser.id,
       name: req.body.name,
       description: req.body.description
    }

    const option = {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(newChannel) 

    };
    
    fetch("http://localhost:5000/channels/new-channel", option)
    .then(response => {
        response.json().then(function(data) {
            if(data.status){
                res.send(data);
            }
        });
    });
});


/* Display available users in direct Message search. */ 
router.post('/check-new-directMessage', function (req, res, next) {
    const searchValue = {
        search: req.body.searchDirectMessage
    }
    const option = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(searchValue)
    
    };
    fetch("http://localhost:5000/channels/check-new-directMessage", option)
    .then(response => {
        response.json().then(function(data) {
            res.send(data);
        });
    });
    
});


/* Create a new Direct Message route */ 
router.post('/new-directMessage', function (req, res, next) {
    const clickedUser = {
        createdByUserID: req.session.activeUser.id,
        selectedUserID: req.body.id,
        createdByUsername:  req.session.activeUser.username,
        selectedByUsername: req.body.username
    }
    const option = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(clickedUser)
    
    };
        
    fetch("http://localhost:5000/channels/new-directMessage", option)
    .then(response => {
        response.json().then(function(data) {
            if(data.status){
                res.json(data);
            }else{
                res.json(data);
            }
        });
    });
    
});



module.exports = router;
