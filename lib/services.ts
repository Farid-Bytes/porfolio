export type Service = {
  slug: string;
  title: string;
  description: string;
  /** Public path under /services (WebP cover). */
  image: string;
  popular?: boolean;
  enquirySubject: string;
};

export type ServiceCategory = {
  id: string;
  title: string;
  blurb: string;
  services: readonly Service[];
};

export function contactEnquiryHref(enquirySubject: string): string {
  return `/contact?subject=${encodeURIComponent(enquirySubject)}`;
}

/**
 * Offerings grounded in the published CV, experience, and project showcases.
 */
export const serviceCategories: readonly ServiceCategory[] = [
  {
    id: "ai-automation",
    title: "AI Automation & Agents",
    blurb:
      "Workflows, agents, and LLM-powered tools that turn models into dependable product features.",
    services: [
      {
        slug: "ai-automation-workflows",
        title: "AI Automation Workflows",
        description:
          "End-to-end automation pipelines — chatbots, data-driven services, and production backends wired around clear business goals.",
        image: "/services/ai-automation-workflows.webp",
        popular: true,
        enquirySubject: "Enquiry: AI Automation Workflows",
      },
      {
        slug: "ai-agents",
        title: "AI Agents",
        description:
          "Tool-using agents with function calling, memory, and modular tools for admin, analytics, and operational tasks.",
        image: "/services/ai-agents.webp",
        enquirySubject: "Enquiry: AI Agents",
      },
      {
        slug: "llm-applications",
        title: "LLM Applications",
        description:
          "Streaming assistants, prompt engineering, and Groq- or OpenAI-backed interfaces integrated into your product.",
        image: "/services/llm-applications.webp",
        enquirySubject: "Enquiry: LLM Applications",
      },
      {
        slug: "rag-systems",
        title: "RAG Systems",
        description:
          "Retrieval-augmented pipelines with embeddings, ranked context, and CMS or database sources for accurate answers.",
        image: "/services/rag-systems.webp",
        enquirySubject: "Enquiry: RAG Systems",
      },
    ],
  },
  {
    id: "ai-ml",
    title: "AI / ML Engineering",
    blurb:
      "Applied machine learning for speech, NLP, and model integration in real products.",
    services: [
      {
        slug: "applied-ml-integration",
        title: "Applied ML Integration",
        description:
          "Transformers, PyTorch workloads, and model tooling connected to APIs and interfaces people can use daily.",
        image: "/services/applied-ml-integration.webp",
        enquirySubject: "Enquiry: Applied ML Integration",
      },
      {
        slug: "voice-speech-analytics",
        title: "Voice & Speech Analytics",
        description:
          "Speaker-aware transcription, diarization, and automated call scoring with NLP insights — VoicePulse-style pipelines.",
        image: "/services/voice-speech-analytics.webp",
        enquirySubject: "Enquiry: Voice & Speech Analytics",
      },
      {
        slug: "nlp-sentiment-analysis",
        title: "NLP & Sentiment Analysis",
        description:
          "Sentiment and emotion signals from text or transcripts, with reporting tuned for reviews and performance metrics.",
        image: "/services/nlp-sentiment-analysis.webp",
        enquirySubject: "Enquiry: NLP & Sentiment Analysis",
      },
    ],
  },
  {
    id: "full-stack",
    title: "Full-Stack Web Development",
    blurb:
      "Modern web apps from interface to API — including Python-backed full-stack delivery.",
    services: [
      {
        slug: "nextjs-web-apps",
        title: "Next.js Web Apps",
        description:
          "Fast, accessible frontends with the same production-minded structure used on this portfolio and client-facing products.",
        image: "/services/nextjs-web-apps.webp",
        enquirySubject: "Enquiry: Next.js Web Apps",
      },
      {
        slug: "laravel-php-apps",
        title: "Laravel / PHP Apps",
        description:
          "Full-stack Laravel features, ecommerce flows, and MySQL-backed applications from professional delivery experience.",
        image: "/services/laravel-php-apps.webp",
        enquirySubject: "Enquiry: Laravel / PHP Apps",
      },
      {
        slug: "python-full-stack",
        title: "Python Full-Stack",
        description:
          "FastAPI services paired with modern UIs — Python end-to-end for agents, dashboards, and automation products.",
        image: "/services/python-full-stack.webp",
        enquirySubject: "Enquiry: Python Full-Stack Development",
      },
    ],
  },
  {
    id: "backend-data",
    title: "Backend, APIs & Data",
    blurb:
      "Scalable APIs, ingestion at scale, and integrations deployed for live use.",
    services: [
      {
        slug: "fastapi-rest-apis",
        title: "FastAPI & REST APIs",
        description:
          "Clear HTTP contracts for registration, fleet telemetry, course data, and multi-tenant backends on Uvicorn.",
        image: "/services/fastapi-rest-apis.webp",
        enquirySubject: "Enquiry: FastAPI & REST APIs",
      },
      {
        slug: "data-pipelines-etl",
        title: "Data Pipelines & ETL",
        description:
          "Extract–transform–load workflows with cleaning scripts and MySQL storage — built for 60,000+ structured records.",
        image: "/services/data-pipelines-etl.webp",
        enquirySubject: "Enquiry: Data Pipelines & ETL",
      },
      {
        slug: "web-scraping-ingestion",
        title: "Web Scraping & Data Ingestion",
        description:
          "Modular httpx and BeautifulSoup pipelines across thousands of pages with normalized, query-ready output.",
        image: "/services/web-scraping-ingestion.webp",
        enquirySubject: "Enquiry: Web Scraping & Data Ingestion",
      },
      {
        slug: "integrations-deployment",
        title: "Integrations & Deployment",
        description:
          "Third-party API integration, Git-based delivery, and DigitalOcean deployment for live, maintainable services.",
        image: "/services/integrations-deployment.webp",
        enquirySubject: "Enquiry: Integrations & Deployment",
      },
    ],
  },
] as const;

export const allServices: readonly Service[] = serviceCategories.flatMap(
  (category) => category.services,
);
