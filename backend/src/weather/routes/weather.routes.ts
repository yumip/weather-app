import { Router, Request, Response } from "express";
import {
  handleGetWeather,
  handleGetHistory,
} from "../handlers/weather.handler";
import { HandlerEvent } from "../handlers/weather.handler.contract";

const router = Router();

function toHandlerEvent(req: Request): HandlerEvent {
  return {
    queryStringParameters: req.query as Record<string, string | undefined>,
  };
}

router.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

router.get("/weather", async (req: Request, res: Response) => {
  const result = await handleGetWeather(toHandlerEvent(req));
  res.status(result.statusCode).json(JSON.parse(result.body));
});

router.get("/history", async (req: Request, res: Response) => {
  const result = await handleGetHistory(toHandlerEvent(req));
  res.status(result.statusCode).json(JSON.parse(result.body));
});

export default router;
