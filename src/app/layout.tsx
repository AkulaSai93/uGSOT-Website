import type { Metadata } from "next";
import { Instrument_Serif, Plus_Jakarta_Sans } from "next/font/google";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import "lenis/dist/lenis.css";
import "./globals.css";

/** Plus Jakarta Sans, 400–800: body copy and the display type. */
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

/** Editorial accent: Instrument Serif italic, used for single words only. */
const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI-First B.Tech in Computer Science | upGrad School of Technology",
  description:
    "A four-year residential B.Tech in Computer Science built for the AI era — Quantum Computing, GenAI & ML, Full Stack Development and Cloud Innovation. Admissions open via uGNET.",
};

/* Marks <html> as JS-enabled before first paint, so reveal-on-load elements can
   start hidden without ever hiding content from no-JS visitors. */
const JS_FLAG = "document.documentElement.classList.add('js')";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${instrument.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: JS_FLAG }} />
      </head>
      <body className="flex min-h-full flex-col bg-white">
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
