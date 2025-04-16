<!-- <svelte:head>
	<link href="node_modules/gridstack/dist/gridstack.min.css" rel="stylesheet"/>
</svelte:head> -->

<script>
	import { onMount } from "svelte";
	import { GridStack } from "gridstack";
	// import 'gridstack/dist/gridstack.min.css';
	// import * as GridStack  from 'node_modules/gridstack/dist/gridstack.all.js';

	import { JSONEditor } from "svelte-jsoneditor";
	import * as echarts from "echarts";
	import { tick } from "svelte";
	import { Button } from "$lib/components/ui/button/index.js";

	// ... (Existing code from previous response)

	let dashboardName = $state("My Dashboard"); // Initialize with a default name or fetch from data
	let isSaving = $state(false); // Track saving state
	let grid = $state();
  	let tiles = $state([]);
	let editMode = $state(true);
	const defaultChartOptions = {};
	const randomID = () => "_" + Math.random().toString(36).substr(2, 9);


	onMount(async () => {
		// 1. Get dashboard name from URL
		dashboardName = window.location.pathname.split("/").pop(); // Extract from URL

		// 2. Initialize Gridstack
		const gridElement = document.getElementById("grid");
		grid = GridStack.init({
			el: gridElement,
			disableResize: !editMode,
			disableDrag: !editMode,
			column: 12,
		}); // Set column count

		// 3. Load dashboard data (from localStorage for now)
		const storedData = localStorage.getItem(`dashboard-${dashboardName}`);
		if (storedData) {
			const parsedData = JSON.parse(storedData);
			dashboardName = parsedData.name;
			tiles = parsedData.tiles || [];

			//Important : destroy existing widgets before re-rendering from storage
			grid.removeAll();
			tiles.forEach((tile) => addTile(tile));
		} else {
			//If no data in storage, add a default tile
			addTile();
		}
	});

	function saveDashboard() {
		isSaving = true; // Set saving state
		const layout = grid.save(true);
		const dashboardData = {
			name: dashboardName,
			tiles: layout, // Include tile data in the saved object
		};
		console.log("Saving dashboard:", dashboardData); // For now, just log
	}

	// ... (Rest of your existing code)

	function addTile(tileData = null) {
		const newTile = tileData || {
			id: randomID(),
			x: 0,
			y: 0,
			w: 3, // Initial width
			h: 3, // Initial height
			chartOptions: defaultChartOptions,
			showChart: true,
		};

		tiles = [...tiles, newTile]; // Add to the tiles array

		// Create Gridstack element
		const tileElement = document.createElement("div");
		tileElement.classList.add("grid-stack-item");
		tileElement.dataset.id = newTile.id;
		tileElement.innerHTML = `
      		<div class="grid-stack-item-content">
        		<button on:click={() => toggleChartEditor(newTile)}>
          			${newTile.showChart ? "Edit JSON" : "Edit Chart"}
        		</button>
        		{#if newTile.showChart}
          			<div id="chart-${newTile.id}" style="width: 100%; height: 200px;"></div>
        		{:else}
          			<div id="editor-${newTile.id}" style="width: 100%; height: 200px;"></div>
        		{/if}
      		</div>
    	`;

		grid.addWidget(tileElement, newTile.x, newTile.y, newTile.w, newTile.h);
	}

	function toggleChartEditor(tile) {
		tile.showChart = !tile.showChart;
		tiles = tiles; // Trigger reactivity
	}

	function exportLayout() {
		const layout = grid.save(true); // Save grid layout with tile data
		console.log(JSON.stringify(layout, null, 2)); // Export as JSON
	}

	function toggleEditMode() {
		editMode = !editMode;
		grid.enableMove(editMode);
		grid.enableResize(editMode);
	}
</script>

<div class="dashboard-bar bg-gray-200 dark:bg-gray-700 gap-4">
	<input
		type="text"
		bind:value={dashboardName}
		placeholder="Dashboard Name"
	/>
	<!-- <button class="text-gray-900 dark:text-gray-100" onclick={addTile}>Add Tile</button> -->
	<Button onclick={addTile}>Add Tile</Button>
	<!-- <button class="text-gray-900 dark:text-gray-100" onclick={saveDashboard} disabled={isSaving}>
		{isSaving ? "Saving..." : "Save Dashboard"}
	</button> -->
	<Button onclick={saveDashboard} disabled={isSaving}>
		{isSaving ? "Saving..." : "Save Dashboard"}
	</Button>
	{#if !editMode}
		<!-- <button class="text-gray-900 dark:text-gray-100" onclick={exportLayout}>Export Layout</button> -->
		<Button onclick={exportLayout}>Export Layout</Button>
	{/if}
	<!-- <button class="text-gray-900 dark:text-gray-100" onclick={toggleEditMode}>
		{editMode ? "View Mode" : "Edit Mode"}
	</button> -->
	<Button onclick={toggleEditMode}>
		{editMode ? "View Mode" : "Edit Mode"}
	</Button>
</div>

<h1 class="text-4xl font-bold text-gray-900 dark:text-gray-100">
	{dashboardName}
</h1>
<div id="grid" class="grid-stack"></div>

<style>
	/* Style for the dashboard bar */
	.dashboard-bar {
		/*background-color: #f0f0f0; /* Example background color */
		padding: 10px;
		display: flex; /* Arrange buttons horizontally */
		align-items: center; /* Vertically align items */
	}

	.dashboard-bar button {
		margin-right: 10px; /* Add spacing between buttons */
	}

	.dashboard-bar input[type="text"] {
		padding: 5px;
		border: 1px solid #ccc;
		margin-right: 10px;
	}
</style>
