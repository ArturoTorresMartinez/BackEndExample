const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const movieSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        year: {
            type: Date,
            required: true
        },
        rating: {
            type: Number,
            required: true
        },
        actors: [{
            type: Schema.Types.ObjectId,
            ref: 'Actor',
            required: false
        }],
        directors: [{
            type: Schema.Types.ObjectId,
            ref: 'Director',
            required: false
        }]
    }, { timestamps: true }
);

module.exports = mongoose.model('Movie', movieSchema);