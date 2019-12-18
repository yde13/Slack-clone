const mongoose = require('mongoose');

const ChannelSchema = mongoose.Schema(
  {
    createdByUserID: {
    },
    name: {
     type: String,
     lowercase: true
    },
    description: {
        type: String,
        lowercase: true
    }
  });


module.exports = mongoose.model('Channels',ChannelSchema);