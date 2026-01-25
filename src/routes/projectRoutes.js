import { addProject, updateProject, deleteProject, searchProject, getProjects} from '../controllers/ProjectsController.js';
import multer from 'multer';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { storage, fileFilter } from '../middlewares/multerMiddleware.js';
import { Router } from 'express';

const projectRouter = Router();

projectRouter.post("/add-project", multer({ fileFilter, storage }).single('imageURL'), addProject);
projectRouter.put("/update-project/:id", authMiddleware, multer({ fileFilter, storage }).single('imageURL'), updateProject);
projectRouter.delete("/delete-project/:id", authMiddleware, deleteProject);
projectRouter.get("/search-project/:query", authMiddleware, searchProject);
projectRouter.get("/get-projects", authMiddleware, getProjects);

export default projectRouter;