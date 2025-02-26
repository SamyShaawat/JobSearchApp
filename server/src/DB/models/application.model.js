import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'JobOpportunity',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userCV: {
        secure_url: { type: String, required: true },
        public_id: { type: String, required: true }
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'viewed', 'in consideration', 'rejected'],
        default: 'pending'
    }
}, {
    timestamps: true
});

const applicationModel = mongoose.models.Application || mongoose.model('Application', applicationSchema);
export default applicationModel;
