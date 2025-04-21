<script>
    import { Button } from "$lib/components/ui/button";
    import * as Sheet from "$lib/components/ui/sheet/index.js";
    import JSONEditor from "$lib/components/code_editor/json.svelte";
    import SQLEditor from "$lib/components/code_editor/sql.svelte";

    let {
        remove,
        sqlQueryInput = $bindable(), 
        chartOptionsInput = $bindable(),
        onSave
    } = $props();

    let sqlQueryInputContent = $state(sqlQueryInput || "");
    let chartOptionsInputContent = $state(chartOptionsInput || {});

    function saveChartOptions() {
        chartOptionsInput = chartOptionsInputContent;
        onSave();  
    }

    function saveChartQuery() {
        sqlQueryInput = sqlQueryInputContent;
        onSave();
    }
    

</script>

<div class="bg-gray-100 dark:bg-gray-600 shadow p-4">
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
        </Sheet.Header>
        <div class="mt-4 max-h-[80vh] space-y-6 overflow-auto">
            <div class="space-y-2">
                <label
                    for="query"
                    class="block text-sm font-medium text-gray-700 dark:text-gray-100"
                    >SQL Query</label
                >
                <div class="h-[300px] overflow-auto">
                    <SQLEditor bind:content={sqlQueryInputContent}/>
                </div>
                <Button onclick={saveChartQuery} variant="secondary">Save Query</Button>
            </div>
            <div class="space-y-2">
                <label
                    for="chart_options"
                    class="block text-sm font-medium text-gray-700 dark:text-gray-100"
                    >Chart Options</label
                >
                <div class="h-[300px] overflow-auto">    
                    <JSONEditor bind:content={chartOptionsInputContent}/>
                </div>
                <Button onclick={saveChartOptions} variant="secondary">Save Chart Options</Button>
            </div>
        </div>
    </Sheet.Content>
    </Sheet.Root>
</div>