import mongoose from "mongoose";

export const connectDB = async () => {
    try{
        const URI = process.env.MONGODB_URI;

        if(!URI){
            console.error('URI is not defined');
            throw new Error('Connection not defined');
        }

        await mongoose.connect(URI);
        console.log('Databse Connected');
    }
    catch(err: unknown){
       console.log(err);
    }
}
