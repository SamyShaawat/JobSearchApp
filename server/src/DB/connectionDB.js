import mongoose from 'mongoose';
const dbName = "JobSearchApp"

const connectionDB = async () => {
    await mongoose.connect(`mongodb://localhost:27017/${dbName}`)
        .then(() => {
            console.log(`Connected to MongoDB ${dbName} ...`);
        })
        .catch((err) => {
            console.log("Error connecting to MongoDB: ", err);

        })
}

export default connectionDB;