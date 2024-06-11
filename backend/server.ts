require('dotenv').config({ path: ".env" });
import express from 'express';
import cors from 'cors';
import userRouter from "./routes/user.router"; 
import commonRouter from "./routes/common.router"

import connectDb from './config/db';
connectDb(); 

const port = process.env.port || 5001; 
const app = express(); 

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// routers
app.use('/user', userRouter);
app.use('/common', commonRouter);

app.listen(port, () => { 
    console.log(`Server is running on port ${port}`);
})


