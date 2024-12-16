import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import router from './routes/index.js'
import cookieParser from 'cookie-parser'
import session from 'express-session';

const app = express();

app.use(cors({
    origin : ["http://localhost:3000", "https://kharthikasarees-x6e5.onrender.com", "https://kharthikasarees.com"],
    credentials : true
}));

app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
      cookie: { maxAge: 60 * 60 * 1000 },
    })
  );
  

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: "50mb", extended: true }))
app.use(cookieParser())

dotenv.config();

const port = 4000 || process.env.PORT

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB)
        console.log("Mongo DB Connected Successfully");
    } catch (err) {
        console.log(err);
    }
}

app.use("/", router)

app.listen(port, () => {
    try {
        connectDB();
        console.log(`Server Running on Port - ${port}`)
    } catch (err) {
        console.log(err)
    }
})