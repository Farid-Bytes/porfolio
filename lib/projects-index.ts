/**
 * Slim project cards for client listings (home strip, /projects, hero teaser).
 * Full story / architecture data lives in `lib/projects.ts` (server detail pages).
 */
export type ProjectCard = {
  slug: string;
  name: string;
  label: string;
  tagline: string;
  coverImage: string;
  repository?: string;
  stack: readonly string[];
  featured?: boolean;
};

export const projectCards: readonly ProjectCard[] = [
  {
    slug: "voicepulse-ai",
    name: "VoicePulse AI",
    label: "Flagship project",
    tagline: "Intelligent Call Center Analytics & Performance Review Platform",
    coverImage: "/projects/voicepulse-ai.webp",
    repository: "https://github.com/Farid-Bytes/voicepulse-ai",
    featured: true,
    stack: ["FastAPI", "WhisperX", "pyannote.audio", "Librosa"],
  },
  {
    slug: "fleettrack",
    name: "FleetTrack",
    label: "Systems project",
    tagline: "Fleet Management & Vehicle Tracking System",
    coverImage: "/projects/fleettrack.webp",
    stack: ["GPS devices", "Traccar", "Backend API", "DigitalOcean"],
  },
  {
    slug: "course-finder",
    name: "Course Finder",
    label: "Discovery platform",
    tagline: "Education Search & Discovery System",
    coverImage: "/projects/course-finder.webp",
    stack: ["FastAPI", "MySQL", "Separate frontend"],
  },
  {
    slug: "campus-admin-agent",
    name: "Campus Admin Agent",
    label: "Agent system",
    tagline: "Campus operations assistant with tools and RAG",
    coverImage: "/projects/campus-admin-agent.webp",
    repository: "https://github.com/Farid-Bytes/campus_admin_agent",
    stack: ["FastAPI", "MongoDB", "OpenAI", "RAG"],
  },
  {
    slug: "flightmate",
    name: "FlightMate",
    label: "AI assistant",
    tagline: "Natural-language flight check and booking backend",
    coverImage: "/projects/flightmate.webp",
    repository: "https://github.com/Farid-Bytes/flightmate_backend",
    stack: ["FastAPI", "Poetry", "DeepSeek", "Groq"],
  },
  {
    slug: "university-registration",
    name: "University Registration API",
    label: "API project",
    tagline: "Student registration system with FastAPI",
    coverImage: "/projects/university-registration.webp",
    repository: "https://github.com/Farid-Bytes/University_registration_api",
    stack: ["FastAPI", "Poetry", "Python", "REST API"],
  },
  {
    slug: "laravel-ecommerce",
    name: "Laravel Ecommerce",
    label: "Full-stack store",
    tagline: "Catalog, cart, and checkout in Laravel",
    coverImage: "/projects/laravel-ecommerce.webp",
    repository: "https://github.com/Farid-Bytes/laravel-ecommerce-store",
    stack: ["Laravel", "PHP", "MySQL", "Blade"],
  },
  {
    slug: "atmos",
    name: "ATMOS",
    label: "Weather chatbot",
    tagline: "Weather dashboard with an AI chat assistant",
    coverImage: "/projects/atmos.webp",
    repository: "https://github.com/Farid-Bytes/Weather_app",
    stack: ["React", "Vite", "FastAPI", "Groq"],
  },
] as const;

/** Flagship project — used by the home hero teaser. */
export const voicePulseProject = projectCards[0];
