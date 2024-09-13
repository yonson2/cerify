<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';
	import '../app.css';
	import LightSwitch from '$lib/components/ui/light-switch/light-switch.svelte';
	import Logo from '$lib/components/ui/logo/logo.svelte';
</script>

<ModeWatcher />
<main class="mx-auto max-w-4xl">
	<div class="flex h-full flex-1 flex-col space-y-8 p-8">
		<div class="flex items-center justify-between space-y-2">
			<div></div>
			<div class="flex items-center space-x-2">
				<LightSwitch />
			</div>
		</div>
	</div>
	<div class="m-12">
		<Logo />
		<slot />
	</div>
</main>
