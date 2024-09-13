<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import Icon from 'svelte-awesome';
	import spotify from 'svelte-awesome/icons/spotify';
	import Particles from '$lib/components/ui/particles/particles.svelte';

	import { mode } from 'mode-watcher';

	import { getToken, redirectToSpotifyAuthorize } from '$lib/spotify.js';

	import type { PageData } from './$types.js';
	import SearchForm from './search-form.svelte';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { saveToken } from '$lib/stores.js';
	export let data: PageData;

	$: color = '';
	$: {
		if ($mode === 'light') {
			color = '#e21d48';
		} else {
			color = '#ffffff';
		}
	}

	let loggedIn = false;
	onMount(async () => {
		$page.url.searchParams.set('code', '');
		const code = data.codeParam;
		if (code) {
			const token = await getToken(code);
			try {
				saveToken(token);
				loggedIn = true;
			} catch (err) {
				console.error(err);
			}
		}
	});
</script>

<div
	class="absolute inset-x-0 bottom-32 flex animate-slidein items-center justify-center sm:relative sm:top-10"
>
	{#if !loggedIn}
		<Button on:click={redirectToSpotifyAuthorize}
			><Icon data={spotify} /> &nbsp; Login with Spotify</Button
		>
	{:else}
		<SearchForm data={data.form} />
	{/if}
</div>
{#key $mode}
	<Particles className="absolute inset-1 -z-10" refresh={true} {color} />
{/key}
