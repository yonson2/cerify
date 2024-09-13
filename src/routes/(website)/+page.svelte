<script lang="ts">
	import type { PageData } from './$types.js';
	import SearchForm from './search-form.svelte';
	export let data: PageData;
</script>

<div class="absolute inset-x-0 bottom-32 flex items-center justify-center sm:relative sm:top-10">
	<SearchForm data={data.form} />
</div>
