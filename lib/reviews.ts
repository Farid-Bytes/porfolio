export type Review = {
  id: string;
  quote: string;
  name: string;
};

/**
 * Placeholder client testimonials for presentation. Edit freely:
 * names are invented for design purposes.
 */
export const reviews: readonly Review[] = [
  {
    id: "r1",
    quote:
      "Ghulam turned a messy manual intake process into a reliable automation pipeline. We shipped the first version in weeks, not months.",
    name: "Ayesha Khan",
  },
  {
    id: "r2",
    quote:
      "Clear communication and solid engineering. The API integrations just worked, and our ops team actually uses the tools every day.",
    name: "Omar Hassan",
  },
  {
    id: "r3",
    quote:
      "He understood our product constraints quickly and built an agent workflow that felt production-ready from day one.",
    name: "Fatima Zahra",
  },
  {
    id: "r4",
    quote:
      "Rare mix of AI curiosity and backend discipline. Voice-related analysis prototypes moved into a maintainable service without drama.",
    name: "Daniel Brooks",
  },
  {
    id: "r5",
    quote:
      "We needed someone who could connect models to real systems. Ghulam delivered a clean FastAPI layer and documentation we could hand off.",
    name: "Bilal Ahmed",
  },
  {
    id: "r6",
    quote:
      "Professional, responsive, and focused on outcomes. Our automation cut repetitive support triage work significantly.",
    name: "Maryam Siddiqui",
  },
  {
    id: "r7",
    quote:
      "He translated fuzzy founder ideas into a concrete architecture: agents, APIs, and a dashboard our team can trust.",
    name: "Yusuf Rahman",
  },
  {
    id: "r8",
    quote:
      "Strong Python fundamentals and thoughtful trade-offs. The system was easy to extend after the engagement ended.",
    name: "Sarah Mitchell",
  },
  {
    id: "r9",
    quote:
      "From discovery to deployment, everything was organized. We finally have reliable automations instead of fragile scripts.",
    name: "Hassan Ali",
  },
  {
    id: "r10",
    quote:
      "Exactly the partner you want when AI has to meet production constraints: pragmatic, careful, and fast when it counts.",
    name: "Zainab Iqbal",
  },
] as const;
