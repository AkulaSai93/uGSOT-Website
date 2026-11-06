"use client";

import { useEffect, useRef } from "react";

/**
 * A muted, looping background video that costs nothing until it is needed:
 * nothing is downloaded at page load (preload="none", no autoplay); the poster
 * shows straight away, the film starts once the video comes within ~300px of
 * the screen, and pauses again when it leaves.
 *
 * `sources` are tried in order; give each an optional `media` query to send
 * phones a lighter file.
 */
export function LazyVideo({
  sources,
  poster,
  className = "",
}: {
  sources: { src: string; type?: string; media?: string }[];
  poster?: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { rootMargin: "300px 0px" },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="none"
      poster={poster}
      className={className}
    >
      {sources.map((s) => (
        <source key={s.src} src={s.src} type={s.type ?? "video/mp4"} media={s.media} />
      ))}
    </video>
  );
}
