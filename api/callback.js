const {
  STATE_COOKIE,
  TOKEN_COOKIE,
  clearCookie,
  encryptToken,
  getRequestOrigin,
  getRequiredEnv,
  parseCookies,
  sendJson,
  setCookie,
} = require("./_auth");

module.exports = async function handler(req, res) {
  let clientId;
  let clientSecret;
  let redirectUri;
  const { code, state } = req.query;
  const cookies = parseCookies(req.headers.cookie);

  clearCookie(res, STATE_COOKIE);

  try {
    clientId = getRequiredEnv("GITHUB_CLIENT_ID");
    clientSecret = getRequiredEnv("GITHUB_CLIENT_SECRET");
    redirectUri = `${getRequestOrigin(req)}/api/callback`;
  } catch (error) {
    sendJson(res, 500, { message: error.message });
    return;
  }

  if (!code || !state || state !== cookies[STATE_COOKIE]) {
    sendJson(res, 400, { message: "Estado de autenticacao invalido. Tente entrar novamente." });
    return;
  }

  const response = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: redirectUri,
      state,
    }),
  });
  const data = await response.json();

  if (!response.ok || data.error || !data.access_token) {
    sendJson(res, 400, { message: data.error_description || "Nao foi possivel autenticar com o GitHub." });
    return;
  }

  setCookie(res, TOKEN_COOKIE, encryptToken(data.access_token), 60 * 60 * 24 * 7);
  res.writeHead(302, { Location: "/admin" });
  res.end();
};
