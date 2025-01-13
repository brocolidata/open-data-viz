<script>
    import DashboardLayout from '$lib/components/data/generic_dashboard.svelte';
    import Visualisation from '$lib/components/data/generic_visualisation.svelte';
    import { onMount } from 'svelte';

    let { layout } = $props();
    console.log('Debug layout', layout);
    
</script>

{#if Array.isArray(layout)}
    {#each layout as childlayout}
        {#if childlayout.rows}
            {@const rowsNumber = Array.isArray(childlayout.rows) ? childlayout.rows.length : childlayout.rows.visualisations.length}
            <div class="grid grid-rows-{rowsNumber} h-full w-full grid-flow-row gap-4">
                <DashboardLayout layout={childLayout.rows} />
            </div>

        {:else if childlayout.columns}
            {@const columnsNumber = Array.isArray(childlayout.columns) ? childlayout.columns.length : childlayout.columns.visualisations.length}
            <div class="grid grid-cols-{columnsNumber} h-full w-full grid-flow-col gap-4">
                <DashboardLayout layout={childlayout.columns} />
            </div>
        {/if}
    {/each}
{:else}
    {#if layout.rows}
        {@const rowsNumber = layout.rows.length}
        <div class="grid grid-rows-{rowsNumber} h-full w-full grid-flow-row gap-4">
            <DashboardLayout layout={layout.rows} />
        </div>

    {:else if layout.columns}
        {@const columnsNumber = layout.columns.length}
        <div class="grid grid-cols-{columnsNumber} h-full w-full grid-flow-col gap-4">
            <DashboardLayout layout={layout.columns} />
        </div>
    {:else if layout.visualisations}
        {#each layout.visualisations as visualisationLayout}
            <Visualisation {visualisationLayout} />
        {/each}
    {/if}
{/if}