export type Person = {
  name: string;
  role: string;
  image: string;
  /** Intrinsic image size. */
  size: [number, number];
  /**
   * Framing so every head sits at the same height and scale (matched to Sherdil's photo):
   * width/left as % of the frame width, top as % of the frame height.
   */
  frame: { w: number; left: number; top: number };
  linkedin?: string;
};

export const founders: Person[] = [
  {
    name: "Muhammad Mujtaba Rehman",
    role: "Founder & CEO",
    image: "/images/mujtaba-removebg-preview.png",
    size: [447, 558],
    frame: { w: 100.1, left: -1.0, top: 6.6 },
    linkedin: "https://www.linkedin.com/in/muhammad-mujtaba-rehman/",
  },
  {
    name: "Uzair Hussan Pasha",
    role: "Co-Founder & CTO",
    image: "/images/pasha-new.png",
    size: [1024, 1279],
    frame: { w: 99.1, left: 1.5, top: 6.7 },
    linkedin: "https://www.linkedin.com/in/uzair-hussan-pasha-4481481a2/",
  },
];

export const team: Person[] = [
  { name: "Sherdil Lodhi", role: "Technical Team Lead", image: "/images/sherdil.png", size: [1055, 1078], frame: { w: 98.3, left: -0.8, top: 19.7 } },
  { name: "Mubashar Hussain", role: "Senior Software Engineer", image: "/images/mubashir.png", size: [1159, 1397], frame: { w: 107.3, left: -1.2, top: 17.5 } },
  { name: "Muhammad Adil", role: "Associate Software Engineer", image: "/images/adil.png", size: [1086, 1448], frame: { w: 85.1, left: 9.3, top: 18.1 } },
  { name: "Ahmad Riaz", role: "Associate Software Engineer & Creative Technologist", image: "/images/ahmad.png", size: [1210, 1336], frame: { w: 103.1, left: -1.6, top: 18.0 } },
  { name: "Makshaf Rehman", role: "Sales Executive", image: "/images/Makshaf.png", size: [1194, 1075], frame: { w: 137.8, left: -16.3, top: 18.1 } },
];
