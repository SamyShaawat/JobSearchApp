import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    industry: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true
    },
    numberOfEmployees: {
        type: Number,
        required: true,
        min: [11, 'Must have at least 11 employees'],
        max: [20, 'Must have no more than 20 employees']
    },
    companyEmail: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email']
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    logo: {
        secure_url: { type: String, default: null },
        public_id: { type: String, default: null }
    },
    coverPic: {
        secure_url: { type: String, default: null },
        public_id: { type: String, default: null }
    },
    HRs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    bannedAt: {
        type: Date,
        default: null
    },
    deletedAt: {
        type: Date,
        default: null
    },
    legalAttachment: {
        secure_url: { type: String, default: null },
        public_id: { type: String, default: null }
    },
    approvedByAdmin: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }

});
companySchema.virtual('jobs', {
    ref: 'JobOpportunity',
    localField: '_id',
    foreignField: 'companyId'
});

// mongoose hook for cascading deletion 
companySchema.pre('remove', async function (next) {
    next();
});

const companyModel = mongoose.models.Company || mongoose.model('Company', companySchema);
export default companyModel;
