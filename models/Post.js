const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users" //users can only delete and create own posts
  },
  text: {
    type: String,
    required: true
  }, //to keep post of deleted users
  name: {
    type: String
  },
  avatar: {
    type: String
  },
  //like and removal of like system via array
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users" //to distinguish which user liked and a single user can like a post
      }
    }
  ],
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users"
      },
      text: {
        type: String,
        required: true
      },
      name: {
        type: String
      },
      avatar: {
        type: String
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  //date on post
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Post = mongoose.model("post", PostSchema);
