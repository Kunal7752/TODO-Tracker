import express from 'express';
import "dotenv/config";
import authRoutes from './routes/auth.routes.js';
import { connectDB } from './lib/db.js';
import taskRoutes from './routes/task.routes.js';
import cookieParser from 'cookie-parser';

const app = express();

const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth/', authRoutes);
app.use('/api/tasks/', taskRoutes);

app.listen(PORT, () => {
    console.log("Server is running on port 5001");
    connectDB();
})