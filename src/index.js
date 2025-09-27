import dotenv from "dotenv";

// configuration of dotenv
dotenv.config();

import app from "./app.js";
import connectDB from "./config/mongodb.js";

connectDB().then(() => {
    app.listen(process.env.PORT, () => {
        console.log("Server is running on on port: ", process.env.PORT);
    })
}).catch((err) => {
    console.log(`Mongodb Connection error :: ${err}`)
})