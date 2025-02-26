import mongoose from 'mongoose';

const connectionDB = async () => {
  const uri = process.env.URI_CONNECTION || "mongodb://localhost:27017/JobSearchApp";
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Connected to MongoDB at ${uri}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); 
  }
};

export default connectionDB;