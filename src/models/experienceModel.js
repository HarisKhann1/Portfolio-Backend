import mongoose, { Schema } from "mongoose";

const experienceSchema = new Schema(
    {
        companyName: { type: String, required: true, unique: true, trim: true },
        role: { type: String, required: true, trim: true },
        description: { type: String, required: false, maxlength: 1000 },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: false },
    },
    { timestamps: true }
);

const ExperienceModel = mongoose.model("Experience", experienceSchema);

export default ExperienceModel;