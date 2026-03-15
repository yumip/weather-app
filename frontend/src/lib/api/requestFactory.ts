export const METHOD_TYPES = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
};

export type MethodType = (typeof METHOD_TYPES)[keyof typeof METHOD_TYPES];

const DEFAULT_BASE_URL = "http://localhost:5174";

export const RequestFactory = {
  createRequest: (
    method: MethodType,
    path: string,
    options: RequestInit = {},
    baseURL = DEFAULT_BASE_URL,
  ) => {
    return new Request(`${baseURL}${path}`, {
      method,
      ...options,
    });
  },
};
