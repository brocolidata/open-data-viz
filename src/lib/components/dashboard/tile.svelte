<script>
    import { writable } from "svelte/store";
    import { getDataByQuery } from "$lib/utils/duckdb";
    import * as echarts from "echarts";
    import { resize } from "@svelte-put/resize";
    import { cn } from "$lib/utils.js";
    import { onMount } from "svelte";
    import TileEditBar from "$lib/components/dashboard/tile_edit_bar.svelte";

    let { remove, dataItem = $bindable(), editMode, onUpdate } = $props();
    let viewMode = $state("data");
    let sqlQueryInput = $state(dataItem?.sqlQuery || "");
    let chartOptionsInput = $state(JSON.stringify(dataItem?.chartOptions || {}, null, 2));
    let chart = $state();
    let chartContainer = $state();
    let datasetRows = writable([]);
    let chartFullOptions = $derived({
        ...JSON.parse(chartOptionsInput || '{}'), // Use the input string directly for reactivity
        dataset: { source: $datasetRows },
    });

    
    onMount(async () => {
        chart = echarts.init(chartContainer);
        // Initial data fetch if a query exists
        if (dataItem?.sqlQuery) {
            const rows = await getDatasetFromQuery(dataItem.sqlQuery);
            datasetRows.set(rows);
        } else {
            datasetRows.set([]); // Ensure an initial empty dataset if no query
        }

        // Initial chart options if they exist
        if (dataItem?.chartOptions) {
            try {
                chart.setOption({
                    ...dataItem.chartOptions,
                    dataset: { source: $datasetRows } // Apply initial options
                });
            } catch (error) {
                console.error("Error setting initial chart options:", error);
            }
        }

        // Cleanup
        return () => {
            chart.dispose();
        };
    });

    function resizeChart() {
        chart.resize();
    }

    async function getDatasetFromQuery(query) {
        try {
            const arrowTable = await getDataByQuery(query);
            const columns = arrowTable.schema.fields.map((field) => field.name);
            console.log("Columns:", columns);
            const rawRows = arrowTable.toArray();
            const rows = rawRows.map((row) => {
                const rowData = {};
                columns.forEach((col, index) => {
                    rowData[col] = row[col];
                });
                return rowData;
            });
            datasetRows.set(rows);
            console.log("Updated datasetRows:", $datasetRows);
            return rows;
        } catch (error) {
            console.error("Error executing query:", error);
            datasetRows.set([]); // Set to empty on error
            return [];
        }
    }

    async function saveTile() {
        try {
            const parsedOptions = JSON.parse(chartOptionsInput || '{}');
            const rows = await getDatasetFromQuery(sqlQueryInput);

            // emit to parent
            onUpdate({
                id: dataItem.id,
                sqlQuery: sqlQueryInput,
                chartOptions: parsedOptions,
            });
            
            // update chart
            datasetRows.set(rows);
            chart.setOption({
                ...dataItem.chartOptions,
                dataset: { source: $datasetRows } // Apply initial options
            });
        } catch (e) {
            console.error("Invalid JSON or query error", e);
            datasetRows.set([]);
        }
    }

</script>

<div class="h-full w-full bg-gray-300">
    {#if editMode}
        <TileEditBar 
            remove={() => remove(dataItem)} 
            bind:sqlQueryInput={sqlQueryInput} 
            bind:chartOptionsInput={chartOptionsInput}
            onSave={saveTile}
        />
    {/if}

    <div
        bind:this={chartContainer}
        class="chart-container items-center justify-center h-full w-full "
        use:resize onresized={resizeChart}
    ></div>
</div>