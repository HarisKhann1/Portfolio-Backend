// This file contains utility functions for verifying jwt tokens in the application.

import { json } from "express";
import jwt from "jsonwebtoken";

// Function to verify Access Token
const verifyAccessToken = (token) => {
    try {
        return jwt.verify(token.trim(), process.env.ACCESS_TOKEN_SECRET);
    } catch (error) {
        return null;
    }
}

// Function to verify Refresh Token
const verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token.trim(), process.env.REFRESH_TOKEN_SECRET);
    } catch (error) {
        return null;
    }
}

export { verifyAccessToken, verifyRefreshToken };

