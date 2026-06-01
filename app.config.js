const { expo } = require("./app.json");

const githubPagesBaseUrl =
  process.env.GITHUB_REPOSITORY === "microsoft-lang1901/monsieur-by-aelier-groupe"
    ? "/monsieur-by-aelier-groupe"
    : undefined;

module.exports = () => ({
  expo: {
    ...expo,
    ...(githubPagesBaseUrl
      ? {
          experiments: {
            ...(expo.experiments ?? {}),
            baseUrl: githubPagesBaseUrl
          }
        }
      : {})
  }
});
