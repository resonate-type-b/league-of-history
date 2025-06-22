import { useState } from "react";
import useFavicon from "~/useFavicon";

export default function Home() {
  type coords = {
    x: number;
    y: number;
    size: number;
    rare: boolean;
  };

  const [images, setImages] = useState<coords[]>([]);

  const eheSound = new Audio("/ehe/ehe.mp3");
  const extraEheSound = new Audio("/ehe/EXTRAEHE.mp3");
  eheSound.volume = 0.7;
  extraEheSound.volume = 0.7;

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const x = e.clientX;
    const y = e.clientY;
    const size = Math.round((0.9 + Math.random() / 5) * 100) / 100; // between 0.9 and 1.1, 2 decimals
    const rare = images.length <= 3 ? false : Math.random() < 0.9 ? false : true; // first 3 cant be rare
    if (!rare) {
      eheSound
        .play()
        .then(() => {})
        .catch((err) => {
          console.log("audio playback error", err);
        });
    } else {
      extraEheSound
        .play()
        .then(() => {})
        .catch((err) => {
          console.log("audio playback error", err);
        });
    }

    setImages((prev) => [...prev, { x: x, y: y, size: size, rare: rare }]);
  };

  useFavicon("/favicon.ico");

  return (
    <div onClick={handleClick} className="w-screen h-screen relative bg-[url(/ehe/background.png)]">
      {images.map((coord, idx) => {
        const src = coord.rare ? "/ehe/EXTRAEHE.png" : "/ehe/EHE.png";
        const size = coord.rare ? coord.size : coord.size / 1.2;
        return (
          <img
            key={idx}
            src={src}
            alt="EHE"
            className="absolute -translate-1/2 pointer-events-none"
            style={{ left: coord.x, top: coord.y, transform: `scale(${size})` }}></img>
        );
      })}
    </div>
  );
}
