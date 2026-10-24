import express from "express";
import api from "./routes/api.js";
import cors from "cors";
const app = express();

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS middleware to allow React App to access API
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:4173"],
  }),
);

// API Routes
app.use("/api", api);

app.listen(8080, () => console.log(`Server is running on port 8080`));
