import ProjectModel from '../models/projectsModel.js';
import UserModel from '../models/userModel.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiErrorResponse from '../utils/apiErrorResponse.js';
import APIResponse from '../utils/apiResponse.js';

const addProject = asyncHandler( async (req, res) => {
    const { title, description, category, projectUrl, sourceCodeUrl, imageUrl } = req.body;

    const valFields = [title, description, category, projectUrl, sourceCodeUrl, imageUrl];

    // Validate required fields
    valFields.forEach( (field) => {
        if (field?.trim() === '' || field == null || field == undefined) {
           return res.status(400).json(new ApiErrorResponse(400, "All fields are required"));
        }
    })
    
    try {
        // validate if project with same title already exists
        const isProjectExists = await ProjectModel.findOne({ title: title.trim() });
        if (isProjectExists) {
            return res.status(409).json(new ApiErrorResponse(409, "Project with same title already exists"));
        }

        // Add project data to database
        const project = await ProjectModel.create(
            { title, description, category, projectUrl, sourceCodeUrl, imageUrl }
        );

        // Return success response
        return res.status(201).json(new APIResponse(201, project, "Project added successfully"));
    } catch (error) {
        console.error("Error adding project:", error);
        return res.status(500).json(new ApiErrorResponse(500, "Somthing went wrong while adding project"));
    }
});

const updateProject = asyncHandler( async (req, res) => {
    // To be implemented
    const userEmail = req.user.email;
    const projectId = req.params.id;
    const { title, description, category, projectUrl, sourceCodeUrl, imageUrl } = req.body;

    // Validate user
    if (!userEmail) {
        return res.status(401).json(new ApiErrorResponse(401, "Unauthorized user"));
    }
    const user = await UserModel.findOne(
        { email: userEmail }
    );

    if (!user) {
        return res.status(404).json(new ApiErrorResponse(404, "User not found"));
    }

    // validate authorization
    if (user.role !== 'admin') {
        return res.status(403).json(new ApiErrorResponse(403, "Forbidden: You don't have permission to perform this action"));
    }

    // validate project existence
    const project = await ProjectModel.findById(projectId);
    if (!project) {
        return res.status(404).json(new ApiErrorResponse(404, "Project not found"));
    }

    // update project data
    project.title = title || project.title;
    project.description = description || project.description;
    project.category = category || project.category;
    project.projectUrl = projectUrl || project.projectUrl;
    project.sourceCodeUrl = sourceCodeUrl || project.sourceCodeUrl;
    project.imageUrl = imageUrl || project.imageUrl;

    // save updated project
    try {
        await project.save();
    } catch (error) {
        return res.status(500).json(new ApiErrorResponse(500, "Something went wrong while updating project"));
    }

    // Return success response
    return res.status(200).json(new APIResponse(200, project, "Project updated successfully"));

});

const deleteProject = asyncHandler( async (req, res) => {
    const userEmail = req.user.email;
    const projectId = req.params.id;

    // validations
    [userEmail, projectId].forEach( (field) => {
        if (field?.trim() === '' || field == null || field == undefined) {
           return res.status(400).json(new ApiErrorResponse(400, "All fields are required"));
        }
    });

    // Validate user
    const user = await UserModel.findOne(
        { email: userEmail }
    );
    if (!user) {
        return res.status(404).json(new ApiErrorResponse(404, "User not found"));
    }

    // validate project existence
    const project = await ProjectModel.findById(projectId);
    if (!project) {
        return res.status(404).json(new ApiErrorResponse(404, "Project not found"));
    }

    // validate authorization
    if (user.role !== 'admin') {
        return res.status(403).json(new ApiErrorResponse(403, "Forbidden: You don't have permission to perform this action"));
    }

    // delete project
    try {
        await ProjectModel.findByIdAndDelete(projectId);
    } catch (error) {
        return res.status(500).json(new ApiErrorResponse(500, "Something went wrong while deleting project"));
    }

    // Return success response
    return res.status(200).json(new APIResponse(200, null, "Project deleted successfully"));
});

const searchProject = asyncHandler( async (req, res) => {
    const { query } = req.query;
    if (!query || query.trim() === '') {
        return res.status(400).json(new ApiErrorResponse(400, "Search query is required"));
    }

    // pagination validation
    try {
        // Perform case-insensitive search for projects by title
        // lean() is used to get plain JavaScript objects instead of Mongoose documents
        const projects = await ProjectModel.findOne({title: { $regex: query, $options: 'i'}}).lean();

        return res.status(200).json(new APIResponse(200, projects, "Projects fetched successfully"));
    } catch (error) {
        return res.status(500).json(new ApiErrorResponse(500, "Something went wrong while searching projects"));
    }
});

const getProjects = asyncHandler( async (req, res) => {
    // Fetch project from database through pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // pagination validation
    if (page < 1 || limit < 1) {
        return res.status(400).json(new ApiErrorResponse(400, "Invalid pagination parameters"));
    }

    try {
        const [projects, totalProjects] = await Promise.all([
            ProjectModel.find().skip(skip).limit(limit).lean(),
            ProjectModel.countDocuments()
        ]);
        const totalPages = Math.ceil(totalProjects / limit);

        return res.status(200).json(new APIResponse(200, {
            projects,
            pagination: {
                totalProjects,
                totalPages,
                currentPage: page,
                pageSize: limit
            }
        }, "Projects fetched successfully"));
    } catch (error) {
        res.status(500).json(new ApiErrorResponse(500, "Something went wrong while fetching projects"));
    }
});

export { addProject, updateProject, deleteProject, searchProject, getProjects };