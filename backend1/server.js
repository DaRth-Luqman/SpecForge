import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import sequelize from "./config/db.js";
import analyzeRoutes from "./routes/analyze.routes.js";

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", analyzeRoutes);

// Start server
const startServer = async () => {
    try {
        console.log("⏳ Connecting to DB...");

        await sequelize.authenticate();
        console.log("✅ DB Connected");

        await sequelize.sync({ alter: true });
        console.log("✅ Models Synced");

        app.listen(PORT, () => {
            console.log(`🚀 Server running on ${PORT}`);
        });

    } catch (error) {
        console.error("❌ DB ERROR:");
        console.error(error);
    }
};

startServer();