/**
 * Videos from upGrad School of Technology's own YouTube channel
 * (@upGradSchoolofTechnology, channel UCh74gkhPCTm0wOMPlMeW36A), taken from
 * its public upload feed on 6 Nov 2026: each video's id and its title as
 * published. Thumbnails are the channel's own (the Shorts' upright 1080x1920
 * frames and the films' 1280x720 ones), saved to public/images/channel-v2 as
 * WebP. Refresh this list when the channel posts new clips.
 */
export type ChannelVideo = {
  id: string;
  title: string;
  /** a Short (upright, 9:16) or a film (16:9) */
  short: boolean;
  /** who is speaking, for the leadership clips */
  speaker?: "ronnie" | "vishwa";
};

export const SPEAKERS = {
  ronnie: { name: "Ronnie Screwvala", role: "Co-founder, upGrad" },
  vishwa: { name: "Vishwa Mohan", role: "CEO, upGrad School of Technology" },
} as const;

export const thumb = (v: ChannelVideo) => `/images/channel-v2/${v.id}.webp`;

/** sessions with upGrad's leadership, speaking to students on campus */
export const MENTOR_CLIPS: ChannelVideo[] = [
  { id: "TYzY3MenxZs", short: true, speaker: "ronnie", title: "Why Engineers Are Being Told to Learn Carpentry" },
  { id: "T5QwtXlf02Y", short: true, speaker: "vishwa", title: "Stop Waiting for Final Year to Build Your Tech Career!" },
  { id: "nmkaBg-KMRE", short: true, speaker: "ronnie", title: "The Brutal Truth About Staying Relevant" },
  { id: "hYx1y8ilkWo", short: true, speaker: "vishwa", title: "Why you need to learn Quantum Computing BEFORE it blows up!" },
  { id: "ge_-IHtkR1g", short: true, speaker: "ronnie", title: "Why funding should come FIFTH, not first." },
  { id: "u8ZfbPeh99o", short: true, speaker: "vishwa", title: "Want to survive and win in today’s hyper-competitive tech market?" },
  { id: "yDvDHtcUbFQ", short: true, speaker: "ronnie", title: "“Today, this ‘safe’ word is unsafe.”" },
  { id: "5DWrPaPIPko", short: true, speaker: "ronnie", title: "If your education only prepares you for today's market, you are already falling behind." },
];

/** campus life: the orientation films and the students' own moments */
export const CAMPUS_CLIPS: ChannelVideo[] = [
  { id: "LUiEPZiMc6M", short: true, title: "Founding Batch 2026–2030: Officially kicked off!" },
  { id: "jRfmRHlXCwc", short: false, title: "Orientation Week at upGrad School of Technology | Pune Campus" },
  { id: "rnMH5swIn94", short: true, title: "What a real student coding battle looks like!" },
  { id: "jVN5XiXOiPU", short: true, title: "From discovering college via YouTube & podcasts to day one on campus" },
  { id: "pGNNmfn8n6o", short: false, title: "Orientation Week at upGrad School of Technology | SSAHE Campus" },
  { id: "sEF2j8xC91w", short: true, title: "“If you knew how AI worked, what would you build?”" },
  { id: "rzz5yDiSXhg", short: true, title: "Grateful for the trust this community places in us every single day." },
];
