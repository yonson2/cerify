import { PUBLIC_SPOTIFY_CLIENT_ID } from '$env/static/public';

const redirectUrl = 'http://localhost:5173';
const authorizationEndpoint = 'https://accounts.spotify.com/authorize';
const tokenEndpoint = 'https://accounts.spotify.com/api/token';
const scope = '';

export async function redirectToSpotifyAuthorize() {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const randomValues = crypto.getRandomValues(new Uint8Array(64));
  const randomString = randomValues.reduce((acc, x) => acc + possible[x % possible.length], '');

  const code_verifier = randomString;
  const data = new TextEncoder().encode(code_verifier);
  const hashed = await crypto.subtle.digest('SHA-256', data);

  const code_challenge_base64 = btoa(String.fromCharCode(...new Uint8Array(hashed)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  window.localStorage.setItem('code_verifier', code_verifier);

  const authUrl = new URL(authorizationEndpoint);
  const params = {
    response_type: 'code',
    client_id: PUBLIC_SPOTIFY_CLIENT_ID,
    scope: scope,
    code_challenge_method: 'S256',
    code_challenge: code_challenge_base64,
    redirect_uri: redirectUrl
  };

  authUrl.search = new URLSearchParams(params).toString();
  window.location.href = authUrl.toString(); // Redirect the user to the authorization server for login
}

export async function getToken(code: string) {
  //TODO: switch to cookie.?
  const code_verifier = window.localStorage.getItem('code_verifier') || '';

  const response = await fetch(tokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      client_id: PUBLIC_SPOTIFY_CLIENT_ID,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUrl,
      code_verifier: code_verifier
    })
  });

  return await response.json();
}

