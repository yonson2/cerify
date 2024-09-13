import type { PageServerLoad } from "./$types.js";
import { superValidate } from "sveltekit-superforms";
import { formSchema } from "./schema";
import { zod } from "sveltekit-superforms/adapters";

// TODO: export as a function in spotify service too?
//

export const load: PageServerLoad = async ({ url }) => {
  // On page load, try to fetch auth code from current browser search URL
  const code = url.searchParams.get('code') || '';

  return {
    form: await superValidate(zod(formSchema)),
    codeParam: code,
  };
};
