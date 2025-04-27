<script>
	import { onMount } from "svelte";
	import ChartSeriesItem from "./chart_series_item.svelte";
	import Button from "$lib/components/ui/button/button.svelte";
	import Switch from "$lib/components/ui/switch/switch.svelte";
	import Combobox from "$lib/components/custom_ui/combobox.svelte";
	import { inferSeries, getDataColumnsOptions } from "$lib/utils/charts_utils";

	let {
		chartQueryParams,
		chartDataColumns,
		seriesList = $bindable(),
		queryInputsValid,
		dimensionOnXAxis = $bindable(),
	} = $props();
	let mainDimension = $derived(chartQueryParams.mainDimension);
	let secondaryDimension = $derived(chartQueryParams.secondaryDimension);
	let mainMetric = $derived(chartQueryParams.mainMetric);
	let secondaryMetrics = $derived(chartQueryParams.secondaryMetrics);
	let columnOptions = $derived(getDataColumnsOptions(chartDataColumns));

	// Generate series when inputs are valid
    $effect(() => {
		if (queryInputsValid && seriesList.length === 0 && chartDataColumns.length > 0) {
			generateSeries()
		}
	});
    
    // Series functions 
    function generateSeries() {
		seriesList = inferSeries({
			mainDimension,
			secondaryDimension,
			mainMetric,
			secondaryMetrics,
			columns: chartDataColumns
		});
	}

	function removeSeries(index) {
		seriesList = seriesList.filter((_, i) => i !== index);
	}

	function addSeries() {
		seriesList = [...seriesList, { column: "", type: "line" }];
	}

	
	
</script>

<div class="space-y-4 mt-6">
	<div class="flex justify-between items-center">
		<h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
			Chart Series
		</h2>
	</div>

	{#if mainDimension && (secondaryDimension || secondaryMetrics.length > 0)}
		<Switch bind:checked={dimensionOnXAxis}>
			{dimensionOnXAxis ? "Dimension on X Axis" : "Dimension on Y Axis"}
		</Switch>
	{/if}

	{#each seriesList as series, i (i)}
		<ChartSeriesItem
			bind:series={seriesList[i]}
			{columnOptions}
			onRemove={() => removeSeries(i)}
		/>
	{/each}

	<Button variant="outline" class="mt-4" onclick={addSeries}
		>+ Add Series</Button
	>
	<Button onclick={generateSeries}
			>Regenerate from Dimensions & Metrics
	</Button>
</div>
