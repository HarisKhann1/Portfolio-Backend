import mongoose, {Schema} from "mongoose";

const projectSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        indexedDB: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    category: {
        type: [String],
        required: false,
        trim: true,
    },
    projectUrl: {
        type: String,
        required: false,
        trim: true,
    },
    sourceCodeUrl: {
        type: String,
        required: false,
        trim: true,
    },
    imageUrl: {
        type: String,
        required: false,
        trim: true,
    }
},
{
    timestamps: true,
});

const ProjectModel = mongoose.model("Project", projectSchema);

export default ProjectModel;