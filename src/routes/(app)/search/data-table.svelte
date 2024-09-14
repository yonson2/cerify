<script lang="ts">
	import {
		addPagination,
		addSortBy,
		addTableFilter,
		addHiddenColumns,
		addSelectedRows
	} from 'svelte-headless-table/plugins';
	import { createTable, Render, Subscribe, createRender } from 'svelte-headless-table';
	import { readable } from 'svelte/store';
	import arrowsV from 'svelte-awesome/icons/arrowsV';
	import { ChevronDown } from 'svelte-radix';
	import { Icon } from 'svelte-awesome';
	import * as Table from '$lib/components/ui/table';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import DataTableCheckbox from './data-table-checkbox.svelte';
	import { type Playlist } from '$lib/components/types/spotify';
	import { toCsv } from '@iwsio/json-csv-core';

	export let data: Playlist[] = [
		{
			id: '728ed52f',
			name: 'los 40 principales',
			owner: 'test',
			description: 'this is a test',
			followers: 1234,
			link: 'http://spotify.com/a'
		},
		{
			id: '728ed52f',
			name: 'Leiva es un pipa',
			owner: 'leiviño',
			description: 'Una persona es una persona al igual que un trabajo es un trabajo.',
			followers: 81738,
			link: 'http://spotify.com/b'
		}
	];
	const table = createTable(readable(data), {
		page: addPagination({ initialPageSize: 10 }),
		sort: addSortBy({ toggleOrder: ['asc', 'desc'] }),
		filter: addTableFilter({
			fn: ({ filterValue, value }) => value.toLowerCase().includes(filterValue.toLowerCase())
		}),
		hide: addHiddenColumns(),
		select: addSelectedRows()
	});
	const columns = table.createColumns([
		table.column({
			accessor: 'id',
			header: (_, { pluginStates }) => {
				const { allPageRowsSelected } = pluginStates.select;
				return createRender(DataTableCheckbox, {
					checked: allPageRowsSelected
				});
			},
			cell: ({ row }, { pluginStates }) => {
				const { getRowState } = pluginStates.select;
				const { isSelected } = getRowState(row);

				return createRender(DataTableCheckbox, {
					checked: isSelected
				});
			},
			plugins: { sort: { disable: true }, filter: { exclude: true } }
		}),
		table.column({
			accessor: 'name',
			header: 'Name',
			plugins: { sort: { disable: true }, filter: { exclude: true } }
		}),
		table.column({
			accessor: 'owner',
			header: 'Owner',
			plugins: { filter: { exclude: true } }
		}),
		table.column({
			accessor: 'description',
			header: 'Description',
			plugins: { sort: { disable: true } }
		}),
		table.column({
			accessor: 'followers',
			header: 'Followers',
			plugins: { filter: { exclude: true } },
			cell: ({ value }) => {
				const formatted = new Intl.NumberFormat('es-ES', {}).format(value);
				return formatted;
			}
		}),
		table.column({
			accessor: 'link',
			header: 'Link',
			plugins: { sort: { disable: true }, filter: { exclude: true } }
		})
	]);

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates, flatColumns, rows } =
		table.createViewModel(columns);

	const { hasNextPage, hasPreviousPage, pageIndex } = pluginStates.page;

	const { filterValue } = pluginStates.filter;
	const { hiddenColumnIds } = pluginStates.hide;
	const { selectedDataIds } = pluginStates.select;

	const ids = flatColumns.map((col) => col.id);
	let hideForId = Object.fromEntries(ids.map((id) => [id, true]));

	$: $hiddenColumnIds = Object.entries(hideForId)
		.filter(([, hide]) => !hide)
		.map(([id]) => id);

	const hidableCols = ['name', 'owner', 'followers', 'description', 'link'];

	const options = {
		fields: [
			{ name: 'id' }, // regular field by name
			{ name: 'name' },
			{ name: 'owner' },
			{ name: 'description' },
			{ name: 'followers' }
		]
	};
	function downloadCSV(indices) {
		let elements;
		if (indices && indices.length > 0) {
			elements = indices.map((i) => data[i]);
		} else {
			elements = data;
		}
		const csvString = toCsv(elements, options);
		const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.setAttribute('download', 'playlists.csv');
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	}

	$: console.log(Object.keys($selectedDataIds).map((k) => Number(k)));
</script>

<div class="rounded-md border bg-white p-2 dark:bg-black">
	<div class="flex items-center py-4">
		<Input
			class="mr-2 max-w-sm"
			placeholder="Filter description..."
			type="text"
			bind:value={$filterValue}
		/>
		<div class="ml-auto flex items-center">
			<Button class="mr-4" variant="outline" on:click={downloadCSV}
				>Download all {data.length} entries as CSV</Button
			>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger asChild let:builder>
					<Button variant="outline" class="ml-auto" builders={[builder]}>
						Columns <ChevronDown class="ml-2 h-4 w-4" />
					</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content>
					{#each flatColumns as col}
						{#if hidableCols.includes(col.id)}
							<DropdownMenu.CheckboxItem bind:checked={hideForId[col.id]}>
								{col.header}
							</DropdownMenu.CheckboxItem>
						{/if}
					{/each}
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
	</div>
	<div class="rounded-md border">
		<Table.Root {...$tableAttrs}>
			<Table.Header>
				{#each $headerRows as headerRow}
					<Subscribe rowAttrs={headerRow.attrs()}>
						<Table.Row>
							{#each headerRow.cells as cell (cell.id)}
								<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()} let:props>
									<Table.Head {...attrs} class="[&:has([role=checkbox])]:pl-3">
										{#if cell.id === 'followers'}
											<div class="text-right">
												<Button variant="ghost" on:click={props.sort.toggle}>
													<Render of={cell.render()} />
													<Icon data={arrowsV} class="ml-2 h-4 w-4" />
												</Button>
											</div>
										{:else if cell.id === 'owner'}
											<Button variant="ghost" on:click={props.sort.toggle}>
												<Render of={cell.render()} />
												<Icon data={arrowsV} class="ml-2 h-4 w-4" />
											</Button>
										{:else}
											<Render of={cell.render()} />
										{/if}
									</Table.Head>
								</Subscribe>
							{/each}
						</Table.Row>
					</Subscribe>
				{/each}
			</Table.Header>
			<Table.Body {...$tableBodyAttrs}>
				{#each $pageRows as row (row.id)}
					<Subscribe rowAttrs={row.attrs()} let:rowAttrs>
						<Table.Row {...rowAttrs} data-state={$selectedDataIds[row.id] && 'selected'}>
							{#each row.cells as cell (cell.id)}
								<Subscribe attrs={cell.attrs()} let:attrs>
									<Table.Cell {...attrs}>
										{#if cell.id === 'followers'}
											<div class="font-medium">
												<Render of={cell.render()} />
											</div>
										{:else if cell.id === 'owner'}
											<div class="capitalize">
												<Render of={cell.render()} />
											</div>
										{:else if cell.id === 'link'}
											<div class="hover:underline">
												{@html cell.render()}
											</div>
										{:else}
											<Render of={cell.render()} />
										{/if}
									</Table.Cell>
								</Subscribe>
							{/each}
						</Table.Row>
					</Subscribe>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
	<div class="flex items-center justify-end space-x-4 py-4">
		<div class="flex-1 text-sm text-muted-foreground">
			{#if Object.keys($selectedDataIds).length > 0}
				<button
					class="bold underline"
					on:click={downloadCSV(Object.keys($selectedDataIds).map((k) => Number(k)))}
					>Download
				</button>
			{/if}
			{Object.keys($selectedDataIds).length} of{' '}
			{$rows.length} row(s) selected.
		</div>
		<Button
			variant="outline"
			size="sm"
			on:click={() => ($pageIndex = $pageIndex - 1)}
			disabled={!$hasPreviousPage}>Previous</Button
		>
		<Button
			variant="outline"
			size="sm"
			disabled={!$hasNextPage}
			on:click={() => ($pageIndex = $pageIndex + 1)}>Next</Button
		>
	</div>
</div>
