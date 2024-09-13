<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import Icon from 'svelte-awesome';
	import spotify from 'svelte-awesome/icons/spotify';
	import Particles from '$lib/components/ui/particles/particles.svelte';

	import { browser } from '$app/environment';
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

	let isComponentMounted = false;
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
		isComponentMounted = true;
	});
</script>

<h1
	class="animate-slidein text-balance bg-gradient-to-br from-black from-30% to-black/40 bg-clip-text py-6 pt-8 text-center text-6xl font-semibold leading-none tracking-tighter text-transparent [--animation-delay:200ms] dark:from-white dark:to-white/40 sm:text-7xl md:text-8xl lg:text-9xl"
>
	Cerify
</h1>
<div
	class="absolute inset-x-0 bottom-32 flex animate-slidein items-center justify-center sm:relative sm:top-10"
>
	<!-- {#if isComponentMounted} -->
	{#if !loggedIn}
		<Button on:click={redirectToSpotifyAuthorize}
			><Icon data={spotify} /> &nbsp; Login with Spotify</Button
		>
	{:else}
		<SearchForm data={data.form} />
	{/if}
	<!-- {/if} -->
</div>
{#key $mode}
	<Particles className="absolute inset-1 -z-10" refresh={true} {color} />
{/key}
