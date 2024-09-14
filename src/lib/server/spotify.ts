import { type Playlist } from "$lib/components/types/spotify";
import { SPOTIFY_CLIENT_ID } from "$env/static/private";
import pkg from 'he';
const { decode } = pkg;

export async function searchPlaylists(query: string, token: string) {
  const itemsPerPage = 50;
  let playlistIds: string[] = [];
  let nextLink = "";
  let counter = 0;
  const response = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=playlist&limit=${itemsPerPage}&offset=0`, {
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + token },
  });

  const results = await response.json();

  const ids = results.playlists.items.map((p) => p.id);
  playlistIds = [...playlistIds, ...ids];

  nextLink = results.playlists.next
  while (nextLink) {
    try {
      counter++
      const response = await fetch(nextLink, { method: 'GET', headers: { 'Authorization': `Bearer ${token}` } });
      const results = await response.json();
      const ids = results.playlists.items.map((p) => p.id);
      playlistIds = [...playlistIds, ...ids];
      nextLink = results.playlists.next;
    } catch (e) {
      console.log(e);
    }
  }

  // now map each p id to a proper p
  const promises = playlistIds.map(async (id) => {
    const response = await fetch(`https://api.spotify.com/v1/playlists/${id}`, { method: 'GET', headers: { 'Authorization': `Bearer ${token}` } });
    const result = await response.json();
    return result
  })

  const rawPlaylists = await Promise.all(promises)
  const playlists = rawPlaylists
    .filter((p) => p.followers?.total > 0 || false)
    .sort((a, b) => b.followers?.total - a.followers?.total)
    .map((p): Playlist => {
      return {
        id: p.id,
        followers: p.followers?.total || 0,
        link: `<a href="${p.external_urls?.spotify}" target="_blank">${p.id}</a>`,
        owner: p.owner?.display_name || p.owner?.id || "No name found.",
        description:  decode(p.description),
        name: p.name,
      }
    })

  return playlists;
}

export async function refreshToken(refreshToken: string) {
  const url = "https://accounts.spotify.com/api/token";
  const payload = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: SPOTIFY_CLIENT_ID
    }),
  }
  const body = await fetch(url, payload);
  const response = await body.json();

  return response;
}
