import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        lowercase: true,
        minLength: 3,
        maxLength: 10
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    password: {
        type: String,
        required: true,
        minLength: 8
    },
    phone: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
        enum: ["Male", "Female"]
    },
    confirmed: {
        type: Boolean,
        default: false
    }
},
{
    timestamps: true,
    autoCreate: true,
}
);

const userModel = mongoose.model.User || mongoose.model("User", userSchema);


export default userModel;

