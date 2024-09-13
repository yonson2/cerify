<script lang="ts">
	import type { PageData } from './$types.js';
	import { ExclamationTriangle } from 'svelte-radix';
	import * as Alert from '$lib/components/ui/alert/index.js';
	import DataTable from './data-table.svelte';

	export let data: PageData;
	$: console.log(data.form.errors);
</script>

<!-- {#if data.form.errors.q} -->
<!-- 	<Alert.Root variant="default" class="border-destructive dark:border-secondary"> -->
<!-- 		<ExclamationTriangle class="h-4 w-4 text-red-700 dark:text-red-200" /> -->
<!-- 		<Alert.Title class="text-destructive dark:text-red-200">Error</Alert.Title> -->
<!-- 		<Alert.Description>{data.form.errors.q}</Alert.Description> -->
<!-- 	</Alert.Root> -->
<!-- {/if} -->

<div class="container mx-auto py-10">
	<DataTable />
</div>
