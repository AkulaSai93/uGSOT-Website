/**
 * The campus pages' content, one entry per partner university. Everything here
 * is sot.upgrad.com's own, taken from its university page (for SSAHE,
 * sot.upgrad.com/university/ssahe, read on 10 Nov 2026): the programme's name
 * and lines, its approvals, the eligibility and the university's facts. Add a
 * campus by adding an entry (and its film and picture); the route
 * /university/[slug] is generated from this list.
 */
export type Campus = {
  slug: string;
  /** the university's name as the site writes it */
  name: string;
  short: string;
  location: string;
  /** the programme, split for the heading: lead-in, accent words, tail */
  programme: { lead: string; accent: string; tail?: string };
  tracks: string[];
  approvals: string[];
  /** the campus film (Vimeo, played as a silent background) */
  vimeo: string;
  /** a still of the campus, shown behind the hero until the film starts */
  poster: string;
  facts: { label: string; value: string; note: string }[];
  /** the university page's own "about" copy, a paragraph each */
  about: string[];
  /** the university page's films (Vimeo), the first the main one; their
   *  titles are the ones on their thumbnails */
  videos: { title: string; vimeo: string; thumb: string }[];
  /** the campus, a group at a time (academic, wellness, living, sports):
   *  three places each, with the university page's photo and line */
  facilities: {
    group: string;
    items: { title: string; text: string; img: string }[];
  }[];
  /** the programme fee table, as the university page gives it: per semester,
   *  its components and its total */
  fees: {
    intro: string;
    semesters: {
      sem: number;
      items: { label: string; amount: string }[];
      total: string;
    }[];
  };
  /** hostels, as the university page gives them: per hostel, a card per room */
  hostel: {
    title: string;
    lead: string;
    groups: {
      name: string;
      basis: string;
      rooms: {
        occupancy: string;
        nonAc: string;
        ac: string;
        acNote?: string;
        location?: string;
        washroom: string;
      }[];
      included: string[];
    }[];
    laundry: { title: string; free: string; paid: string };
    common: { title: string; items: string[] }[];
    note: string;
  };
  /** accreditations and rankings: the figure shown large (a rank is a number,
   *  counted up), what it is, and who gave it */
  recognitions: {
    kind: "Accreditation" | "Ranking";
    figure: string | number;
    title: string;
    by: string;
  }[];
};

export const CAMPUSES: Campus[] = [
  {
    slug: "ssahe",
    name: "Sri Siddhartha Academy of Higher Education",
    short: "SSAHE",
    location: "Tumkuru (Outer Bangalore), Karnataka",
    programme: {
      lead: "B.E in",
      accent: "Computer Science and Engineering",
      tail: "(AI & ML)",
    },
    tracks: ["GenAI & ML", "Quantum Computing", "Full Stack Development"],
    approvals: ["UGC Recognized", "AICTE Approved", "NAAC A+ Accredited"],
    vimeo: "1145880959",
    poster: "/images/campuses/ssahe.webp",
    facts: [
      { label: "Duration", value: "4 Years", note: "8 semesters" },
      { label: "Campus", value: "70+ acres", note: "Green campus, Tumkuru" },
      {
        label: "Eligibility",
        value: "12th PCM, 50%+",
        note: "ICSE, CBSE, state or any recognized board",
      },
      { label: "Age", value: "Below 20 years", note: "As of July 2026" },
    ],
    about: [
      "Sri Siddhartha Academy of Higher Education (SSAHE) is a university built on over four decades of academic excellence, nestled on a sprawling 70+ acre green campus in Tumkuru, Karnataka. Since its inception, SSAHE has grown into one of the most comprehensive and respected academic ecosystems in South India, home to 85+ institutions spanning engineering, medicine, dentistry, and management.",
      "The university has a dedicated Entrepreneurship Development Cell and the Siddhartha Incubation Center, where students are actively encouraged to think like founders, take risks, and turn their ideas into reality. A strong record of performance in national-level hackathons further reflects the university's commitment to nurturing students who build technology. SSAHE also boasts a powerful alumni network of over 45,000 engineers, 8,000 doctors, and 2,000 dentists.",
    ],
    videos: [
      { title: "Virtual Tour", vimeo: "1145880959", thumb: "video-main" },
      {
        title: "The Student POV",
        vimeo: "1145870265",
        thumb: "video-academic",
      },
      {
        title: "3D Building Tour",
        vimeo: "1145871037",
        thumb: "video-funding",
      },
      {
        title: "Extracurriculars at SSAHE",
        vimeo: "1145870744",
        thumb: "video-portfolio",
      },
    ],
    fees: {
      intro:
        "View detailed course fees and explore flexible financing options through leading Indian banks and education platforms.",
      semesters: [
        {
          sem: 1,
          items: [
            { label: "Seat Block Fee", amount: "₹50,000" },
            { label: "Refundable Caution Amount", amount: "₹50,000" },
            { label: "Tuition Fees", amount: "₹2,00,000" },
          ],
          total: "₹3L",
        },
        ...[2, 3, 4, 5, 6, 7, 8].map((sem) => ({
          sem,
          items: [{ label: "Tuition Fees", amount: "₹2,50,000" }],
          total: "₹2.5L",
        })),
      ],
    },
    hostel: {
      title: "Hostel & Accommodation",
      lead: "Boys & girls fee tables, meals, laundry & common facilities",
      groups: [
        {
          name: "Boys",
          basis: "Fee Structure (per year, + applicable taxes)",
          rooms: [
            {
              occupancy: "4 Sharing",
              nonAc: "₹99,000",
              ac: "₹1,25,000",
              location: "On-Campus (SSIT)",
              washroom: "Common washrooms per floor",
            },
            {
              occupancy: "Twin Sharing",
              nonAc: "₹1,10,000",
              ac: "₹1,35,000",
              location: "Off-Campus (~2 km from SSIT)",
              washroom: "Shared — 1 washroom for 2 occupants",
            },
            {
              occupancy: "Single",
              nonAc: "₹1,25,000",
              ac: "₹1,75,000",
              location: "Off-Campus (~2 km from SSIT)",
              washroom: "—",
            },
          ],
          included: [
            "4 meals per day (Breakfast, Lunch, Evening Snacks & Dinner)",
            "Individual bed, study table, chair, and personal cupboard per student",
          ],
        },
        {
          name: "Girls",
          basis: "Fee Structure (per year, + applicable taxes)",
          rooms: [
            {
              occupancy: "4 Sharing",
              nonAc: "₹99,000",
              ac: "₹1,25,000",
              washroom: "Common washrooms per floor",
            },
            {
              occupancy: "Twin Sharing",
              nonAc: "₹1,10,000",
              ac: "₹1,75,000",
              acNote: "(two separate rooms within a unit)",
              washroom: "Shared — 1 washroom for 2 occupants",
            },
          ],
          included: [
            "4 meals per day (Breakfast, Lunch, Evening Snacks & Dinner)",
            "Individual bed, study table, chair, and personal cupboard per student",
          ],
        },
      ],
      laundry: {
        title: "Laundry — washing machines are free",
        free: "Washing machines are available on every floor at no charge for self-use by all residents.",
        paid: "Optional Paid Laundry Service: Wash + iron, with 48-hour turnaround — ₹6,000 per year (+ applicable taxes), covering 30 loads (5 kg per load). This service is entirely optional.",
      },
      common: [
        {
          title: "Boys & Girls Hostels",
          items: [
            "Dedicated drying area for laundry",
            "Free washing machines available on every floor",
            "Cafeteria with extended hours",
            "Daily housekeeping — rooms and common areas",
            "WiFi",
            "RO drinking water",
            "Dedicated personal storage space for extra luggage",
            "Dedicated university bus service for daily commute to and from campus",
          ],
        },
        {
          title: "Girls' Hostels Only",
          items: [
            "Dedicated drying area for clothes within the unit",
            "Sanitary pad dispenser for emergency use",
          ],
        },
      ],
      note: "Note: All fees are subject to applicable GST and other taxes. Hostel availability is on a first-come-first-served basis, subject to capacity and allocation.",
    },
    facilities: [
      {
        group: "Academic",
        items: [
          {
            title: "Collaborative study space",
            text: "A hub for students to collaborate and study together.",
            img: "academic1",
          },
          {
            title: "Lecture hall",
            text: "Modern auditoriums equipped with advanced audio-visual technology systems.",
            img: "academic2",
          },
          {
            title: "Digital Library",
            text: "Extensive collection of books and digital resources for comprehensive learning.",
            img: "academic3",
          },
        ],
      },
      {
        group: "Wellness & Fitness",
        items: [
          {
            title: "Clinic",
            text: "Advanced labs with professional-grade equipment and safety protocols for students.",
            img: "health1",
          },
          {
            title: "Boys Gym",
            text: "Fitness centre for boys hostel featuring strength training and cardio equipment.",
            img: "health2",
          },
          {
            title: "Girls Gym",
            text: "Fitness centre for girls hostel with strength and cardio equipment.",
            img: "health3",
          },
        ],
      },
      {
        group: "Campus Living",
        items: [
          {
            title: "Hostel exterior",
            text: "Comfortable 1- and 2-BHK sharing rooms for a safe, home-away-from-home community environment.",
            img: "housing1",
          },
          {
            title: "Academic Building",
            text: "Modern learning infrastructure designed for interdisciplinary academic programs.",
            img: "housing2",
          },
          {
            title: "Green Campus",
            text: "Campus gardens double as informal study and collaboration spaces.",
            img: "housing3",
          },
        ],
      },
      {
        group: "Sports",
        items: [
          {
            title: "Basketball Court",
            text: "Illuminated court enables year-round practice and competitive play.",
            img: "sports1",
          },
          {
            title: "Outdoor court",
            text: "Outdoor recreational spaces encourage teamwork and physical fitness.",
            img: "sports2",
          },
          {
            title: "Track field",
            text: "Professional-grade athletic tracks supporting training and campus sporting events.",
            img: "sports3",
          },
        ],
      },
    ],
    recognitions: [
      {
        kind: "Accreditation",
        figure: "A+",
        title: "NAAC A+ Accredited",
        by: "National Assessment and Accreditation Council",
      },
      {
        kind: "Accreditation",
        figure: "NBA",
        title: "NBA Accredited Programs",
        by: "National Board of Accreditation",
      },
      {
        kind: "Ranking",
        figure: 11,
        title: "in Private Deemed Universities (South)",
        by: "The Week 2025",
      },
      {
        kind: "Ranking",
        figure: 27,
        title: "in Top Private Engineering Colleges",
        by: "Outlook India 2025",
      },
      {
        kind: "Ranking",
        figure: 14,
        title: "in Top Private Medical Colleges",
        by: "Outlook India 2025",
      },
    ],
  },
];

export const campusBySlug = (slug: string) =>
  CAMPUSES.find((c) => c.slug === slug);
