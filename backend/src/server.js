import express from 'express';
import "dotenv/config";
import authRoutes from './routes/auth.routes.js';
import { connectDB } from './lib/db.js';
import taskRoutes from './routes/task.routes.js';
import cookieParser from 'cookie-parser';
import cors from "cors";
import path from 'path';

const app = express();

const PORT = process.env.PORT;
const __dirname = path.resolve();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // allow frontend to send cookies
  })
);

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth/', authRoutes);
app.use('/api/tasks/', taskRoutes);

if(process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/dist', 'index.html'));
  })
}

app.listen(PORT, () => {
    console.log("Server is running on port 5001");
    connectDB();
})