import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

// We can't directly use Clerk hooks outside React components, 
// so the token needs to be passed explicitly to the API calls or 
// we can set a global interceptor if we have a way to access the token globally.
// 
// For this implementation, we'll pass the token to the functions that make the calls.
