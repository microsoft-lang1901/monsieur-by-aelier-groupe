const { handleApi, sendError } = require("../lib/monsieur-api");

module.exports = function monsieurApi(req, res) {
  const url = new URL(req.url, `https://${req.headers.host || "localhost"}`);
  handleApi(req, res, url).catch(error => {
    sendError(res, 500, error.message || "Server error");
  });
};
