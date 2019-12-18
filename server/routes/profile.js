const express = require ('express');
const router = express.Router();
const Profile = require('../models/user');

router.post('/profiles', function(req, res, next){
    const id = { _id: req.body.id };
    Profile.findById(id).then(function(profile){
        res.send(profile);
    }).catch(next);
});

/*router.post('/profiles', function(req, res, next){
    Profile.create(req.body).then(function(profile){
        res.send(profile);
    }).catch(next);
});*/

/*router.post('/profiles', function(req, res, next){
    Profile.findByIdAndUpdate({_id: '5dee072ce810bf0f5bc42e7b'}, req.body).then(function(profile){
        res.send(profile);
    }).catch(next);
})*/

router.post('/profiles/upload', function(req, res, next){
    const id = { _id: req.body.id };
    const image = { image: req.body.image};
    Profile.findByIdAndUpdate(id, image).then(function(){
    Profile.findOne(id).then(function(profile){
        res.send(profile);
    });
}).catch(next);
})

router.post('/profiles/upload/info', function(req, res, next){
    const id = { _id: req.body.id };
    const parameters = {
        email: req.body.email,
        name: req.body.name
    }
    Profile.findByIdAndUpdate(id, parameters).then(function(){
    Profile.findOne(id).then(function(profile){
        res.send(profile);
    });
}).catch(next);
})

router.post('/profiles/upload/error', function(req, res, next){
    const id = { _id: req.body.id };
    Profile.findById(id).then(function(profile){
        res.send(profile);
    });
});

router.post('/profiles/delete', function(req, res, next){
    const id = { _id: req.body.id };
    const image = { image: req.body.image};
    Profile.findByIdAndUpdate(id, image).then(function(){
    Profile.findOne(id).then(function(profile){
        console.log(profile);
        res.send(profile);
    });
}).catch(next);
})



router.put('/profiles/:id', function(req, res, next){
    Profile.findOneAndUpdate(req.body).then(function(profile){
        res.send(profile);
    }).catch(next);
});

router.delete('/profiles/:id', function(req, res, next){
    Profile.findByIdAndDelete({_id: req.params.id}).then(function(profile){
        res.send(profile);
    }).catch(next);
});

module.exports = router;