const mongoose = require('mongoose');

const UserSchema = mongoose.Schema(
  {
    name: {
     type: String,
     lowercase: true
    },
    username: {
        type: String, 
        lowercase: true, 
        },
    email: {
        type: String, 
        lowercase: true, 
        },
    password: String,
    image: {
      type: String,
      default: 'uploads/defaultPicture.png'
    }
    
  },{collection: 'users'});
// {timestamps: true}

module.exports = mongoose.model('User',UserSchema);