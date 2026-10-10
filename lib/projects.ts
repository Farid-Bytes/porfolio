export type DiagramKind =
  | "pipeline"
  | "flow"
  | "layers"
  | "chat"
  | "map"
  | "store"
  | "rag";

export type OutlineScreenId =
  | "voicepulse-brand"
  | "voicepulse-dashboard"
  | "voicepulse-analysis"
  | "voicepulse-features"
  | "fleet-dashboard"
  | "fleet-vehicle"
  | "fleet-routes"
  | "fleet-playback"
  | "fleet-alerts"
  | "fleet-maintenance"
  | "fleet-picker"
  | "course-search"
  | "course-filters"
  | "course-detail"
  | "campus-chat"
  | "campus-tools"
  | "flight-chat"
  | "flight-check"
  | "flight-book"
  | "flight-cli"
  | "uni-form"
  | "uni-api"
  | "uni-confirm"
  | "shop-catalog"
  | "shop-cart"
  | "shop-checkout"
  | "shop-admin"
  | "atmos-dashboard"
  | "atmos-forecast"
  | "atmos-search"
  | "atmos-chat";

export type StoryNode = {
  id: string;
  label: string;
  sublabel?: string;
};

export type StoryEdge = {
  from: string;
  to: string;
  label?: string;
};

export type StoryMedia = {
  kind: "image";
  src: string;
  alt: string;
};

export type StoryPanel = {
  id: string;
  eyebrow: string;
  title: string;
  oneLiner: string;
  description: string;
  media: StoryMedia;
};

export type ShowcaseProject = {
  slug: string;
  number: string;
  name: string;
  label: string;
  tagline: string;
  summary: string;
  /** Public path to UI mockup cover used on poster cards. */
  coverImage: string;
  /** Public path to hero architecture/system mockup on the detail page. */
  heroImage: string;
  repository?: string;
  stack: readonly string[];
  featured?: boolean;
  meta: string;
  story: readonly StoryPanel[];
};

/**
 * Claims mirror public repositories and known system designs. The showcase
 * avoids scale, performance, and accuracy claims.
 */
export const projects: readonly ShowcaseProject[] = [
  {
    slug: "voicepulse-ai",
    number: "01",
    name: "VoicePulse AI",
    label: "Flagship project",
    tagline: "Intelligent Call Center Analytics & Performance Review Platform",
    summary:
      "A recorded-call analysis platform that turns uploaded conversations into speaker-aware transcripts, structured analytics, an AI-generated review, and practical coaching feedback.",
    coverImage: "/projects/voicepulse-ai.webp",
    heroImage: "/projects/voicepulse-ai/hero-architecture.jpg",
    repository: "https://github.com/Farid-Bytes/voicepulse-ai",
    featured: true,
    stack: [
      "FastAPI",
      "WhisperX",
      "pyannote.audio",
      "Librosa",
      "Transformers",
      "PyTorch",
      "NumPy",
      "VADER",
      "Groq",
    ],
    meta: "8-stage analysis pipeline",
    story: [
      {
        id: "brand",
        eyebrow: "Overview",
        title: "From conversations to insights",
        oneLiner: "Brand story and six core capabilities.",
        description:
          "VoicePulse positions call-center analytics around transcription, speaker ID, sentiment, emotion, performance review, and coaching—one product story from audio to action.",
        media: {
          kind: "image",
          src: "/projects/voicepulse-ai/overview.jpg",
          alt: "VoicePulse AI overview showing six core call analytics capabilities",
        },
      },
      {
        id: "dashboard",
        eyebrow: "Dashboard",
        title: "Call center performance at a glance",
        oneLiner: "KPIs, weekly trend, recent calls table.",
        description:
          "Operators see total calls, average rating, positive sentiment, escalations, a performance trend chart, and a recent-calls table for quick triage.",
        media: {
          kind: "image",
          src: "/projects/voicepulse-ai/dashboard.jpg",
          alt: "VoicePulse AI dashboard with KPIs, sentiment chart, and agent performance",
        },
      },
      {
        id: "analysis",
        eyebrow: "Call analysis",
        title: "Transcript, emotion, and coaching",
        oneLiner: "Waveform, speakers, sentiment, AI tips.",
        description:
          "Each call opens into waveform playback, agent/customer transcript turns, emotion and sentiment panels, an AI performance review, and a coaching tip.",
        media: {
          kind: "image",
          src: "/projects/voicepulse-ai/analysis.jpg",
          alt: "VoicePulse AI call analysis with transcript, emotion, and coaching tip",
        },
      },
      {
        id: "pipeline",
        eyebrow: "Architecture",
        title: "AI pipeline from audio to report",
        oneLiner: "Diarize, transcribe, score, then LLM review.",
        description:
          "Recorded audio moves through diarization, Whisper transcription, emotion and sentiment scoring, then a Groq/LLM report that feeds the dashboard.",
        media: {
          kind: "image",
          src: "/projects/voicepulse-ai/pipeline.jpg",
          alt: "VoicePulse AI pipeline from call audio through diarization, WhisperX, emotion, sentiment, and Groq LLM report",
        },
      },
      {
        id: "features",
        eyebrow: "Features",
        title: "Capabilities and stack at a glance",
        oneLiner: "Upload, identity, signals, and tooling.",
        description:
          "Key product features sit beside the speech/AI stack—FastAPI, WhisperX, pyannote, Librosa, and Groq—so the case study shows both UX and implementation.",
        media: {
          kind: "image",
          src: "/projects/voicepulse-ai/features.jpg",
          alt: "VoicePulse AI key features and speech AI tech stack",
        },
      },
    ],
  },
  {
    slug: "fleettrack",
    number: "02",
    name: "FleetTrack",
    label: "Systems project",
    tagline: "Fleet Management & Vehicle Tracking System",
    summary:
      "A vehicle-tracking system that moves GPS device data through Traccar into a backend/API and a dashboard interface. The backend is deployed on DigitalOcean and consumes Traccar server data.",
    coverImage: "/projects/fleettrack.webp",
    heroImage: "/projects/fleettrack/hero-architecture.jpg",
    stack: [
      "GPS devices",
      "Traccar",
      "Backend API",
      "DigitalOcean",
      "Tracking dashboard",
    ],
    meta: "GPS → Traccar → API → dashboard",
    story: [
      {
        id: "dashboard",
        eyebrow: "Dashboard",
        title: "Fleet health in one portal",
        oneLiner: "Active vehicles, fuel, distance, status.",
        description:
          "The portal dashboard summarizes active vehicles, fuel utilization, daily distance, and status charts so operators see the fleet before diving into maps.",
        media: {
          kind: "image",
          src: "/projects/fleettrack/dashboard.jpg",
          alt: "FleetTrack portal dashboard with fleet health KPIs and status charts",
        },
      },
      {
        id: "vehicle",
        eyebrow: "My vehicle",
        title: "Single-vehicle detail",
        oneLiner: "Render, mini-map, battery, efficiency.",
        description:
          "My Vehicle focuses one unit with a vehicle preview, local map, battery life, and efficiency so day-to-day status is readable at a glance.",
        media: {
          kind: "image",
          src: "/projects/fleettrack/vehicle.jpg",
          alt: "FleetTrack single-vehicle detail with map, battery, and efficiency",
        },
      },
      {
        id: "routes",
        eyebrow: "Trip routes",
        title: "Mapped trips and history",
        oneLiner: "Color-coded paths with trip list.",
        description:
          "Trip Routes overlays vehicle paths on a map beside a list of trip names, times, and distances for historical review.",
        media: {
          kind: "image",
          src: "/projects/fleettrack/routes.jpg",
          alt: "FleetTrack trip routes map with color-coded paths and trip list",
        },
      },
      {
        id: "playback",
        eyebrow: "Live playback",
        title: "Replay a trip on the map",
        oneLiner: "Path plus timeline scrub bar.",
        description:
          "Live Playback pairs a large map path with a trip scrub bar so operators can replay movement over time.",
        media: {
          kind: "image",
          src: "/projects/fleettrack/playback.jpg",
          alt: "FleetTrack live playback map with trip timeline scrub bar",
        },
      },
      {
        id: "alerts",
        eyebrow: "Alerts",
        title: "Critical and warning signals",
        oneLiner: "Overheating, low fuel, timestamps.",
        description:
          "Alerts lists operational events by severity—critical and warning—with timestamps so issues are not buried in raw telemetry.",
        media: {
          kind: "image",
          src: "/projects/fleettrack/alerts.jpg",
          alt: "FleetTrack alerts list with critical and warning severity signals",
        },
      },
      {
        id: "maintenance",
        eyebrow: "Maintenance",
        title: "Upcoming service and costs",
        oneLiner: "KPIs plus monthly maintenance trend.",
        description:
          "Maintenance Overview highlights upcoming jobs and cost signals with a trend chart for planning service windows.",
        media: {
          kind: "image",
          src: "/projects/fleettrack/maintenance.jpg",
          alt: "FleetTrack maintenance overview with upcoming jobs and cost trend",
        },
      },
      {
        id: "picker",
        eyebrow: "Fleet list",
        title: "Pick any vehicle",
        oneLiner: "Active / inactive status list.",
        description:
          "Vehicle Picker lists fleet units with clear active or inactive status before opening a detail view.",
        media: {
          kind: "image",
          src: "/projects/fleettrack/picker.jpg",
          alt: "FleetTrack vehicle picker listing active and inactive units",
        },
      },
      {
        id: "system",
        eyebrow: "Architecture",
        title: "GPS through Traccar into the API",
        oneLiner: "Devices → Traccar → DigitalOcean → UI.",
        description:
          "Field GPS devices report into Traccar; a backend API on DigitalOcean consumes that data and feeds the tracking portal.",
        media: {
          kind: "image",
          src: "/projects/fleettrack/system.jpg",
          alt: "FleetTrack system architecture from GPS devices through Traccar and DigitalOcean API to the tracking portal",
        },
      },
    ],
  },
  {
    slug: "course-finder",
    number: "03",
    name: "Course Finder",
    label: "Discovery platform",
    tagline: "Education Search & Discovery System",
    summary:
      "A separate frontend and FastAPI backend for searching and filtering listing-based education data in MySQL, designed around discovery across institutions, courses, and short courses.",
    coverImage: "/projects/course-finder.webp",
    heroImage: "/projects/course-finder/hero-architecture.jpg",
    stack: [
      "FastAPI",
      "MySQL",
      "Separate frontend",
      "Listing-based data",
      "Search & filters",
    ],
    meta: "Listings → MySQL → FastAPI → search",
    story: [
      {
        id: "search",
        eyebrow: "Search",
        title: "Discover institutions and courses",
        oneLiner: "Search bar and result cards.",
        description:
          "The discovery UI starts with search and listing cards so learners can scan institutions, courses, and short courses quickly.",
        media: {
          kind: "image",
          src: "/projects/course-finder/search.jpg",
          alt: "Course Finder search results with institution and course listing cards",
        },
      },
      {
        id: "filters",
        eyebrow: "Filters",
        title: "Narrow what matters",
        oneLiner: "Facet controls over the catalog.",
        description:
          "Filter facets refine by type, level, and institution so results stay relevant instead of dumping the full catalog.",
        media: {
          kind: "image",
          src: "/projects/course-finder/filters.jpg",
          alt: "Course Finder filter facets for type, level, and institution",
        },
      },
      {
        id: "detail",
        eyebrow: "Detail",
        title: "Course and school detail",
        oneLiner: "Structured fields from MySQL.",
        description:
          "A detail view surfaces structured listing fields for a single course or institution before the learner acts.",
        media: {
          kind: "image",
          src: "/projects/course-finder/detail.jpg",
          alt: "Course Finder course and institution detail with structured fields",
        },
      },
      {
        id: "data",
        eyebrow: "Data",
        title: "Listings shaped into MySQL",
        oneLiner: "Sources → schema → store.",
        description:
          "Listing sources are normalized into MySQL so institutions and courses share consistent queryable fields.",
        media: {
          kind: "image",
          src: "/projects/course-finder/data-pipeline.jpg",
          alt: "Course Finder data pipeline from listing sources through normalization into MySQL",
        },
      },
      {
        id: "api",
        eyebrow: "API",
        title: "FastAPI search endpoints",
        oneLiner: "Query and filter over MySQL.",
        description:
          "FastAPI exposes search and filter endpoints so the frontend stays decoupled from storage details.",
        media: {
          kind: "image",
          src: "/projects/course-finder/api.jpg",
          alt: "Course Finder FastAPI search flow from request through MySQL to JSON results",
        },
      },
    ],
  },
  {
    slug: "campus-admin-agent",
    number: "04",
    name: "Campus Admin Agent",
    label: "Agent system",
    tagline: "Campus operations assistant with tools and RAG",
    summary:
      "A FastAPI backend that combines MongoDB, OpenAI function calling, and retrieval-augmented generation so campus admins can ask natural-language questions and trigger structured tool actions.",
    coverImage: "/projects/campus-admin-agent.webp",
    heroImage: "/projects/campus-admin-agent/hero-architecture.jpg",
    repository: "https://github.com/Farid-Bytes/campus_admin_agent",
    stack: [
      "FastAPI",
      "MongoDB",
      "OpenAI",
      "Function calling",
      "RAG",
      "Sanity CMS",
      "Poetry",
    ],
    meta: "FastAPI · MongoDB · tools · RAG",
    story: [
      {
        id: "chat",
        eyebrow: "Chat",
        title: "Admin asks in natural language",
        oneLiner: "Chat console into FastAPI.",
        description:
          "Admins type natural-language questions into a chat surface that hits the FastAPI agent loop.",
        media: {
          kind: "image",
          src: "/projects/campus-admin-agent/chat.jpg",
          alt: "Campus Admin Agent chat console for natural-language campus questions",
        },
      },
      {
        id: "tools",
        eyebrow: "Tools",
        title: "Function-calling agent loop",
        oneLiner: "OpenAI selects and runs tools.",
        description:
          "The agent chooses campus tools via OpenAI function calling instead of inventing operational answers from text alone.",
        media: {
          kind: "image",
          src: "/projects/campus-admin-agent/tools.jpg",
          alt: "Campus Admin Agent function-calling tools for student and campus operations",
        },
      },
      {
        id: "mongo",
        eyebrow: "Store",
        title: "MongoDB operational records",
        oneLiner: "Models and db helpers.",
        description:
          "MongoDB backs operational data through models and db helpers shared by the agent and API.",
        media: {
          kind: "image",
          src: "/projects/campus-admin-agent/mongo.jpg",
          alt: "Campus Admin Agent MongoDB layer with models, db helpers, and collections",
        },
      },
      {
        id: "rag",
        eyebrow: "RAG",
        title: "Retrieve campus knowledge",
        oneLiner: "Sanity articles feed retrieval.",
        description:
          "RAG pulls relevant chunks—often from Sanity article schemas—so answers can cite campus knowledge.",
        media: {
          kind: "image",
          src: "/projects/campus-admin-agent/rag.jpg",
          alt: "Campus Admin Agent RAG flow from query and Sanity articles to retrieved context chunks",
        },
      },
      {
        id: "api",
        eyebrow: "API",
        title: "FastAPI as the control plane",
        oneLiner: "HTTP entry for agent workflows.",
        description:
          "FastAPI is the control plane: requests enter, tools and RAG run, and structured responses return to callers.",
        media: {
          kind: "image",
          src: "/projects/campus-admin-agent/api.jpg",
          alt: "Campus Admin Agent FastAPI control plane from HTTP clients through routes to the agent stack",
        },
      },
    ],
  },
  {
    slug: "flightmate",
    number: "05",
    name: "FlightMate",
    label: "AI assistant",
    tagline: "Natural-language flight check and booking backend",
    summary:
      "An AI-powered flight assistant backend built with FastAPI. It understands natural-language requests to check availability and book flights, with LLM providers such as DeepSeek, Gemini, and Groq plus a CLI chat mode.",
    coverImage: "/projects/flightmate.webp",
    heroImage: "/projects/flightmate/hero-architecture.jpg",
    repository: "https://github.com/Farid-Bytes/flightmate_backend",
    stack: [
      "FastAPI",
      "Poetry",
      "DeepSeek",
      "Gemini",
      "Groq",
      "CLI agent",
    ],
    meta: "NL query → agents → check / book",
    story: [
      {
        id: "chat",
        eyebrow: "Understand",
        title: "Natural-language flight intent",
        oneLiner: "Chat intake for routes and dates.",
        description:
          "Travelers type free-form requests; the backend parses route, timing, and whether the goal is check or book.",
        media: {
          kind: "image",
          src: "/projects/flightmate/chat.jpg",
          alt: "FlightMate natural-language chat intake for flight requests",
        },
      },
      {
        id: "check",
        eyebrow: "Check",
        title: "Availability agent",
        oneLiner: "Structured flight options reply.",
        description:
          "A check agent handles availability so route questions do not force a booking path.",
        media: {
          kind: "image",
          src: "/projects/flightmate/check.jpg",
          alt: "FlightMate availability results with structured flight options",
        },
      },
      {
        id: "book",
        eyebrow: "Book",
        title: "Booking agent",
        oneLiner: "Reservation confirmation flow.",
        description:
          "When the user wants to book, a booking agent takes over so reservation logic stays modular beside the check path.",
        media: {
          kind: "image",
          src: "/projects/flightmate/book.jpg",
          alt: "FlightMate booking confirmation with reservation summary",
        },
      },
      {
        id: "providers",
        eyebrow: "Models",
        title: "Multi-provider LLM wiring",
        oneLiner: "DeepSeek, Gemini, and Groq keys.",
        description:
          "Provider secrets load from environment variables so the same agent surface can switch models.",
        media: {
          kind: "image",
          src: "/projects/flightmate/providers.jpg",
          alt: "FlightMate multi-provider LLM wiring from environment keys through runtime to DeepSeek, Gemini, and Groq",
        },
      },
      {
        id: "cli",
        eyebrow: "CLI",
        title: "Terminal chat mode",
        oneLiner: "Poetry-run CLI agent loop.",
        description:
          "A CLI agent lets you converse in the terminal for quick availability and booking experiments.",
        media: {
          kind: "image",
          src: "/projects/flightmate/cli.jpg",
          alt: "FlightMate CLI terminal chat mode for availability and booking",
        },
      },
    ],
  },
  {
    slug: "university-registration",
    number: "06",
    name: "University Registration API",
    label: "API project",
    tagline: "Student registration system with FastAPI",
    summary:
      "A FastAPI service for student registration workflows—exposing registration endpoints so university systems can create and manage student records through a clean HTTP API.",
    coverImage: "/projects/university-registration.webp",
    heroImage: "/projects/university-registration/hero-architecture.jpg",
    repository: "https://github.com/Farid-Bytes/University_registration_api",
    stack: ["FastAPI", "Poetry", "Python", "REST API"],
    meta: "Student registration · FastAPI",
    story: [
      {
        id: "form",
        eyebrow: "Intake",
        title: "Registration payload form",
        oneLiner: "Student fields into the API.",
        description:
          "Registrar clients submit student registration fields so enrollment is an HTTP workflow, not a locked-in UI.",
        media: {
          kind: "image",
          src: "/projects/university-registration/form.jpg",
          alt: "University Registration form for student enrollment fields",
        },
      },
      {
        id: "validate",
        eyebrow: "Validate",
        title: "Request models and checks",
        oneLiner: "Reject bad data before write.",
        description:
          "Incoming payloads are validated through request models so incomplete data fails early with a clear response.",
        media: {
          kind: "image",
          src: "/projects/university-registration/validate.jpg",
          alt: "University Registration validation flow from raw HTTP JSON through request models to accepted payload",
        },
      },
      {
        id: "api",
        eyebrow: "Routes",
        title: "FastAPI registration surface",
        oneLiner: "REST handlers for enrollment.",
        description:
          "Poetry-managed FastAPI routes expose registration operations other university services can call.",
        media: {
          kind: "image",
          src: "/projects/university-registration/api.jpg",
          alt: "University Registration FastAPI REST routes documentation surface",
        },
      },
      {
        id: "record",
        eyebrow: "Record",
        title: "Persist the student record",
        oneLiner: "Create or update enrollment state.",
        description:
          "After validation, create/update logic makes the student record the source of truth for that attempt.",
        media: {
          kind: "image",
          src: "/projects/university-registration/record.jpg",
          alt: "University Registration persistence flow creating or updating the student record",
        },
      },
      {
        id: "confirm",
        eyebrow: "Respond",
        title: "Structured confirmation",
        oneLiner: "JSON back to the calling system.",
        description:
          "Successful registrations return structured JSON so clients can confirm enrollment and continue.",
        media: {
          kind: "image",
          src: "/projects/university-registration/confirm.jpg",
          alt: "University Registration structured JSON confirmation response",
        },
      },
    ],
  },
  {
    slug: "laravel-ecommerce",
    number: "07",
    name: "Laravel Ecommerce",
    label: "Full-stack store",
    tagline: "Catalog, cart, and checkout in Laravel",
    summary:
      "A Laravel ecommerce store covering product browsing, cart, and checkout flows with a classic MVC structure, Blade/Vite frontend assets, and an admin-friendly application layout.",
    coverImage: "/projects/laravel-ecommerce.webp",
    heroImage: "/projects/laravel-ecommerce/hero-architecture.jpg",
    repository: "https://github.com/Farid-Bytes/laravel-ecommerce-store",
    stack: ["Laravel", "PHP", "MySQL", "Blade", "Vite", "MVC"],
    meta: "Catalog → cart → checkout",
    story: [
      {
        id: "catalog",
        eyebrow: "Catalog",
        title: "Browse the product shelf",
        oneLiner: "Grid of products with prices.",
        description:
          "Shoppers start on product list cards that present assortment and pricing before opening detail.",
        media: {
          kind: "image",
          src: "/projects/laravel-ecommerce/catalog.jpg",
          alt: "Laravel ecommerce product catalog grid with prices",
        },
      },
      {
        id: "cart",
        eyebrow: "Cart",
        title: "Line items before checkout",
        oneLiner: "Quantities and totals.",
        description:
          "The cart aggregates selected products so shoppers can review quantities and totals.",
        media: {
          kind: "image",
          src: "/projects/laravel-ecommerce/cart.jpg",
          alt: "Laravel ecommerce cart with line items and totals",
        },
      },
      {
        id: "checkout",
        eyebrow: "Checkout",
        title: "Complete the purchase path",
        oneLiner: "Customer details into an order.",
        description:
          "Checkout collects customer details and completes the purchase path into a confirmed order.",
        media: {
          kind: "image",
          src: "/projects/laravel-ecommerce/checkout.jpg",
          alt: "Laravel ecommerce checkout with customer details and order summary",
        },
      },
      {
        id: "admin",
        eyebrow: "Admin",
        title: "Operate catalog and stock",
        oneLiner: "Manage products behind the shop.",
        description:
          "Admin flows keep catalog and stock manageable so the storefront stays in sync with what can be sold.",
        media: {
          kind: "image",
          src: "/projects/laravel-ecommerce/admin.jpg",
          alt: "Laravel ecommerce admin catalog and stock management",
        },
      },
      {
        id: "mvc",
        eyebrow: "MVC",
        title: "Laravel structure under the hood",
        oneLiner: "Routes, controllers, models, Blade.",
        description:
          "Routes, controllers, Eloquent models, and Blade/Vite views follow Laravel MVC as the store grows.",
        media: {
          kind: "image",
          src: "/projects/laravel-ecommerce/mvc.jpg",
          alt: "Laravel ecommerce MVC architecture from routes through controllers to Eloquent models and Blade views",
        },
      },
    ],
  },
  {
    slug: "atmos",
    number: "08",
    name: "ATMOS",
    label: "Weather chatbot",
    tagline: "Weather dashboard with an AI chat assistant",
    summary:
      "ATMOS pairs a React (Vite) weather dashboard with a FastAPI backend that uses Groq function calling and live Open-Meteo data—no weather API key required on the client.",
    coverImage: "/projects/atmos.webp",
    heroImage: "/projects/atmos/hero-architecture.jpg",
    repository: "https://github.com/Farid-Bytes/Weather_app",
    stack: [
      "React",
      "Vite",
      "FastAPI",
      "Groq",
      "Open-Meteo",
      "Function calling",
    ],
    meta: "Dashboard · chat · Open-Meteo",
    story: [
      {
        id: "dashboard",
        eyebrow: "Dashboard",
        title: "ATMOS weather surface",
        oneLiner: "Conditions beside chat entry.",
        description:
          "The Vite UI presents weather and chat in one surface while talking to the FastAPI backend.",
        media: {
          kind: "image",
          src: "/projects/atmos/dashboard.jpg",
          alt: "ATMOS weather dashboard with conditions and chat entry",
        },
      },
      {
        id: "forecast",
        eyebrow: "Forecast",
        title: "Current and 7-day outlook",
        oneLiner: "Open-Meteo driven cards.",
        description:
          "Forecast cards show current conditions and a seven-day outlook for a resolved location.",
        media: {
          kind: "image",
          src: "/projects/atmos/forecast.jpg",
          alt: "ATMOS current conditions and seven-day forecast cards",
        },
      },
      {
        id: "search",
        eyebrow: "Search",
        title: "City autocomplete",
        oneLiner: "Typeahead place matches.",
        description:
          "City search powers autocomplete so the UI can resolve places before weather or chat requests.",
        media: {
          kind: "image",
          src: "/projects/atmos/search.jpg",
          alt: "ATMOS city autocomplete search with place matches",
        },
      },
      {
        id: "chat",
        eyebrow: "Chat",
        title: "Groq function-calling Q&A",
        oneLiner: "Natural-language weather tools.",
        description:
          "Chat sends weather questions through Groq; tools fetch Open-Meteo data before the reply.",
        media: {
          kind: "image",
          src: "/projects/atmos/chat.jpg",
          alt: "ATMOS AI chat answering natural-language weather questions",
        },
      },
      {
        id: "deploy",
        eyebrow: "Deploy",
        title: "Vercel UI + Render API",
        oneLiner: "Static frontend, Python API.",
        description:
          "The Vite app deploys to Vercel and FastAPI to Render, with Groq keys kept server-side.",
        media: {
          kind: "image",
          src: "/projects/atmos/deploy.jpg",
          alt: "ATMOS deployment architecture with Vercel frontend, Render FastAPI backend, and server-side Groq secrets",
        },
      },
    ],
  },
] as const;

export function getProject(slug: string): ShowcaseProject | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getProjectSlugs(): string[] {
  return projects.map((project) => project.slug);
}
