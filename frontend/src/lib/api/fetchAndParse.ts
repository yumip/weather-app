export const fetchAndParse = async (request: Request): Promise<Response> => {
  const response = await fetch(request);

  if (!response.ok) {
    let errorMessage = "Something went wrong. Please try again later!";
    try {
      const responseData: unknown = await response.json();

      if (
        (response.status === 400 || response.status === 500) &&
        typeof responseData === "object" &&
        responseData !== null &&
        "message" in responseData &&
        typeof responseData.message === "string"
      ) {
        errorMessage = responseData.message;
      }
    } catch {
      // keep fallback message
    }
    throw new Error(errorMessage);
  }

  return response;
};

export const fetchAndParseJson = async <T>(request: Request): Promise<T> => {
  const response = await fetchAndParse(request);
  const data: unknown = await response.json();
  return data as T;
};
