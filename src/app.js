import express, { urlencoded } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

// cors middleware for all request
app.use(
    cors({
        origin: process.env.CORS_ORIGINS,
        credentials: true
    })
);

// common middleware
app.use(
    express.json({limit: "16kb"}) // parses incoming JSON payloads in request body
);
app.use(
    express.urlencoded({extended: true, limit: "16kb"}) // parses URL-encoded bodies with nested objects (extended: true)
);
app.use(
    express.static("public") // serves static files from 'public' directory
)
app.use(cookieParser()); // parses Cookie header and populates req.cookies

export default app;