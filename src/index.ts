import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import authRoutes from "./routes/auth.routes";
import historyRoutes from "./routes/history.routes";
import pointsRoutes from "./routes/points.routes";
import rewardsRoutes from "./routes/rewards.routes";
import wasteRoutes from "./routes/waste.routes";

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/waste", historyRoutes);
app.use("/api/waste", wasteRoutes);
app.use("/api/rewards", rewardsRoutes);
app.use("/api/points", pointsRoutes);

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});