const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
    profilePicture: {
        type: String,
        default: 'uploads/defaultPicture.png'
    },
    name: {
        type: String
    }

});

const Profile = mongoose.model('profile', ProfileSchema);

module.exports = Profile;