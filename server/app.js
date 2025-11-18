import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import logger from "./utils/logger.js";
import dotenv from "dotenv";
const app = express();
const morganFormat = ":method :url :status :response-time ms";

// ------------------- MIDDLEWARES -------------------
dotenv.config({
  path: './.env'
})
// CORS
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
    ],
    credentials: true,
  })
);


// Logger
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const [method, url, status, responseTime] = message.trim().split(" ");
        logger.info(JSON.stringify({ method, url, status, responseTime }));
      },
    },
  })
);



app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Cookies & static
app.use(cookieParser());
app.use(express.static("public"));

// ------------------- ROUTES -------------------

// Health check
app.get("/test", (req, res) => {
  res.send("🚀 Server is live and running!");
});

// Other API routes
import authRoutes from './routes/auth.js';
import mentorRoutes from './routes/mentor.js';
import requestRoutes from './routes/requests.js';
import adminRoutes from './routes/admin.js';

app.use('/api/auth', authRoutes);
app.use('/api/mentors', mentorRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/admin', adminRoutes);

export default app;
