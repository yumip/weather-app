export const METHOD_TYPES = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
};

export type MethodType = (typeof METHOD_TYPES)[keyof typeof METHOD_TYPES];

export const RequestFactory = {
  createRequest: (
    method: MethodType,
    path: string,
    options: RequestInit = {},
  ) => {
    return new Request(path, {
      method,
      ...options,
    });
  },
};
