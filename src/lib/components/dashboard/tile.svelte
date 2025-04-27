<script>
    import { writable } from "svelte/store";
    import { getDataByQuery } from "$lib/utils/duckdb";
    import * as echarts from "echarts";
    import { resize } from "@svelte-put/resize";
    import { cn } from "$lib/utils.js";
    import { onMount } from "svelte";
    import TileEditBar from "$lib/components/dashboard/tile_edit_bar.svelte";
    import { buildChartQuery, buildOptionsFromUI } from "$lib/utils/charts_utils";
    import { mode } from "mode-watcher";

    let { remove, dataItem = $bindable(), editMode, onUpdate } = $props();
    let chart = $state();
    let chartContainer = $state();
    let datasetRows = writable([]);
    let chartConfiguration = $state(dataItem?.chartConfiguration || {});
    let initializedChart = $state(false);

    
    onMount(async () => {
        chart = echarts.init(chartContainer, $mode === 'dark' ? 'dark' : undefined);
        if (chartConfiguration?.type) {
            await refreshTile();
        }
        initializedChart = true;
        return () => chart.dispose();
    });

    mode.subscribe(
        theme => {
            if (initializedChart) {
                reinitChart();
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
            datasetRows.set(rows);
            const fullChartOptions = {
                ...buildOptionsFromUI(chartConfiguration.configuration),
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