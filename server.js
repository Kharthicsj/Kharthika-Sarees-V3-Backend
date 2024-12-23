import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import router from './routes/index.js';
import cookieParser from 'cookie-parser';
import session from 'express-session';

dotenv.config();

const app = express();

// CORS setup
app.use(cors({
    origin: ["http://localhost:3000", "https://kharthikasarees-x6e5.onrender.com", "https://kharthikasarees.com"],
    credentials: true,
}));

app.options('*', cors());

app.use((req, res, next) => {
    res.setHeader(
        "Content-Security-Policy",
        [
            "default-src 'self';",
            "script-src 'self' https://api.phonepe.com;",
            "style-src 'self';",
            "img-src 'self' https://example.com;",
            "font-src 'self';",
            "connect-src 'self' https://api.phonepe.com;",
            "frame-src 'self' https://api.phonepe.com;",
            "report-uri /csp-violations;"
        ].join(" ")
    );
    next();
});

// Setting Access-Control-Allow-Headers for pre-flight requests
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

// Middleware for parsing JSON and URL encoded data
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

// Session management
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

// Use routes from external file
app.use("/", router);

// Set up port and start the server
const port = process.env.PORT || 4000;
app.listen(port, () => {
    connectDB();
    console.log(`Server Running on Port - ${port}`);
});
