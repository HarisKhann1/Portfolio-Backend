import mongoose from "mongoose";

const connectDB = async (params) => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${process.env.Protfolio_DB}`);
        console.log(`MONGODB CONNECTION ESTABLISHED SUCCESSFULLY! :: ${connectionInstance}`);
        
    } catch (error) {
        console.log("MONGODB CONNECTION ERROR :: ", error);
        process.exit(1);
    }
}

export default connectDB;