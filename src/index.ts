import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { getEnv } from "./config/env";
import authRoutes from "./routes/auth.routes";
import historyRoutes from "./routes/history.routes";
import pointsRoutes from "./routes/points.routes";
import rewardsRoutes from "./routes/rewards.routes";
import wasteRoutes from "./routes/waste.routes";

dotenv.config();

const env = getEnv();
const app = express();
const port = Number(process.env.PORT) || 3000;

// CORS restringido al origen del frontend (FRONTEND_URL), con los métodos y
// headers que la SPA necesita (token Bearer en Authorization). El callback
// valida el Origin recibido: solo se emiten headers CORS si coincide.
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || origin === env.frontendUrl) {
        callback(null, true);
        return;
      }
      callback(null, false);
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/waste", historyRoutes);
app.use("/api/waste", wasteRoutes);
app.use("/api/rewards", rewardsRoutes);
app.use("/api/points", pointsRoutes);

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});