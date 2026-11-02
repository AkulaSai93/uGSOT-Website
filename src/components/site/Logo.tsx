import Image from "next/image";
import Link from "next/link";

/**
 * Official upGrad School of Technology lockup (467x144).
 *
 * Only one variant is published on the CDN and its "School of Technology"
 * wordmark is white, for use on a dark header. Our nav is white, so
 * public/images/logo-sot.png is that artwork with the white wordmark
 * recoloured to near-black; the red mark is untouched.
 * logo-sot-white.png keeps the original for any dark section later.
 */
export function Logo({
  className = "",
  onDark = false,
}: {
  className?: string;
  onDark?: boolean;
}) {
  return (
    <Link
      href="/"
      aria-label="upGrad School of Technology — home"
      className={`inline-flex items-center ${className}`}
    >
      <Image
        src={onDark ? "/images/logo-sot-white.png" : "/images/logo-sot.png"}
        alt="upGrad School of Technology"
        width={467}
        height={144}
        priority
        className="h-[32px] w-auto"
      />
    </Link>
  );
}
