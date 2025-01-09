<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import DataTable from "$lib/components/data/table.svelte";

	let tableName = $state();
	let renderedData = $state(false);

	function clearTableTag() {
		renderedData = false;
	}

	function displayTable() {
		renderedData = true
    }

</script>

<div class="flex items-center justify-center w-screen">
	<form class="flex w-full max-w-sm items-center space-x-2">
		<Input id="table-name" bind:value={tableName} placeholder="table name" />
		<Button type="submit" variant="secondary" onclick={() => displayTable()}>Query Data</Button>
		<Button variant="destructive" onclick={() => clearTableTag()}>Clear Query</Button>
	</form>
</div>


{#if renderedData}
	<DataTable {tableName} />
{/if}
