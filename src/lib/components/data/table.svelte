<script lang="ts">

	import * as Table from "$lib/components/ui/table/index.js";
	import { queryData } from '$lib/utils/duckdb';
    let { tableName } = $props();
	
	function getColumns(arrowTable) {
		let tableColumns = arrowTable.schema.fields.map((field) => field.name);
		return tableColumns;
	}

	function getData(arrowTable) {
		const data = arrowTable.toArray();
		return data;
	}
	
	async function getArrowTable() {
		const arrowTable = await queryData(tableName);
		return arrowTable;
	}

	function getCell(column, tableRow) {
		const cell = tableRow[column];
		return cell;
	}

</script>

{#snippet dataTable(arrowTable)}
	{@const columns = getColumns(arrowTable)}
	<!-- {@debug columns} -->
	{@const data = getData(arrowTable)}
	<Table.Root>
		<Table.Caption>{tableName}</Table.Caption>
		<Table.Header>
			{#each columns as column}
				<Table.Head>{column}</Table.Head>
			{/each}
		</Table.Header>
		<Table.Body>
			{#each data as row}
				<Table.Row>
					{#each columns as column}
						<Table.Cell>{getCell(column, row)}</Table.Cell>
					{/each}
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
{/snippet}

{#await getArrowTable() then arrowTable}
	{@render dataTable(arrowTable)}
{/await}