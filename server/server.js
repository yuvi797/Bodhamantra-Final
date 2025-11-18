import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app.js";

dotenv.config();  // <-- VERY IMPORTANT

// Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
