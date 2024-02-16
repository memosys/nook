import channels from "./channels.json";

export const DEV = true;

export const API_BASE_URL = "http://localhost:3000";
// export const API_BASE_URL = "https://1e91-69-121-62-27.ngrok-free.app";
// export const API_BASE_URL = "https://flink-api.up.railway.app";

export const SIWF_URI = "http://localhost:3000";
// export const SIWF_URI = API_BASE_URL;

export const SIWF_DOMAIN = "localhost:3000";
// export const SIWF_DOMAIN = "flink-api.up.railway.app";

export const CHANNELS = channels.reduce(
  (acc, channel) => {
    acc[channel.url] = channel;
    return acc;
  },
  {} as Record<string, (typeof channels)[0]>,
);