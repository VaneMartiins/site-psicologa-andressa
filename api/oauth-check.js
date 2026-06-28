const { getRequestOrigin, normalizeEnv, sendJson } = require("./_auth");

module.exports = function handler(req, res) {
  const clientId = normalizeEnv(process.env.GITHUB_CLIENT_ID);
  const redirectUri = `${getRequestOrigin(req)}/api/callback`;

  sendJson(res, 200, {
    hasClientId: Boolean(clientId),
    clientIdLooksValid: /^[A-Za-z0-9_]+$/.test(clientId),
    clientIdPreview: clientId ? `${clientId.slice(0, 4)}...${clientId.slice(-4)}` : "",
    redirectUri,
    scope: "repo",
  });
};
