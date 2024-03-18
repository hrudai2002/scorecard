require('dotenv').config({ path: ".env" });
import express from 'express';
import cors from 'cors';
import connectDb from './config/db';

const port = process.env.port || 5001; 

connectDb(); 
const app = express(); 
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => { 
    console.log(`Server is running on port ${port}`);
})


