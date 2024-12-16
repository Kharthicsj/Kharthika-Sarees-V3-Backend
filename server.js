import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import router from './routes/index.js';
import cookieParser from 'cookie-parser';
import session from 'express-session';

dotenv.config();

const app = express();

// CORS Middleware
app.use(cors({
    origin: ["http://localhost:3000", "https://kharthikasarees-x6e5.onrender.com", "https://kharthikasarees.com"],
    credentials: true,
}));

// Handle Preflight Requests
app.options('*', cors());

// Add Headers Manually (Optional)
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

// Other Middlewares
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 },
}));

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB);
        console.log("Mongo DB Connected Successfully");
    } catch (err) {
        console.log(err);
    }
};

// Routes
app.use("/", router);

// Start Server
const port = process.env.PORT || 4000;
app.listen(port, () => {
    connectDB();
    console.log(`Server Running on Port - ${port}`);
});
