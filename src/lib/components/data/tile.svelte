<script>
    import { writable } from "svelte/store";
    import { Button } from "$lib/components/ui/button";
    import * as Card from "$lib/components/ui/card/index.js";
    import { getDataByQuery } from "$lib/duckdb.ts"
    import * as echarts from "echarts";
    import { resize } from "@svelte-put/resize";
    import { cn } from "$lib/utils.js";
    import { onMount } from "svelte";
    import { Switch } from "$lib/components/ui/switch/index.js";
    import * as Sheet from "$lib/components/ui/sheet/index.js";
    import CodeMirror from "svelte-codemirror-editor";
    import { json } from "@codemirror/lang-json";
    import { sql } from "@codemirror/lang-sql";


    let { remove, tileID } = $props();
    let editMode = $state("edit");
    let viewMode = $state("data");
    let sqlQuery = $state("");
    let sqlQueryInput = $state("");
    let chartOptions = $state({});
    let chartOptionsInputString = $state("{}");
    let chartOptionsInput = $state({})
    let chart = $state();
    let chartContainer = $state();
    let datasetRows = writable([]);
    let chartFullOptions = $derived({
        ...chartOptions,
        dataset: { source: datasetRows },
    });

    onMount(() => {
        console.log('Tile ID:', tileID);
        chart = echarts.init(chartContainer);
        
        // Cleanup
		return () => {
			chart.dispose();
		};
    });

    $effect(() => {
		// Set initial options
		console.log('Chart full options:', chartFullOptions);
        chart.setOption(chartFullOptions);
	});

	function resizeChart() {
		chart.resize();
	}

    async function executeQuery(query) {
        // Fetch the ArrowTable
        console.log('query executed:', query);
        const arrowTable = await getDataByQuery(query);

        // Extract schema and rows
        const columns = arrowTable.schema.fields.map((field) => field.name); // Column names
        console.log("Columns:", columns);

        const rawRows = arrowTable.toArray(); // Array of rows
        // Convert each row (Proxy(StructRow)) into an object with column names as keys
        const rows = rawRows.map((row) => {
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

        console.log("Updated datasetRows:", datasetRows);

        return rows;
    }

    const saveChartOptions = () => {
        try {
            // const options = JSON.parse(event.target.value);
            chartOptionsInput = JSON.parse(chartOptionsInputString)
            chartOptions = chartOptionsInput;
        } catch (error) {
            console.error("Invalid JSON", error);
        }
    };

    const saveChartQuery = async () => {
        try {
            sqlQuery = sqlQueryInput;
            datasetRows = await executeQuery(sqlQuery);
        } catch (error) {
            console.error("Invalid JSON", error);
        }
    };

    function toggleViewMode(mode) {
        viewMode = mode;
    }

</script>

<div class="h-full w-full bg-gray-300">

    <div class="bg-gray-100 dark:bg-gray-600 shadow p-4 relative">
        <Sheet.Root>
            <div class="tile-top-bar absolute top-2 right-2 flex items-center">
                <Sheet.Trigger class="mr-2">Edit</Sheet.Trigger>
                <button
                    onpointerdown={(e) => e.stopPropagation()}
                    onclick={() => remove()}
                    class="remove"
                >
                    ✕
                </button>
            </div>
        <Sheet.Content>
            <Sheet.Header>
            <Sheet.Title>Edit</Sheet.Title>
            <!-- <Sheet.Description>
                This action cannot be undone. This will permanently delete your account
                and remove your data from our servers.
            </Sheet.Description> -->
            </Sheet.Header>
            <div class="mt-4">
                    <div>
                        <label
                            for="query"
                            class="block text-sm font-medium text-gray-700 dark:text-gray-100"
                            >SQL Query</label
                        >
                        <CodeMirror bind:value={sqlQueryInput} lang={sql()} />
                        <Button onclick={saveChartQuery} variant="secondary">Save Query</Button>
                    </div>
                    <label
                        for="chart_options"
                        class="block text-sm font-medium text-gray-700 dark:text-gray-100"
                        >Chart Options</label
                    >
                    <CodeMirror bind:value={chartOptionsInputString} lang={json()} />
                    <Button onclick={saveChartOptions} variant="secondary">Save Chart Options</Button>
            </div>
        </Sheet.Content>
        </Sheet.Root>
        
    </div>
    <div
            bind:this={chartContainer}
            class="chart-container items-center justify-center h-full w-full "
            use:resize onresized={resizeChart}
        ></div>
</div>