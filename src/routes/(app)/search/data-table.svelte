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

	type Playlist = {
		id: string; // include this in the csv?
		name: string; // -> try to use the hover image component.
		owner: string; // here we try to fetch display_name, fallback with id and link it using owner.href
		description: string; // can be null.
		followers: number;
		link: string; // use href property.
	};

	export const data: Playlist[] = [
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
		page: addPagination(),
		sort: addSortBy({ toggleOrder: ['asc', 'desc'] }),
		filter: addTableFilter({
			fn: ({ filterValue, value }) => value.toLowerCase().includes(filterValue.toLowerCase())
		}),
		hide: addHiddenColumns(),
		select: addSelectedRows()
	});
	const columns = table.createColumns([
		table.column({
			accessor: 'name',
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

	const hidableCols = ['id', 'name', 'owner', 'followers', 'description', 'link'];
</script>

<div>
	<div class="flex items-center py-4">
		<Input
			class="max-w-sm"
			placeholder="Filter description..."
			type="text"
			bind:value={$filterValue}
		/>
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
				<button class="bold underline">Download </button>
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
