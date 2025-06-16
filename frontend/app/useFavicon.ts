import { useEffect } from "react";

export default function useFavicon(iconPath: string) {
  useEffect(() => {
    const existing = document.querySelectorAll("link[rel*='icon']");
    existing.forEach((e) => e.remove());

    const link = document.createElement("link");
    link.rel = "icon";
    link.href = iconPath;
    link.type = "image/x-icon";
    document.head.appendChild(link);
  }, []);
}
