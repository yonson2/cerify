<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import Icon from 'svelte-awesome';
	import spotify from 'svelte-awesome/icons/spotify';
</script>

<div
	class="absolute inset-x-0 bottom-32 flex animate-slidein items-center justify-center sm:relative sm:top-10"
>
	<a href="/login/spotify">
		<Button>
			<Icon data={spotify} /> &nbsp; Login with Spotify
		</Button>
	</a>
</div>
