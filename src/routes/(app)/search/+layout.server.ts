import type { PageServerData } from "./$types.js";
import { superValidate } from "sveltekit-superforms";
import { formSchema } from "../../(website)/schema";
import { zod } from "sveltekit-superforms/adapters";
import { searchPlaylists } from "$lib/server/spotify";

export const load: PageServerData = async (data) => {
  const searchQuery = data.url.searchParams.get('q') || '';
  const form = await superValidate({ q: searchQuery }, zod(formSchema))

  const playlists = await searchPlaylists(searchQuery, data.locals.session.token)

  return { form, playlists };
};
