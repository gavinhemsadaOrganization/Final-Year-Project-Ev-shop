import { useState, useEffect, useRef } from "react";

interface ReverseLoopVideoProps {
  forward: string;
  backward: string;
  duration?: number; // how long each video runs before switch
}

export default function ReverseLoopVideo({
  forward,
  backward,
  duration = 37000,
}: ReverseLoopVideoProps) {
  const [isReversed, setIsReversed] = useState(false);
  const forwardRef = useRef<HTMLVideoElement | null>(null);
  const backwardRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    // autoplay once video metadata is loaded
    const playVideos = async () => {
      try {
        await forwardRef.current?.play();
        await backwardRef.current?.play();
      } catch (err) {
        console.warn("Autoplay blocked by browser:", err);
      }
    };
    playVideos();

    const timer = setInterval(() => setIsReversed((prev) => !prev), duration);
    return () => clearInterval(timer);
  }, [duration]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      {/* Forward video */}
      <video
        ref={forwardRef}
        src={forward}
        muted
        loop
        playsInline
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
          isReversed ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* Backward video */}
      <video
        ref={backwardRef}
        src={backward}
        muted
        loop
        playsInline
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
          isReversed ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
