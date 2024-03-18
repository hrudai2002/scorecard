import mongoose from "mongoose";

const connectDb = async () => {
    const dbUrl = process.env.MONGO_URI || '';
    try {
        await mongoose.connect(dbUrl);
        console.log('DB Connected');
    } catch (error) {
        console.log(`Error : ${error.message}`);
    }
}

export default connectDb;