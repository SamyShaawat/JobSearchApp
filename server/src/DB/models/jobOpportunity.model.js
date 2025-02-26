import mongoose from 'mongoose';

const jobOpportunitySchema = new mongoose.Schema({
    jobTitle: {
        type: String,
        required: true,
        trim: true
    },
    jobLocation: {
        type: String,
        required: true,
        enum: ["onsite", "remotely", "hybrid"]
    },
    workingTime: {
        type: String,
        required: true,
        enum: ["part-time", "full-time"]
    },
    seniorityLevel: {
        type: String,
        required: true,
        enum: ["fresh", "Junior", "Mid-Level", "Senior", "Team-Lead", "CTO"]
    },
    jobDescription: {
        type: String,
        required: true
    },
    technicalSkills: {
        type: [String],
        required: true
    },
    softSkills: {
        type: [String],
        required: true
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    closed: {
        type: Boolean,
        default: false
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    }
}, {
    timestamps: true
});

const jobOpportunityModel = mongoose.models.JobOpportunity || mongoose.model('JobOpportunity', jobOpportunitySchema);
export default jobOpportunityModel;
