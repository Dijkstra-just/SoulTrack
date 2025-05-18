import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['companion', 'review']
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: function() { return this.type === 'companion'; }
  },
  endDate: {
    type: Date,
    required: function() { return this.type === 'companion'; }
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: function() { return this.type === 'review'; }
  },
  images: [{
    type: String, // URLs to image storage
  }],
  author: {
    name: {
      type: String,
      required: true
    },
    avatar: {
      type: String,
      default: '/default-avatar.png'
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now
  },
  likes: {
    type: Number,
    default: 0
  },
  comments: [
    {
      content: {
        type: String,
        required: true
      },
      author: {
        name: String,
        avatar: String,
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        }
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ]
});

const Message = mongoose.model('Message', MessageSchema);
export default Message; 