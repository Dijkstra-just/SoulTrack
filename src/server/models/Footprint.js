import mongoose from 'mongoose'

const FootprintSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
  },
  location: {
    lng: {
      type: Number,
      required: true,
    },
    lat: {
      type: Number,
      required: true,
    },
  },
  photos: [
    {
      url: String,
    },
  ],
  tel: String,
  userId: {
    type: String,
    required: true,
    default: '1', // 默认用户ID，实际应用中应该从认证系统获取
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const Footprint = mongoose.model('Footprint', FootprintSchema)

export default Footprint
