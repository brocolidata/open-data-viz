<script>
	import { onMount } from "svelte";
	import * as echarts from "echarts";
	import * as ecSimpleTransform from "echarts-simple-transform";
	import { queryData, getDataByQuery } from "$lib/duckdb";
	import { getVisualisationByName, getDatasetByName } from "$lib/odv_config";

	// Register the transform
	echarts.registerTransform(ecSimpleTransform.aggregate);

	export let visualisationLayout;

	const visualisationName = visualisationLayout.name;
	const visualisationConfig = getVisualisationByName(visualisationName);
	const visualisationEChartConfig = visualisationConfig.config;
	let chartContainer;
	let chart;

	// Find the dataset configuration
	const datasetConfig = getDatasetByName(visualisationConfig.dataset);
	if (!datasetConfig) {
		console.error(
			`Dataset ${visualisationConfig.dataset} not found for visualisation: ${visualisationConfig.name}`
		);
	}

	console.log('Debug visualisationEChartConfig:', visualisationEChartConfig);
	// Function to load and update chart data
	async function loadData() {
		if (!datasetConfig) return;

		// Fetch the ArrowTable
		// const arrowTable = await queryData(datasetConfig.data_source);
		const arrowTable = await getDataByQuery(datasetConfig.query);

		// Extract schema and rows
		const columns = arrowTable.schema.fields.map((field) => field.name); // Column names
		console.log("Columns:", columns);

		const rawRows = arrowTable.toArray(); // Array of rows
		// Convert each row (Proxy(StructRow)) into an object with column names as keys
		const rows = rawRows.map(row => {
			// Convert Proxy(StructRow) into an object (assuming StructRow has a toJSON method or direct access)
			const rowData = {};
			columns.forEach((col, index) => {
				// Access the value of each field in the StructRow using its index
				rowData[col] = row[col]; // This should access the field value from the row
			});
			return rowData; // Return the object with column names as keys and values from the row
		});

		// Transform to column-oriented layout
		const columnOrientedData = [columns, ...rows];

		console.log("Column-Oriented Data:", columnOrientedData);

		// add daa and update chart options
		const updatedOptions = {
			dataset: {
				source: rows,
			},
		};

		console.log("Updated Options:", updatedOptions);
		// // Update the chart
		chart.setOption(updatedOptions);
	}


	onMount(() => {
		chart = echarts.init(chartContainer);

		// Set initial options
		chart.setOption(visualisationEChartConfig);

		// Load data and update chart
		loadData();

		// Cleanup
		return () => {
			chart.dispose();
		};
	});
</script>

<div
	bind:this={chartContainer}
	class="chart-container items-center justify-center h-full w-full p-0 overflow-hidden"
	style="width: 600px;height:400px;"
></div>