import { writable } from "svelte/store";
import { browser } from "$app/environment";

let at, rt, ex: string = ""
let ei = 0;

if (browser) {
  at = localStorage.getItem("spotify_access_token") || "";
  rt = localStorage.getItem("spotify_refresh_token") || "";
  ei = Number(localStorage.getItem("spotify_expires_in")) || 0;
  ex = localStorage.getItem("spotify_expires_in") || new Date().toISOString();
}

export const access_token = writable<string>(at);
export const refresh_token = writable<string>(rt);
export const expires_in = writable<number>(ei);
export const expires = writable<string>(ex);

access_token.subscribe((value) => browser && (localStorage.setItem("spotify_access_token", value)));
refresh_token.subscribe((value) => browser && (localStorage.setItem("spotify_refresh_token", value)));
expires_in.subscribe((value) => browser && (localStorage.setItem("spotify_expires_in", String(value))));
expires.subscribe((value) => browser && (localStorage.setItem("spotify_expires", value)));

interface SpotifyAuthResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export function saveToken(response: SpotifyAuthResponse): void {
  const { access_token: at, refresh_token: rt, expires_in: ei } = response;
  access_token.set(at); refresh_token.set(rt); expires_in.set(ei);

  const now = new Date();
  const expiry = new Date(now.getTime() + (Number(ei) * 1000));
  expires.set(expiry.toISOString())
}
