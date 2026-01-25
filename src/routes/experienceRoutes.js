import { Router } from "express";
import {addExperience, updateExperience, deleteExperience, getAllExperiences} from "../controllers/experienceController.js"


const experienceRouter = Router();

// add auth middleware and authorization middleware (later)
experienceRouter.post("/add-experience", addExperience);
experienceRouter.put("/update-experience/:experienceId", updateExperience);
experienceRouter.delete("/delete-experience/:experienceId", deleteExperience);
experienceRouter.get("/all-experiences", getAllExperiences);

export default experienceRouter;

