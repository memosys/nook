import { ThemeName } from "@nook/app-ui";

const CDN_BASE_URL =
  "https://res.cloudinary.com/merkle-manufactory/image/fetch";

export const formatToCDN = (
  url: string,
  opts?: { width?: number; type?: string },
) => {
  if (url.startsWith("data:")) return url;
  // if (url.includes("imagedelivery.net")) return url;

  const params = ["c_fill"];

  if (opts?.width) {
    params.push(`w_${opts.width}`);
  }

  return `${CDN_BASE_URL}/${params.join(",")}/${encodeURIComponent(url)}`;
};

export function formatTimeAgo(timestamp: number, suffix = false) {
  const seconds = Math.floor(
    (new Date().getTime() - new Date(timestamp).getTime()) / 1000,
  );
  let interval = seconds / 86400;

  if (interval > 30) {
    const dateObj = new Date(timestamp);
    const currentYear = new Date().getFullYear();
    const yearString =
      dateObj.getFullYear() !== currentYear ? `, ${dateObj.getFullYear()}` : "";
    return `${dateObj.toLocaleString("default", {
      month: "short",
    })} ${dateObj.getDate()}${yearString}`;
  }
  if (interval > 1) {
    const amount = Math.floor(interval);
    return `${amount}${suffix ? ` day${amount !== 1 ? "s" : ""} ago` : "d"}`;
  }
  interval = seconds / 3600;
  if (interval > 1) {
    const amount = Math.floor(interval);
    return `${amount}${suffix ? ` hour${amount !== 1 ? "s" : ""} ago` : "h"}`;
  }
  interval = seconds / 60;
  if (interval > 1) {
    const amount = Math.floor(interval);
    return `${amount}${suffix ? ` minute${amount !== 1 ? "s" : ""} ago` : "m"}`;
  }

  const amount = Math.floor(seconds);
  return `${amount}${suffix ? ` second${amount !== 1 ? "s" : ""} ago` : "s"}`;
}

export function formatNumber(num: number, decimals?: number): string {
  if (num >= 1000000000000) {
    return `${(Math.floor(num / 10000000000) / 100).toFixed(decimals ?? 2)}T`;
  }
  if (num >= 1000000000) {
    return `${(Math.floor(num / 10000000) / 100).toFixed(decimals ?? 2)}B`;
  }
  if (num >= 1000000) {
    return `${(Math.floor(num / 10000) / 100).toFixed(decimals ?? 2)}M`;
  }
  if (num >= 1000) {
    return `${(Math.floor(num / 10) / 100).toFixed(decimals ?? 1)}K`;
  }
  if (decimals) {
    if (Number.isInteger(num)) {
      return num.toString();
    }
    if (num >= 10) {
      return num.toFixed(2);
    }
    return num.toFixed(4);
  }
  return num.toString();
}

export function formatPrice(num: number): string {
  if (num >= 1000000) {
    return `${(Math.floor(num / 10000) / 100).toFixed(2)}M`;
  }
  if (num >= 10000) {
    return `${(Math.floor(num / 10) / 100).toFixed(2)}K`;
  }
  if (num < 0.0001) {
    return num.toFixed(6);
  }
  if (num < 1) {
    return num.toFixed(4);
  }
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function stringToColor(str: string): string {
  const backgroundColors = [
    "#87CEEB", // Sky Blue
    "#FF7F50", // Coral
    "#40E0D0", // Turquoise
    "#50C878", // Emerald Green
    "#9966CC", // Amethyst
    "#FD5E53", // Sunset Orange
    "#008080", // Teal
    "#D87093", // Pale Violet Red,
    "#32CD32", // Lime Green
    "#6A5ACD", // Slate Blue,
    "#FFDB58", // Mustard Yellow
    "#708090", // Slate Grey
    "#2E8B57", // Sea Green,
    "#6495ED", // Cornflower Blue,
    "#FFA07A", // Light Salmon,
    "#191970", // Midnight Blue
    "#98FF98", // Mint Green
    "#800000", // Maroon
    "#007BA7", // Cerulean
    "#E97451", // Burnt Sienna
  ];

  // Hash function to convert the string to a hash number.
  const hash = str.split("").reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);

  // Use the hash number to select a color from the list.
  const index = Math.abs(hash) % backgroundColors.length;
  return backgroundColors[index];
}

export const darkenColor = (color: string): string => {
  let r = parseInt(color.slice(1, 3), 16);
  let g = parseInt(color.slice(3, 5), 16);
  let b = parseInt(color.slice(5, 7), 16);

  r = Math.floor(r * 0.5);
  g = Math.floor(g * 0.5);
  b = Math.floor(b * 0.5);

  return `#${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
};

export const formatAddress = (address: string) => {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export function stringToTheme(str: string): ThemeName {
  const backgroundColors = [
    "mauve",
    "blue",
    "green",
    "orange",
    "pink",
    "purple",
    "red",
    "yellow",
  ];

  // Hash function to convert the string to a hash number.
  const hash = str.split("").reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);

  // Use the hash number to select a color from the list.
  const index = Math.abs(hash) % backgroundColors.length;
  return backgroundColors[index] as ThemeName;
}
