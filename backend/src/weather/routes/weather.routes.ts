import { Router, Request, Response } from "express";
import {
  getWeatherHandler,
  getHistoryHandler,
} from "../handlers/weather.handler";
import { validateQuery } from "../../middlewares/validation.middleware";
import { cityQuerySchema } from "../schemas/weather-query.schema";

const router = Router();

router.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

router.get("/weather", validateQuery(cityQuerySchema), getWeatherHandler);

router.get("/history", getHistoryHandler);

export default router;
