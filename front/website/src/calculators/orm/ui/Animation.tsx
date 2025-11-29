import { useEffect, useRef } from "react";
import lottie, { AnimationItem } from "lottie-web/build/player/lottie_light";

export function Snake() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animation: AnimationItem;
    if (containerRef.current) {
      animation = lottie.loadAnimation({
        container: containerRef.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: "/orm/snake.json"
      });
    }

    return () => { animation.destroy() };
  }, [containerRef]);

  return (
    <div
      ref={containerRef}
      style={{ width: 50, height: 50, margin: 0 }}
    />
  );
}