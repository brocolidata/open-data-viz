<script>
    import Grid from "svelte-grid";
    import gridHelp from "svelte-grid/build/helper/index.mjs";
    import Tile from "$lib/components/dashboard/tile.svelte";
    import { createDashboard } from "$lib/utils/stores";
    import DashboardEditBar from "$lib/components/dashboard/dashboard_edit_bar.svelte";
    import {
        labelToName,
        createNewTile,
        removeTile,
        updateTile as updateTileHelper,
        toggleEditInTiles
    } from "$lib/utils/grid_utils";


    const COLS = 6;
    const cols = [[1200, COLS]];
    const id = () => "_" + Math.random().toString(36).substr(2, 9);
    const randomNumberInRange = (min, max) => Math.random() * (max - min) + min;

    let dashboardLabel = $state("My Dashboard");
    let dashboardName = $derived(labelToName(dashboardLabel));
    let dashboardDescription = $state("Description");
    let isSaving = $state(false);
    let editMode = $state(true);
    let adjustAfterRemove = false;
    let items = $state([
        {
            [COLS]: gridHelp.item({
                x: 0,
                y: 0,
                w: 2,
                h: 2,
            }),
            id: id(),
        },
    ]);
    let dashboardState = $derived({
        name: dashboardName,
        label: dashboardLabel,
        description: dashboardDescription,
        definition_source: "in memory",
        tiles: items,
    });


    function toggleEdit() {
        items = toggleEditInTiles(items, COLS, editMode);
    }
    
    function addTile() {
        items = [...items, createNewTile(editMode, items)];
    }

    function remove(item) {
        items = removeTile(items, item.id, adjustAfterRemove);
    }

    function saveDashboard() {
        isSaving = true;
        createDashboard(dashboardState);
        console.log(`Successfully saved ${dashboardLabel} dashboard.`);
    }

    function updateTile(updated) {
        items = updateTileHelper(items, updated);
    }
</script>

<DashboardEditBar
    bind:editMode
    bind:isSaving
    bind:dashboardLabel
    bind:dashboardDescription
    {dashboardState}
    {addTile}
    {COLS}
    onEditModeToggle={toggleEdit}
/>
<div class="flex items-center justify-between space-y-2 ps-8 pt-3">
    <h2 class="text-3xl font-bold tracking-tight">{dashboardLabel}</h2>
</div>

<div class="w-full">
    <Grid bind:items rowHeight={100} let:item let:dataItem {cols}>
        <Tile
            remove={() => remove(dataItem)}
            {dataItem}
            {editMode}
            onUpdate={(event) => updateTile(event)}
        />
    </Grid>
</div>
