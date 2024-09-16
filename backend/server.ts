require('dotenv').config({ path: ".env" });
import express from 'express';
import cors from 'cors';
import userRouter from "./routes/user.router"; 
import commonRouter from "./routes/common.router"
import tournamentRouter from './routes/tournament.router';

import connectDb from './config/db';
connectDb(); 

const port = process.env.port || 8001; 
const app = express(); 

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
})

// routers
app.use('/auth', userRouter);
app.use('/common', commonRouter); 
app.use('/tournament', tournamentRouter);

app.listen(port, () => { 
    console.log(`Server is running on port ${port}`);
})


