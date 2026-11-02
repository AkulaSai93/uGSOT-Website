"use client";

/**
 * Ecosystem card fan — implemented from Figma node 98:9582.
 *
 * Every number below is taken from the design: the group is a fixed
 * 859.25 x 206.29 arrangement of six overlapping cards, each with its own
 * offset, bounding box, card size, corner radius and rotation. Cards use the
 * design's asymmetric stroke (1px top/left, 4px bottom/right, black), which is
 * what gives them the stickered, lifted edge.
 *
 * The whole group scales as one unit (--fs) so the arrangement is preserved at
 * every width instead of reflowing, and the wrapper reserves the scaled height.
 *
 * Images keep the design's crop: each sits in a fixed box centred with the
 * design's offsets, and the inner <img> repeats the design's percentage crop.
 */
type Card = {
  name: string;
  file: string;
  /** offset + bounding box of the rotated card, from the design */
  ml: number;
  mt: number;
  bw: number;
  bh: number;
  rotate: number;
  /** the card face */
  cw: number;
  ch: number;
  radius: number;
  /** the image slot inside the face */
  iw: number;
  ih: number;
  dx: number;
  dy: number;
  /** the design's crop on the image itself; omitted = object-cover, full bleed */
  crop?: { w: string; h: string; left: string; top: string };
};

const CARDS: Card[] = [
  {
    name: "upGrad",
    file: "fig-upgrad.png",
    ml: 0,
    mt: 0.06,
    bw: 206.227,
    bh: 206.225,
    rotate: -27,
    cw: 153.33,
    ch: 153.326,
    radius: 22.439,
    iw: 73.472,
    ih: 86.507,
    dx: 0.84,
    dy: 2.45,
    crop: { w: "151.21%", h: "108.9%", left: "-25.81%", top: "-1.71%" },
  },
  {
    name: "Internshala",
    file: "fig-internshala.png",
    ml: 157.7,
    mt: 13,
    bw: 156.142,
    bh: 156.138,
    rotate: -3,
    cw: 148.57,
    ch: 148.566,
    radius: 21.742,
    iw: 120.344,
    ih: 36.652,
    dx: 1.88,
    dy: 0.58,
    crop: { w: "125.55%", h: "232.12%", left: "-12.8%", top: "-69.52%" },
  },
  {
    name: "upGrad Enterprise",
    file: "fig-enterprise.png",
    ml: 288.7,
    mt: 0,
    bw: 188.642,
    bh: 188.639,
    rotate: 12,
    cw: 159.05,
    ch: 159.046,
    radius: 23.276,
    iw: 89.74,
    ih: 89.74,
    dx: 1.91,
    dy: 0.52,
  },
  {
    name: "upGrad Abroad",
    file: "fig-abroad.png",
    ml: 426.7,
    mt: 6,
    bw: 182.752,
    bh: 182.749,
    rotate: -13,
    cw: 152.38,
    ch: 152.376,
    radius: 22.3,
    iw: 122.743,
    ih: 37.201,
    dx: 1.89,
    dy: 0.56,
    crop: { w: "102.74%", h: "338.98%", left: "-1.88%", top: "-114.69%" },
  },
  {
    name: "upGrad Rekrut",
    file: "fig-rekrut.png",
    ml: 545.7,
    mt: 2,
    bw: 190.812,
    bh: 190.809,
    rotate: 18,
    cw: 151.43,
    ch: 151.426,
    radius: 22.16,
    iw: 121.797,
    ih: 61.568,
    dx: 10.56,
    dy: -1.77,
    crop: { w: "105.49%", h: "117.39%", left: "-2.93%", top: "-14.49%" },
  },
  {
    name: "upGrad KnowledgeHut",
    file: "fig-knowledgehut.png",
    ml: 705.3,
    mt: 28.61,
    bw: 153.946,
    bh: 153.942,
    rotate: 0.96,
    cw: 151.43,
    ch: 151.426,
    radius: 22.16,
    iw: 123.792,
    ih: 44.488,
    dx: 1.89,
    dy: 0.41,
  },
];

const GROUP_W = 859.25;
const GROUP_H = 206.29;

/** design px -> container-query width units, so the whole group scales as one */
const cq = (px: number) => `${((px * 100) / GROUP_W).toFixed(4)}cqw`;

export function EcosystemCards() {
  return (
    <div
      className="mx-auto w-full"
      style={{ maxWidth: GROUP_W, containerType: "inline-size" }}
    >
      <ul className="relative w-full" style={{ height: cq(GROUP_H) }}>
        {CARDS.map((c) => (
          <li
            key={c.name}
            className="group absolute flex items-center justify-center hover:z-20"
            style={{
              left: cq(c.ml),
              top: cq(c.mt),
              width: cq(c.bw),
              height: cq(c.bh),
            }}
          >
            {/* translateY sits left of rotate so the card lifts straight up in
                the group's space rather than along its own tilted axis. */}
            <div
              className="flex-none transition-transform duration-300 ease-out [transform:translateY(var(--lift,0px))_rotate(var(--rot))_scale(var(--sc,1))] group-hover:[--lift:-13px] group-hover:[--sc:1.045]"
              style={{ ["--rot" as string]: `${c.rotate}deg` }}
            >
              <div
                className="relative overflow-clip border-solid border-black bg-white transition-shadow duration-300 group-hover:shadow-[0_14px_26px_-10px_rgba(11,13,18,0.32)]"
                style={{
                  width: cq(c.cw),
                  height: cq(c.ch),
                  borderRadius: cq(c.radius),
                  borderTopWidth: cq(1),
                  borderLeftWidth: cq(1),
                  borderRightWidth: cq(4.5),
                  borderBottomWidth: cq(4.5),
                }}
              >
                <div
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{
                    width: cq(c.iw),
                    height: cq(c.ih),
                    left: `calc(50% + ${cq(c.dx)})`,
                    top: `calc(50% + ${cq(c.dy)})`,
                  }}
                >
                  {c.crop ? (
                    <div className="pointer-events-none absolute inset-0 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`/images/ecosystem/${c.file}`}
                        alt={c.name}
                        className="absolute max-w-none"
                        style={{
                          width: c.crop.w,
                          height: c.crop.h,
                          left: c.crop.left,
                          top: c.crop.top,
                        }}
                      />
                    </div>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`/images/ecosystem/${c.file}`}
                      alt={c.name}
                      className="pointer-events-none absolute inset-0 size-full max-w-none object-cover"
                    />
                  )}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
