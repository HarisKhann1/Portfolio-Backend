import { addProject, updateProject, deleteProject, searchProject, getProjects} from '../controllers/ProjectsController.js';
import { Router } from 'express';

const projectRouter = Router();

projectRouter.post("/add-project", addProject);
projectRouter.put("/update-project/:id", updateProject);
projectRouter.delete("/delete-project/:id", deleteProject);
projectRouter.get("/search-project", searchProject);
projectRouter.get("/get-projects", getProjects);

export default projectRouter;