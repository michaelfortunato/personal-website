import path from "path";
// This file will house some universal configurations used by the web app
const assetsURL =
  process.env.NODE_ENV !== "development"
    ? "https://assets.michaelfortunato.org"
    : "assets.michaelfortunato.org";
export { assetsURL };
