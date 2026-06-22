const mongoose = require('mongoose');

// Use Atlas URI from Render, fallback to local for dev
const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/auth';

mongoose.connect(uri)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

const userSchema = new mongoose.Schema({
    age: Number,
    username: String,
    email: String,
    password: String
})

module.exports = mongoose.model("user", userSchema);
