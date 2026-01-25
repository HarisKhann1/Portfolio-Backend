import express, { urlencoded } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRouter from "./routes/registerUserRoutes.js"
import projectRouter from './routes/projectRoutes.js';
import experienceRouter from './routes/experienceRoutes.js';

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

app.get("/", (req, res) => {
    res.send("Welcome to Portfolio Backend API");
});

// user routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/projects", projectRouter);
app.use("/api/v1/experience", experienceRouter);

// testing middleware of auth
import { authMiddleware } from './middlewares/authMiddleware.js';
app.get("/test-middleware", authMiddleware, (req, res) => {
    res.send("Middleware tested successfully");
});


// 4️⃣ Error handler 
app.use((err, req, res, next) => {
    console.error(err); 

    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});
export default app;