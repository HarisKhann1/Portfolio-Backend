import { addProject, updateProject, deleteProject, searchProject, getProjects} from '../controllers/ProjectsController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { Router } from 'express';

const projectRouter = Router();

projectRouter.post("/add-project", authMiddleware, addProject);
projectRouter.put("/update-project/:id", authMiddleware, updateProject);
projectRouter.delete("/delete-project/:id", authMiddleware, deleteProject);
projectRouter.get("/search-project/:query", authMiddleware, searchProject);
projectRouter.get("/get-projects", authMiddleware, getProjects);

export default projectRouter;