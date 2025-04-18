import { env } from "~/config/environment";

export const WHITELIST_DOMAINS = [
  "https://trello-clone-opal-psi.vercel.app",
  "http://localhost:5173",
];

export const WEBSITE_DOMAINS =
  env.BUILD_MODE === "production"
    ? env.WEBSITE_DOMAIN_PRODUCTION
    : env.WEBSITE_DOMAIN_DEVELOPMENT;

export const DEFAULT_PAGE = 1;
export const DEFAULT_ITEMS_PER_PAGE = 8;
