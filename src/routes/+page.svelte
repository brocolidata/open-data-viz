<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import DataTable from "$lib/components/data/table.svelte";
	import { onMount } from 'svelte'
	import { loadData } from "$lib/duckdb"

	let tableName = $state();
	let renderedData = $state(false);

	function clearTableTag() {
		renderedData = false;
	}

	function displayTable() {
		renderedData = true
    }
	
	onMount(() => {
		loadData();
	});

</script>


<h1>Duck DB Svelte-kit demo</h1>

<form class="flex w-full max-w-sm items-center space-x-2">
	<Input id="table-name" bind:value={tableName} placeholder="table name" />
	<Button type="submit" variant="secondary" onclick={() => displayTable()}>Query Data</Button>
  </form>
<Button variant="destructive" onclick={() => clearTableTag()}>Clear Query</Button>

{#if renderedData}
	<DataTable {tableName} />
{/if}
