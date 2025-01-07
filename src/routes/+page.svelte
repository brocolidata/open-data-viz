<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import DataTable from "$lib/components/data/table.svelte";
	import { onMount } from 'svelte'
	import { loadData } from "$lib/duckdb"

	import Sun from "lucide-svelte/icons/sun";
	import Moon from "lucide-svelte/icons/moon";

	import { toggleMode } from "mode-watcher";

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

<Button onclick={toggleMode} variant="outline" size="icon">
	<Sun
	  class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
	/>
	<Moon
	  class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
	/>
	<span class="sr-only">Toggle theme</span>
</Button>

<h1>Duck DB Svelte-kit demo</h1>

<form class="flex w-full max-w-sm items-center space-x-2">
	<Input id="table-name" bind:value={tableName} placeholder="table name" />
	<Button type="submit" variant="secondary" onclick={() => displayTable()}>Query Data</Button>
  </form>
<Button variant="destructive" onclick={() => clearTableTag()}>Clear Query</Button>

{#if renderedData}
	<DataTable {tableName} />
{/if}
