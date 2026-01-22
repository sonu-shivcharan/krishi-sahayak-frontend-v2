export const getGeminiToken = async () => {
  // Fetch new token
  const resp = await fetch(
    "http://localhost:3000/api/v1/chat/create-gemini-live-token",
    { method: "POST" },
  );
  const data = await resp.json();
  const apiKey = data.token?.name || data.accessToken;
  const expires = Date.now() + 30 * 60 * 1000; // 30 minutes
  localStorage.setItem(
    "geminiToken",
    JSON.stringify({ token: apiKey, expires }),
  );
  return apiKey;
};
