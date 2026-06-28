const crypto = require("crypto");
const { STATE_COOKIE, getRequestOrigin, getRequiredEnv, sendJson, setCookie } = require("./_auth");

module.exports = function handler(req, res) {
  let clientId;
  let redirectUri;

  try {
    clientId = getRequiredEnv("GITHUB_CLIENT_ID");
    redirectUri = `${getRequestOrigin(req)}/api/callback`;
  } catch (error) {
    sendJson(res, 500, { message: error.message });
    return;
  }

  if (!/^[A-Za-z0-9_]+$/.test(clientId)) {
    sendJson(res, 500, {
      message: "GITHUB_CLIENT_ID invalido. Confira se ele foi colado sem aspas, espacos ou quebras de linha.",
    });
    return;
  }

  const state = crypto.randomBytes(16).toString("hex");
  const authorizeUrl = new URL("https://github.com/login/oauth/authorize");
  authorizeUrl.searchParams.set("client_id", clientId);
  authorizeUrl.searchParams.set("redirect_uri", redirectUri);
  authorizeUrl.searchParams.set("scope", "repo");
  authorizeUrl.searchParams.set("state", state);
  authorizeUrl.searchParams.set("allow_signup", "false");

  setCookie(res, STATE_COOKIE, state, 600);
  res.writeHead(302, {
    Location: authorizeUrl.toString(),
  });
  res.end();
};
