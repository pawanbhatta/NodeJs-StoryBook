const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    body: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['public', 'private'],
        default: 'public'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
}, {
    timestamps: true
});

const Story = mongoose.model('story', storySchema);

module.exports = Story;