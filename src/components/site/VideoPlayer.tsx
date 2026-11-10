"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { X } from "lucide-react";
import { lenis } from "@/components/motion/SmoothScroll";

gsap.registerPlugin(useGSAP);

export type Video = {
  id: string;
  name: string;
  thumb: string;
  /** an upright Short: played in a 9:16 frame */
  vertical?: boolean;
  /** a player URL to use instead of YouTube's (e.g. a Vimeo embed) */
  src?: string;
};

/**
 * YouTube player overlay: a white, blurred backdrop with the video centred
 * (in a 9:16 frame for upright Shorts).
 * Closes on Esc, the close button, or a click outside the video; Lenis is
 * paused while it is open so the page underneath doesn't scroll.
 */
export function VideoPlayer({ video, onClose }: { video: Video; onClose: () => void }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    lenis?.stop();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  useGSAP(
    () => {
      gsap.fromTo(root.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.35, ease: "power2.out" });
      gsap.fromTo("[data-frame]", { y: 40, scale: 0.94 }, { y: 0, scale: 1, duration: 0.7, ease: "expo.out" });
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      role="dialog"
      aria-modal="true"
      aria-label={`Video: ${video.name}`}
      onClick={onClose}
      className="fixed inset-0 z-[100] grid place-items-center bg-white/85 p-4 backdrop-blur-md sm:p-10"
    >
      <div
        data-frame
        className={video.vertical ? "relative" : "relative w-full max-w-[1100px]"}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close video"
          className="absolute -top-12 right-0 grid size-10 place-items-center rounded-[6px] bg-ink text-white transition-colors hover:bg-accent"
        >
          <X size={18} strokeWidth={2} />
        </button>
        <div
          className={`overflow-hidden rounded-[6px] bg-ink shadow-[0_40px_80px_-30px_rgba(11,13,18,0.6)] ${
            video.vertical
              ? "aspect-[9/16] h-[min(78svh,760px)] max-w-[calc(100vw-2rem)]"
              : "aspect-video"
          }`}
        >
          <iframe
            src={video.src ?? `https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`}
            title={video.name}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            className="size-full"
          />
        </div>
      </div>
    </div>
  );
}
