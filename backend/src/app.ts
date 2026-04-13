import express from "express";
import weatherRoutes from "./weather/routes/weather.routes";
import { errorMiddleware } from "./middlewares/error.middleware";

export const app = express();

app.use(express.json());
app.use("/api", weatherRoutes);
app.use(errorMiddleware);
