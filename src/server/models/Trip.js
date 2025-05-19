import mongoose from 'mongoose'

const addressSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  lanlat: { type: [Number], required: true, length: 2 },
  desc: { type: String },
  img: { type: String },
  time: { type: String },
  price: { type: String },
})

const detailsSchema = new mongoose.Schema({
  days: { type: Number, required: true },
  address: { type: [[addressSchema]], required: true },
})

const tripSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    title: { type: String, required: true },
    image: { type: String, required: true },
    alt: { type: String, required: true },
    duration: { type: String, required: true },
    spots: { type: Number, required: true },
    details: { type: detailsSchema },
    isPersonal: { type: Boolean, default: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
)

const Trip = mongoose.model('Trip', tripSchema)

export default Trip
