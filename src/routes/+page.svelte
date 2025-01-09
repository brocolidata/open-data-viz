<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import DataTable from "$lib/components/data/table.svelte";
	import { onMount } from 'svelte'
	import { loadData } from "$lib/duckdb"
	// import { loadDataSync } from "$lib/duckdb"
	import { DoubleBounce } from 'svelte-loading-spinners';
	import * as Card from "$lib/components/ui/card/index.js";
    // import { writable } from "svelte/store";


	let tableName = $state();
	let renderedData = $state(false);
	let appIsReady = $state();
	
	function clearTableTag() {
		renderedData = false;
	}

	function displayTable() {
		renderedData = true
    }
	
	
	// onMount(() => {
	// 	appIsReady = loadData();
	// });
	
</script>