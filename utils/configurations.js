import path from "path";
// This file will house some universal configurations used by the web app
const assetsURL =
  process.env.NODE_ENV !== "development"
    ? "https://assets.michaelfortunato.org"
    : path.join("assets.michaelfortunato.org", "blogs");
export { assetsURL };
