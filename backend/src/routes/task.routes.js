import express from 'express';
import { protectRoute } from "../middleware/auth.middleware.js";
import { addTask, getTasks, patchTask, deleteTask } from '../controllers/task.controller.js';

const router = express.Router();

router.use(protectRoute);

// Route to create a new task
router.post('/addTask', addTask); 

// Route to get all tasks
router.get('/getTasks', getTasks);

// Route to update a task by ID
router.patch('/patchTask/:id', patchTask);


// Route to delete a task by ID
router.delete('/deleteTask/:id', deleteTask);

export default router;