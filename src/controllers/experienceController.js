import ExperienceModel from "../models/experienceModel.js"
import asyncHandler from "../utils/asyncHandler.js";
import ApiErrorResponse from "../utils/apiErrorResponse.js";
import APIResponse from "../utils/apiResponse.js";


const addExperience = asyncHandler(async (req, res) => {
    const { companyName, role, startDate, endDate, description} = req.body;

    [companyName, role, startDate].some((field) => {
        // validation check
        if (field?.trim() === "" || field === null || field === undefined) {
            res.status(400).json(new ApiErrorResponse(400, "All Fields are required"))
        }
    })

    // description length check
    if (description?.length > 3000) {
        res.status(400).json(new ApiErrorResponse(400, "Description is too long. Maximum 3000 characters allowed."))
    }
    // date validation
    const start = new Date(startDate);
    const end = new Date(endDate);
    // end date should be greater than start date
    if (start >= end) {
        res.status(400).json(new ApiErrorResponse(400, "End date must be greater than start date."))
    }

    // check if the same experience already exist or not:
    const isExperienceExist = await ExperienceModel.findOne({ companyName: companyName});
    if (isExperienceExist) {
        res.status(409).json(new ApiErrorResponse(409, `${companyName} experience already exists.`))
    }

    // add to the database
    const dbResponse = await ExperienceModel.create({companyName, role, description, startDate, endDate})
    res.status(201).json(new APIResponse(201, dbResponse, "Experience added successfully."))
});

const updateExperience = asyncHandler(async (req, res) => {
    const { companyName, role, startDate, endDate, description} = req.body;
    const { experienceId } = req.params; // path parameter

    if (!experienceId) {
        res.status(400).json(new ApiErrorResponse(400, "Experience ID is required in path parameters."))
    }

    // check if experience with given ID exists
    const existingExperience = await ExperienceModel.findById(experienceId);
    if (!existingExperience) {
        res.status(404).json(new ApiErrorResponse(404, "Experience not found with the given ID."))
    }

    [companyName, role, startDate].some((field) => {
        // validation check
        if (field?.trim() === "" || field === null || field === undefined) {
            res.status(400).json(new ApiErrorResponse(400, "All Fields are required"))
        }
    })

    // description length check
    if (description?.length > 1000) {
        res.status(400).json(new ApiErrorResponse(400, "Description is too long. Maximum 1000 characters allowed."))
    }
    // date validation
    const start = new Date(startDate);
    const end = new Date(endDate);
    // end date should be greater than start date
    if (start >= end) {
        res.status(400).json(new ApiErrorResponse(400, "End date must be greater than start date."))
    }

    // check if the same experience already exist or not:
    const isExperienceExist = await ExperienceModel.findOne({ companyName: companyName});
    if (isExperienceExist) {
        res.status(409).json(new ApiErrorResponse(409, `${companyName} experience already exists.`))
    }

    // add to the database
    const dbResponse = await ExperienceModel.findByIdAndUpdate(experienceId, {companyName, role, description, startDate, endDate}, { new: true });
    res.status(201).json(new APIResponse(201, dbResponse, "Experience updated successfully."))
});

const deleteExperience = asyncHandler(async (req, res) => {
    const { experienceId } = req.params; // path parameter

    if (!experienceId) {
        res.status(400).json(new ApiErrorResponse(400, "Experience ID is required in path parameters."))
    }

    // check if experience with given ID exists
    const existingExperience = await ExperienceModel.findById(experienceId);
    if (!existingExperience) {
        res.status(404).json(new ApiErrorResponse(404, "Experience not found with the given ID."))
    }

    await ExperienceModel.findByIdAndDelete(experienceId);
    res.status(200).json(new APIResponse(200, {}, "Experience deleted successfully."))
});

const getAllExperiences = asyncHandler(async (req, res) => {
    const experiences = await ExperienceModel.find().sort({ startDate: -1 }); // sort by startDate descending
    res.status(200).json(new APIResponse(200, experiences, "Experiences retrieved successfully."))
});
export {addExperience, updateExperience, deleteExperience, getAllExperiences};