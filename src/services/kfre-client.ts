// Create a dedicated KFRE client module

import axios from "axios";

const KFRE_BASE_URL = process.env.KFRE_SERVICE_URL || "http://localhost:8000";

if (!KFRE_BASE_URL) {
  throw new Error("KFRE_SERVICE_URL not set");
}

export type KfreRequest = {
  age: number;
  sex: "male" | "female";
  egfr: number;
  acr: number;
};

export type KfreResponse = {
  request_id: string;
  model: string;
  model_version: string;
  risk_5y_percent: number;
  interpretation: string;
};

export async function calculateKfre(
  input: KfreRequest
): Promise<KfreResponse> {
  try {
    const response = await axios.post<KfreResponse>(
      `${KFRE_BASE_URL}/calculate`,
      input,
      { timeout: 5000 }
    );

    return response.data;
  } catch (err: any) {
    // Surface Python service errors cleanly to backend logs
    const message =
      err.response?.data?.detail ||
      err.message ||
      "KFRE service unavailable";

    throw new Error(`KFRE calculation failed: ${message}`);
  }
}

