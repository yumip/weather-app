import express from "express";
import request from "supertest";
import { AppError, HTTP_STATUS } from "../utils/error";
import { type WeatherResult } from "../types/weather.types";

// Mock BEFORE importing modules that depend on them
const mockGetWeatherByCity = jest.fn();
const mockFindRecent = jest.fn();

jest.mock("../services/weather.service", () => ({
  getWeatherByCity: mockGetWeatherByCity,
}));

jest.mock("../repositories/search-history.repository", () => ({
  searchHistoryRepository: { findRecent: mockFindRecent },
}));

// Now safe to import modules
import weatherRoutes from "./weather.routes";
import { errorMiddleware } from "../../middlewares/error.middleware";
import { HistoryResponseItem } from "../repositories/search-history.repository";

const app = express();
app.use(express.json());
app.use("/api", weatherRoutes);
app.use(errorMiddleware);

const mockWeatherResult: WeatherResult = {
  city: "Sydney",
  country: "Australia",
  temperature: 22,
  windSpeed: 15,
  humidity: 60,
  weatherCode: 0,
  unit: "celsius",
  timestamp: "2024-01-01T12:00:00.000Z",
};

describe("GET /api/health", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns 200 with status ok", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("status", "ok");
    expect(res.body).toHaveProperty("timestamp");
  });
});

describe("GET /api/weather", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns 200 with weather data for a valid city", async () => {
    mockGetWeatherByCity.mockResolvedValue(mockWeatherResult);
    const res = await request(app).get("/api/weather?city=Sydney");
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      city: "Sydney",
      temperature: 22,
      condition: expect.any(String),
    });
  });

  it("returns 400 when the city query param is missing", async () => {
    const res = await request(app).get("/api/weather");
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("returns 400 when city is empty string", async () => {
    const res = await request(app).get("/api/weather?city=");
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("returns 404 when city is not found", async () => {
    mockGetWeatherByCity.mockRejectedValue(
      new AppError(HTTP_STATUS.NOT_FOUND, "City not found"),
    );
    const res = await request(app).get("/api/weather?city=InvalidCity");
    expect(res.status).toBe(404);
    expect(res.body).toMatchObject({ error: "City not found" });
  });

  it("returns 502 when upstream service fails", async () => {
    mockGetWeatherByCity.mockRejectedValue(
      new AppError(HTTP_STATUS.BAD_GATEWAY, "Upstream request failed: 503"),
    );
    const res = await request(app).get("/api/weather?city=Sydney");
    expect(res.status).toBe(502);
    expect(res.body).toMatchObject({
      error: expect.stringContaining("Upstream"),
    });
  });

  it("returns 500 for unexpected errors", async () => {
    mockGetWeatherByCity.mockRejectedValue(new Error("Unexpected error"));
    const res = await request(app).get("/api/weather?city=Sydney");
    expect(res.status).toBe(500);
    expect(res.body).toMatchObject({ error: "Internal server error" });
  });
});

describe("GET /api/history", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns 200 with a history array", async () => {
    const items: HistoryResponseItem[] = [
      {
        city: "Sydney",
        temperature: 22,
        timestamp: "2024-01-01T12:00:00.000Z",
      },
    ];
    mockFindRecent.mockResolvedValue(items);
    const res = await request(app).get("/api/history");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toMatchObject({ city: "Sydney" });
  });

  it("returns 200 with empty array when no history", async () => {
    mockFindRecent.mockResolvedValue([]);
    const res = await request(app).get("/api/history");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("returns 503 when repository fails", async () => {
    mockFindRecent.mockRejectedValue(new Error("Database connection failed"));
    const res = await request(app).get("/api/history");
    expect(res.status).toBe(503);
    expect(res.body).toMatchObject({ error: "History unavailable" });
  });
});
