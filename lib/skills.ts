export type Skill = {
  name: string;
  group: "Core" | "AI" | "Backend" | "Platform";
  /** Short blurb grounded in site claims and project stacks. */
  blurb: string;
  /** Public path to the orbit tile logo / illustration. */
  image: string;
};

/**
 * Capability keywords derived from verified site claims and project stacks.
 * No unverified proficiency scores. Order is used by the skills orbit.
 */
export const skills: readonly Skill[] = [
  {
    name: "Python",
    group: "Core",
    blurb:
      "Primary language for agents, APIs, and applied ML services. The glue that ties scripts, services, and model calls into one stack.",
    image: "/skills/python.svg",
  },
  {
    name: "AI Automation",
    group: "Core",
    blurb:
      "Workflows that turn models into tools people can actually use. Focused on repeatable steps, clear handoffs, and outcomes teams can trust.",
    image: "/skills/ai-automation.svg",
  },
  {
    name: "Workflows",
    group: "Core",
    blurb:
      "Orchestrating steps, tools, and data around a clear system goal. Designed so each stage is inspectable and easy to extend.",
    image: "/skills/workflows.svg",
  },
  {
    name: "LLMs",
    group: "AI",
    blurb:
      "Language models wired into reviews, chat, and assistants. Prompting, tooling, and guardrails shaped for real product flows.",
    image: "/skills/llms.svg",
  },
  {
    name: "AI Agents",
    group: "AI",
    blurb:
      "Tool-using agents for campus ops, flights, and admin tasks. Built to call APIs, follow policies, and finish multi-step jobs.",
    image: "/skills/ai-agents.svg",
  },
  {
    name: "PyTorch",
    group: "AI",
    blurb:
      "Deep learning stack used alongside transformers workloads. Training and inference paths that stay close to production needs.",
    image: "/skills/pytorch.svg",
  },
  {
    name: "AI / ML",
    group: "AI",
    blurb:
      "Applied machine learning for production-facing products. Features that earn their place in the product, not demos that stall.",
    image: "/skills/ai-ml.svg",
  },
  {
    name: "WhisperX",
    group: "AI",
    blurb:
      "Speaker-aware transcription for call analytics pipelines. Alignment and diarization that feed clearer review workflows.",
    image: "/skills/whisperx.svg",
  },
  {
    name: "Transformers",
    group: "AI",
    blurb:
      "Model tooling for NLP features in analytics products. Hugging Face–style stacks when the problem needs strong language models.",
    image: "/skills/transformers.svg",
  },
  {
    name: "FastAPI",
    group: "Backend",
    blurb:
      "Python APIs for registration, flights, and service layers. Typed routes and docs that keep clients and agents aligned.",
    image: "/skills/fastapi.svg",
  },
  {
    name: "Laravel",
    group: "Backend",
    blurb:
      "PHP framework used in ecommerce and prior professional work. Solid MVC structure for catalogs, carts, and admin flows.",
    image: "/skills/laravel.svg",
  },
  {
    name: "MySQL",
    group: "Backend",
    blurb:
      "Relational storage for apps that need structured records. Schemas and queries that keep transactional data reliable.",
    image: "/skills/mysql.svg",
  },
  {
    name: "REST APIs",
    group: "Backend",
    blurb:
      "Clear HTTP contracts between clients, tools, and backends. Predictable resources and errors that integrations can depend on.",
    image: "/skills/rest-apis.svg",
  },
  {
    name: "Backend systems",
    group: "Backend",
    blurb:
      "Services that keep agents, data, and interfaces dependable. Auth, validation, and persistence shaped for real traffic.",
    image: "/skills/backend-systems.svg",
  },
  {
    name: "Integrations",
    group: "Platform",
    blurb:
      "Connecting APIs, data sources, and product interfaces. Glue work that makes separate systems feel like one product.",
    image: "/skills/integrations.svg",
  },
  {
    name: "Deployment",
    group: "Platform",
    blurb:
      "Shipping systems so teams can run and extend them. From local setups to hosted environments with a path others can follow.",
    image: "/skills/deployment.svg",
  },
] as const;
