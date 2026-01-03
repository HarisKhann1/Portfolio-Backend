import asyncHandler from "../utils/asyncHandler.js";
import APIResponse from "../utils/apiErrorResponse.js"
import {verifyAccessToken} from "../utils/tokensVerification.js";

const authMiddleware = asyncHandler(async (req, res, next) => {
    // Get access and refresh tokens from cookies
    const accessToken = req.cookies?.accessToken;
    const refreshToken = req.cookies?.refreshToken;

    // If neither token is present
    if (!accessToken && !refreshToken) {
        return res.status(401).json(new APIResponse(401, "Unauthorized: No tokens found"));
    }

    // If access token is missing but refresh token is present
    if (!accessToken && refreshToken) {
        return res.status(401).json(new APIResponse(401, "Unauthorized: Access token missing"));
    }

    // Verify access token
    if (accessToken) {
        const decoded = verifyAccessToken(accessToken);
        if (!decoded) {
            return res.status(401).json(new APIResponse(401, "Unauthorized: Invalid access token"));
        }
        req.user = decoded; // Attach decoded user info to request object
        // Proceed to the next middleware or route handler
        next(); 
    }
})

export { authMiddleware };