<script>
    import { onMount } from 'svelte';
    import { Label } from "$lib/components/ui/label/index.js";
    import Button from "$lib/components/ui/button/button.svelte";
    import { getDataSources } from "$lib/utils/odv_config";
    import { getDataByQuery } from "$lib/utils/duckdb";
    import Combobox from "$lib/components/custom_ui/combobox.svelte";
    import ChartDimensions from "./ui_editor_components/chart_dimensions.svelte";
    import ChartMetrics from "./ui_editor_components/chart_metrics.svelte";
    import ChartSeries from "./ui_editor_components/chart_series.svelte";
    import ChartProperties from "./ui_editor_components/chart_properties.svelte";
    import * as Alert from "$lib/components/ui/alert/index.js";
    import CircleAlert from '@lucide/svelte/icons/circle-alert';
    import Check from '@lucide/svelte/icons/check';
    import Save from '@lucide/svelte/icons/save';
    import {
        fetchColumnOptions,
        getDataSourceOptions,
        aggregationOptions,
        // inferSeries,
        buildChartQuery,
        runChartQuery
    } from "$lib/utils/charts_utils";
    import { Separator } from "$lib/components/ui/separator/index.js";
    
    let { configuration = $bindable(), onSave } = $props(); 

    const data_sources = getDataSources();
    const dataSourceOptions = getDataSourceOptions(data_sources);
    let chartProperties = $state(configuration?.chartProperties || {});
    let dataSource = $state(configuration?.dataset || "");
    // let columnOptions = $state([]);
    let columnOptionsPromise = $derived.by(async () => {
        const cols = await fetchColumnOptions(dataSource);
        return cols
    })
    let mainDimension = $state(configuration?.mainDimension || "");
    let secondaryDimension = $state(configuration?.secondaryDimension || "");
    let mainMetric = $state(configuration?.mainMetric || { column: "", aggregation: "" });
    let secondaryMetrics = $state(configuration?.secondaryMetrics || []);
    let seriesList = $state(configuration?.seriesList || []);
    let dimensionOnXAxis = $state(configuration?.dimensionOnXAxis ?? true);

    // Configuration validation state
    let configIsInvalid = $state(false);
    
    // Inputs assembly states
    let queryInputsValid = $derived(() =>
		dataSource &&
		mainDimension &&
		(mainMetric?.column && mainMetric?.aggregation ||
		secondaryMetrics.some(m => m.column && m.aggregation))
	);
    let chartQueryParams = $derived({
		dataset: dataSource,
		mainDimension: mainDimension,
		secondaryDimension: secondaryDimension,
		mainMetric: mainMetric,
		secondaryMetrics: secondaryMetrics
	});
    let chartQuery = $derived(
		queryInputsValid ? buildChartQuery(chartQueryParams) : null
	);

    // Series state
    let chartDataColumns = $state([]);

    // Save dashboard state
    let disableSave = $state(false);
    let saveSuccess = $state(false);
    let isSaving = $state(false);

    // Refresh configIsInvalid
    $effect(() => {
        configIsInvalid =
            secondaryDimension !== "" && secondaryMetrics.length > 0;
        console.log("Config Is Invalid:", configIsInvalid);
        disableSave = configIsInvalid
    });
    $effect(() => {
        if (dataSource) {
            updateColumns();
        }
    })

    // Function to refetch column options when dataSource changes
    async function updateColumns() {
        if (dataSource) {
            columnOptionsPromise = await fetchColumnOptions(dataSource);
            // Reset dimensions when changing dataset
            mainDimension = "";
            // secondaryDimensions = [];
            secondaryDimension = "";
        }
    }

    // Fetch preview data for column inference
	$effect(async () => {
		if (!chartQuery) return;
		const { columns } = await runChartQuery(chartQuery);
		chartDataColumns = columns;
	});
    
    function saveConfiguration() {
        isSaving = true;
        
        configuration = {
            dataset: dataSource,
            mainDimension,
            secondaryDimension,
            mainMetric,
            secondaryMetrics,
            seriesList,
            dimensionOnXAxis,
            chartProperties
        }        
        onSave();
        
        // Trigger animation
        saveSuccess = true;

        // Reset to original after 2 seconds
        setTimeout(() => {
            saveSuccess = false;
        }, 2000);

        isSaving = false;
    }
        
   
</script>

<!-- UI -->

{#if configIsInvalid === true}
    <div class="mt-4 text-red-500 text-sm font-medium">
        <Alert.Root variant="destructive">
            <CircleAlert class="size-4" />
            <Alert.Title>Error</Alert.Title>
            <Alert.Description
                >You can't use a secondary dimension and multiple metrics at the
                same time."</Alert.Description
            >
        </Alert.Root>
    </div>
{/if}

<div>
    <ChartProperties bind:chartProperties />
    <div class="mt-4 space-y-2 flex flex-col">
        <!-- <Label>Dataset</Label> -->
        <h2
            class="mt-4 mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100"
        >
            Dataset
        </h2>
        <Combobox
            boxOptions={dataSourceOptions}
            objectName="data source"
            bind:value={dataSource}
        />
    </div>
    <div class="py-2">
        <Separator />
    </div>
    {#if dataSource}
        {#await columnOptionsPromise then columnOptions}
            <ChartDimensions
                {columnOptions}
                bind:mainDimension
                bind:secondaryDimension
            />
            <ChartMetrics
                {columnOptions}
                bind:mainMetric
                bind:secondaryMetrics
            />
        {/await}
        {#if mainDimension && mainMetric?.column && mainMetric?.aggregation}
            <ChartSeries
                {chartQueryParams}
                {chartDataColumns} 
                bind:seriesList
                {queryInputsValid}
                bind:dimensionOnXAxis
            />
            <Button 
                variant="secondary" 
                onclick={saveConfiguration} 
                disabled={disableSave || isSaving} 
                class="flex items-center"
            >
                {#if saveSuccess}
                    <Check class="mr-2 size-4 text-green-600 transition-opacity duration-300" />
                    Save chart
                {:else}
                    <Save class="mr-2 size-4" />
                    Save chart
                {/if}
            </Button>
        {/if}
    {:else}
        Select a Dataset to see its dimensions and metrics
    {/if}
</div>
