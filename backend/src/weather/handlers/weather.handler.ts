import { Request, Response, NextFunction } from "express";
import { toHandlerEvent } from "./weather.handler.contract";
import { handleGetWeather, handleGetHistory } from "./weather.logic.handler";

export async function getWeatherHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result = await handleGetWeather(toHandlerEvent(req));
    res.status(result.statusCode).json(result.body);
  } catch (err) {
    next(err);
  }
}

export async function getHistoryHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result = await handleGetHistory(toHandlerEvent(req));
    res.status(result.statusCode).json(result.body);
  } catch (err) {
    next(err);
  }
}
