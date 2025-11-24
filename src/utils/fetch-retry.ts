const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchWithRetry<T>(
  url: string,
  options?: RequestInit,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);

      // console.log("Response headers", response.headers);

      if (!response.ok) {
        const error = await response
          .json()
          .catch(() => ({ message: "Unknown error" }));

        throw new Error(
          `API returned error (status ${response.status}) ${JSON.stringify(error)}`
        );
      }

      return await response.json();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      console.error(
        `[fetchWithRetry] Error fetching from ${url}: ${lastError?.message}`
      );

      if (attempt === maxRetries) {
        break;
      }

      console.log(`Attempt ${attempt} failed, retrying in ${delayMs}ms...`);
      await delay(delayMs);
      // Exponential backoff
      delayMs *= 2;
    }
  }

  throw lastError || new Error("Failed to fetch after all retries");
}
