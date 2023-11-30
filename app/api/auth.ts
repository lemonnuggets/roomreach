import { API_URL } from "@/constants/url";

export const authHealthCheck = async () => {
  const url = `${API_URL}/auth/healthcheck`;

  const response = await fetch(url);
  const data = await response.json();

  return data;
};
