<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';
	import '../../../app.css';
	import LightSwitch from '$lib/components/ui/light-switch/light-switch.svelte';

	import type { PageData } from './$types.js';
	import NavForm from './nav-form.svelte';
	import BlurIn from '$lib/components/ui/text/blur-in.svelte';

	export let data: PageData;
</script>

<ModeWatcher />
<main class="mx-auto max-w-4xl">
	<div class="flex h-full flex-1 flex-col space-y-8 p-8">
		<div class="flex items-center justify-between space-y-2">
			<a href="/">
				<p
					class=" bg-gradient-to-br from-black from-30% to-black/40 bg-clip-text text-2xl font-semibold leading-none tracking-tighter text-transparent dark:from-white dark:to-white/40 sm:text-2xl md:text-2xl lg:text-2xl"
				>
					Cerify
				</p>
			</a>
			<div class="">
				<NavForm data={data.form} />
			</div>
			<div class="flex items-center space-x-2">
				<LightSwitch />
			</div>
		</div>
	</div>
	<div class="m-12">
		<slot />
		<!-- {#key $mode} -->
		<!-- 	<Particles className="absolute inset-1 -z-10" refresh={true} {color} size={1.5} /> -->
		<!-- {/key} -->
	</div>
</main>
