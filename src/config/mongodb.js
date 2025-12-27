import mongoose from "mongoose";

const connectDB = async (params) => {    
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.Portfolio_DB}`);
        console.log(`MONGODB CONNECTION ESTABLISHED SUCCESSFULLY! :: ${connectionInstance}`);
        
    } catch (error) {
        console.log("MONGODB CONNECTION ERROR :: mongodb.js :: ", error);
        process.exit(1);
    }
}

export default connectDB;