<script>
    import { writable } from "svelte/store";
    import { getDataByQuery } from "$lib/utils/duckdb";
    import * as echarts from "echarts";
    import { resize } from "@svelte-put/resize";
    import { cn } from "$lib/utils.js";
    import { onMount, onDestroy, tick } from "svelte";
    import TileEditBar from "$lib/components/dashboard/tile_edit_bar.svelte";
    import { mode } from "mode-watcher";
    import { 
        buildChartQuery, 
        buildOptionsFromUI, 
        extractDatasetFromChartConfiguration 
    } from "$lib/utils/charts_utils";
    import { getContext } from 'svelte';
    import { dataLoaded } from '$lib/utils/stores';


    let { remove, dataItem = $bindable(), editMode, onUpdate } = $props();
    let lastHighlighted = $state(null);
    let chart = $state();
    let chartContainer = $state();
    let datasetRows = writable([]);
    let chartConfiguration = $state(dataItem?.chartConfiguration || {});
    let datasetName = $state();
    let initializedChart = $state(false);
    let filtersStore = getContext('filters');
    let chartFilters = $state([]);

    onMount(async () => {
        chart = echarts.init(chartContainer, $mode === 'dark' ? 'dark' : undefined);
        datasetName = extractDatasetFromChartConfiguration(dataItem?.chartConfiguration);
        if (chartConfiguration?.type && $dataLoaded) {
            await refreshTile();
        }
        chart.on('click', (params) => {
            console.log('chart clicked:', params);
            const dimensionCandidates = params.dimensionNames.filter(name => name !== params.seriesName);
            const filterDimension = dimensionCandidates[0];
            const filterValue = params.value[filterDimension];

            const filter = {
                tileID: dataItem?.id,
                datasetName: datasetName,
                column: filterDimension,
                value: filterValue,
                dispatchEvent: {
                    seriesIndex:params.seriesIndex,
                    dataIndex:params.dataIndex,
                }
            };

            filtersStore.update((current) => {
                const existsInFiltersStore = current.some(
                    (f) => (
                        f.tileID === filter.tileID &&
                        f.datasetName === filter.datasetName &&
                        f.column === filter.column &&
                        f.value === filter.value
                    )
                );
                return existsInFiltersStore ? current : [...current, filter];
            });
            const existsInChartFilters = chartFilters.some(
                (f) => (
                    f.tileID === filter.tileID &&
                    f.datasetName === datasetName &&
                    f.column === filter.column &&
                    f.value === filter.value
                )
            );
            if (!existsInChartFilters) {
                chartFilters = [...chartFilters, filter];
            }
        });
        await tick();
        if (filtersStore) {
            // Subscribe to the filter store *after* the component has mounted
            const unsubscribe = filtersStore.subscribe((filters) => {
                // Filter only those relevant to this tile
                const activeFilters = filters.filter(
                    (f) => (
                        f.datasetName === datasetName &&
                        f.tileID !== dataItem?.id
                    )
                );
                console.log(`DEBUG activeFilters for tile ${dataItem?.id}: `, activeFilters);

                // Rebuild query if filters changed
                if (initializedChart && activeFilters.length > 0 && $dataLoaded) {
                    refreshQueryWithFilters(activeFilters);
                } else if (initializedChart && activeFilters.length === 0 && $dataLoaded) {
                    refreshTile();
                }
                
            });
        }
        
        initializedChart = true;
        return () => {
            unsubscribe?.();
            chart.dispose();
        };
    });

    function refreshQueryWithFilters(activeFilters) {
        let sqlQuery;
        let chartOptions;
        if (dataItem?.chartConfiguration.type === "ui") {
            sqlQuery = buildChartQuery(dataItem.chartConfiguration.configuration, activeFilters);
            chartOptions = buildOptionsFromUI(
                {...dataItem?.chartConfiguration.configuration, theme:$mode})
        } else {
            const { sqlQuery, chartOptions } = dataItem?.chartConfiguration.configuration;
        }
		applyFiltersOnTile(sqlQuery, chartOptions);
	}

    export function unselect(filter) {
        chart?.dispatchAction({
            type: 'unselect',
            ...filter.dispatchEvent
        });
	}

    mode.subscribe(
        theme => {
            if (initializedChart) {
                reinitChart();
            }
        }
    )
    dataLoaded.subscribe(
        isLoaded => {
            if (isLoaded && initializedChart) {
                refreshTile()
            }
        }
    )
    
    function reinitChart() {
        disposeOfChart();   // clean current chart
        chart = echarts.init(chartContainer, $mode === 'dark' ? undefined : 'dark');
        refreshTile();     // redraw the chart options
    }
    
    function resizeChart() {
        chart.resize();
    }

    function disposeOfChart() {
        chart.dispose();
    }

    async function getDatasetFromQuery(query) {
        try {
            const arrowTable = await getDataByQuery(query);
            const columns = arrowTable.schema.fields.map((field) => field.name);
            const rawRows = arrowTable.toArray();
            const rows = rawRows.map((row) => {
                const rowData = {};
                columns.forEach((col, index) => {
                    rowData[col] = row[col];
                });
                return rowData;
            });
            return rows;
        } catch (error) {
            console.error("Error executing query:", error);
            return [];
        }
    }

    async function saveTile() {
        try {
            await refreshTile();
            onUpdate({
                id: dataItem.id,
                chartConfiguration
            });
        } catch (e) {
            console.error("Error saving tile:", e);
            datasetRows.set([]);
        }
    }

    async function applyFiltersOnTile(sqlQuery, chartOptions) {
        const rows = await getDatasetFromQuery(sqlQuery);
        datasetRows.set(rows);
        const fullChartOptions = {
            ...chartOptions,
            dataset: { source: $datasetRows }
        };
        chart.setOption(fullChartOptions);
    }

    async function refreshTile() {
        if (chartConfiguration.type === "advanced") {
            const { sqlQuery, chartOptions } = chartConfiguration.configuration;
            const rows = await getDatasetFromQuery(sqlQuery);
            datasetRows.set(rows);
            const fullChartOptions = { 
                ...chartOptions, 
                dataset: { source: $datasetRows } 
            };
            chart.setOption(fullChartOptions);
        } else {
            const sqlQuery = buildChartQuery(chartConfiguration.configuration);
            const rows = await getDatasetFromQuery(sqlQuery);
            const UIChartOptions = buildOptionsFromUI(
                {...chartConfiguration.configuration, theme:$mode})
            datasetRows.set(rows);
            const fullChartOptions = {
                ...UIChartOptions,
                dataset: { source: $datasetRows }
            };
            chart.setOption(fullChartOptions);
        }
    }

</script>

<div class="h-full w-full bg-gray-300">
    {#if editMode}
        <TileEditBar 
            remove={() => remove(dataItem)} 
            bind:chartConfiguration
            onSave={saveTile}
        />
    {/if}

    <div
        bind:this={chartContainer}
        class="chart-container items-center justify-center h-full w-full "
        use:resize onresized={resizeChart}
    ></div>
</div>