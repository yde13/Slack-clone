var express = require('express')
var router = express.Router()

/* Import database models */ ;
const Channels = require('../models/channels')
const Messages = require('../models/messages')
const Users = require('../models/users');
const DirectMessages = require('../models/directMessage');


/* GET all channels */ 
router.get('/', function(req,res,next){
    Channels.find({}, function(err,data){
        if(err){
            res.status(500).send();
        }else{
            res.send(data);
        }
    });
});

/* GET all Channels which the user don't created */ 
router.get('/join/:id', function(req,res,next){
    const userID = req.params.id;
    Channels.find({createdByUserID: { $ne: userID }}, function(err, data) {   
        if(err){
            res.status(500).send();
        }
        else{
            res.send(data);
        }
    });
});


/* GET all Channels information from each user ID. */
router.get('/:id', function (req, res, next){
    const userID = req.params.id;
    Channels.find({createdByUserID: userID}, function(err, data) {   
        if(err){
            res.status(500).send();
        }
        else{
            res.send(data);
        }
    });
});

/* GET all messages to the specific channel. */
router.get('/messages/:id', function (req, res, next) {
    let clickedChannelID = req.params.id;
    Messages.find({channelID: clickedChannelID}, function(err, data) {   
        if(err){
            res.status(500).send();
        }
        else{
            res.send(data);
        }
    });
});

/* POST new Channel information and checking if the Channel is valid. */
router.post('/check-new-channel', function (req, res, next) {
    const searchValue = req.body.channelSearchValue;
    Channels.findOne({name: searchValue}, async function(err, data) {   
        if(err){
            res.status(500).send();
        }
        else if(data == null) {
            if(searchValue == ""){
                res.status(201).json({ status: true , success: ""});
            }else{
                res.status(201).json({ status: true , success: "Name is available"});
            }
        }
        else{
            res.status(400).json({ status: false, error: "Name is not available" });
        }
    });
});

/* POST new Channel information if we have a valid channel name from the search channel router */
router.post('/new-channel', function (req, res, next) {
    try{
        let channel = new Channels(req.body);
        channel.save(function (err, channelObject) {
            if (err){
                res.status(500).send();
            }
            let id = channelObject._id;
            res.status(201).json({ status: true, success: "Channel created!", id: id });
        });
    }catch{
        res.status(500).send();
    }
       
});


// /* GET all Channels information from each user ID. */
router.get('/directMessage/:id', function (req, res, next){
    const userID = req.params.id;
    DirectMessages.find({$or: [{createdByUserID: userID},{selectedUserID: userID}]}, function(err, data) {   
        if(err){
            res.status(500).send();
        }
        else{
            res.send(data);
        }
    });
});

/* POST new direct message information and checking if the  is valid. */
router.post('/check-new-directMessage', function (req, res, next) {
    const searchTerm = req.body.search
    
    Users.find({username: {$regex: '^' + searchTerm}} ,function(err, data){   
        if(err){
            res.status(500).send();
        }
        res.send(data);
    });
});

/* POST new Channel information and checking if the Channel is valid. */
router.post('/new-directMessage', function (req, res, next) {
    DirectMessages.findOne({selectedUserID: req.body.selectedUserID, createdByUserID: req.body.createdByUserID}, async function(err, data) {   
        if(err){
            res.status(500).send();
        }
        else if(data == null) {
            try{
                let directMessage = new DirectMessages(req.body);
                directMessage.save(function (err, directMessageObject) {
                    if (err){
                        res.status(500).send();
                    }
                    let id = directMessageObject._id;
                    res.status(201).json({ status: true, success: "Direct message created!", id: id});
                });

            }catch{
                res.status(500).send(); 
            }
        }
        else{
            res.status(400).json({ status: false, error: "Direct Message is already shown." });
        }
    });
});


module.exports = router