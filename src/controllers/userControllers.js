import APIResponse from "../utils/apiResponse.js";
import ApiErrorResponse from "../utils/apiErrorResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/userModel.js";
import { generateAccessToken, generateRefreshToken } from "../utils/tokensGeneration.js";
import { verifyRefreshToken } from "../utils/tokensVerification.js";

// User Registration Controller
const userRegistration = asyncHandler(async (req, res) => {
    const { fullname, email, password } = req.body;

    // validation for empty fields
    if ([fullname, email, password].some((fieldData) => (fieldData ?? "").trim() === "")) {
        return res.status(400).json(
            new ApiErrorResponse(400, "All fields are required")
        );
    }

    // validation for password length
    if (password.length < 8) {
        return res.status(400).json(
            new ApiErrorResponse(400, "Password must be at least 8 characters long")
        );
    }

    // check for existing user
    const existedUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existedUser) {
        return res.status(409).json(
            new ApiErrorResponse(409, "User with this email already exists")
        );
    }

    // create new user
    const createdUser = await User.create({
        fullname,
        email,
        password,
    });

    if (!createdUser) {
        return res.status(500).json(
            new ApiErrorResponse(500, "Something went wrong while registering the user")
        );
    }

    // success response
    const userObj = createdUser.toObject();
    delete userObj.password; // remove password from the response object
    return res.status(201).json(
        new APIResponse(201, userObj, "User registered successfully")
    );
});

// Login Controller
const userLogin = asyncHandler(async (req, res) => {
    const {email, password} = req.body;

    // check valid email and password field
    if ([email, password].some((field) => (field ?? "").trim() === "")) {
        return res.status(400).json(
            new ApiErrorResponse(400, "Email and Password is required")
        )
    }

    // check the user in database
    const user = await User.findOne({ email }).select("+password");

    // if user does not exist
    if (!user) {
        // throw error
        return res.status(401).json(
            new ApiErrorResponse(401, "Invalid email or passowrd")
        )
    }else {
        // if user exist, check password
        const isUserPassCorrect = user.isPasswordCorrect(password);

        // if the passowrd is invalid throw an error
        if (!isUserPassCorrect) {
            new ApiErrorResponse(401, "Invalid email or password");
        }

        // create access and refresh tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // now save the refresh token to the user table
        const isRefreshTokenUpdated = await User.updateOne(
            {_id: user._id},
            {refreshToken: refreshToken}
        )

        // if refresh token is not updated, throw an error
        if (!isRefreshTokenUpdated) {
            return res.status(500).json(
                new ApiErrorResponse(500, "Something went wrong while logging in")
            )
        }

        // set cookies and send response
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true, // to prevent client side JS access
            secure: process.env.NODE_ENV === "production", // set secure flag in production
            sameSite: "strict", // to prevent CSRF
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        // set access token
        res.cookie("accessToken", accessToken, {
            httpOnly: true, // to prevent client side JS access
            secure: process.env.NODE_ENV === "production", // set secure flag in production 
            sameSite: "strict", // to prevent CSRF
            maxAge: 15 * 60 * 1000, // 15 minutes
        });

        const userObj = user.toObject();
        delete userObj.password; // remove password from the response object
        return res.status(200).json(
            new APIResponse(200, userObj ,"User logged in successfully")
        );
    }
    
})


// Refresh Token Controller
const refreshToken = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
        return res.status(401).json(new APIResponse(401, "Unauthorized: No refresh token found"));
    }

    // Generate a new acces token
    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
        return res.status(401).json(new APIResponse(401, "Unauthorized: Invalid refresh token"));
    }

    // Create new access token
    const newAccessToken = generateAccessToken({ _id: decoded._id, email: decoded.email, role: decoded.role });

    // Set new access token in cookies
    res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000, // 15 minutes
    });

    return res.status(200).json(new APIResponse(200, null, "Access token refreshed successfully"));
});

const logoutUser = asyncHandler( async (req, res) => {
    // Clear the access and refresh token cookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return res.status(200).json(new APIResponse(200, null, "User logged out successfully"));
});

export { userRegistration, userLogin, refreshToken, logoutUser };