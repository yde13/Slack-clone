const mongoose = require('mongoose');

const directMessageSchema = mongoose.Schema(
  {
    createdByUserID: {
    },
    selectedUserID: {
    },
    createdByUsername: {
        type: String,
        lowercase: true
    },
    selectedByUsername: {
      type: String,
      lowercase: true
    }
  });


module.exports = mongoose.model('DirectMessage',directMessageSchema);