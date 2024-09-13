import type { PageServerLoad } from "./$types.js";
import { superValidate } from "sveltekit-superforms";
import { formSchema } from "../../(website)/schema";
import { zod } from "sveltekit-superforms/adapters";

export const load: PageServerLoad = async ({ url }) => {
  const searchQuery = url.searchParams.get('q') || '';
  const form = await superValidate({ q: searchQuery }, zod(formSchema))
  console.log(form);

  return { form };
};
