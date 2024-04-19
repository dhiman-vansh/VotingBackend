const mongoose = require('mongoose');

const CandidateSchema = new mongoose.Schema({
    srNo: {
        type: Number,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    votes: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        required: true
    }
});

// Pre-save hook to generate serial number
CandidateSchema.pre('save', async function(next) {
    try {
        if (!this.srNo) {
            const count = await mongoose.model('Candidate').countDocuments();
            this.srNo = count + 1;
        }
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('Candidate', CandidateSchema);
