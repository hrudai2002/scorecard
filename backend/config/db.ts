import mongoose from "mongoose";

const connectDb = async () => {
    const dbUrl = process.env.MONGO_URI || '';
    try {
        await mongoose.connect(dbUrl, { dbName: 'scorecard' });
        console.log('DB Connected');
    } catch (error) {
        console.log(`Error : ${error.message}`);
    }
}

export default connectDb;