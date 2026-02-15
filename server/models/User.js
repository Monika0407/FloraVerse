const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['buyer', 'seller'],
        default: 'buyer'
    },
    preferences: {
        indoorOutdoor: { type: String, enum: ['Indoor', 'Outdoor', 'Both'], default: 'Both' },
        sunlight: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
        experience: { type: String, enum: ['Beginner', 'Intermediate', 'Expert'], default: 'Beginner' },
        location: { type: String, default: 'General' }
    }
});

module.exports = mongoose.model('User', userSchema);
