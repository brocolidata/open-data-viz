<script>
    import { page } from "$app/stores";
    import { getDashboardByName } from "$lib/utils/stores";
    import { onMount } from "svelte";
    import Grid from "svelte-grid";
    import gridHelp from "svelte-grid/build/helper/index.mjs";
    import Tile from "$lib/components/dashboard/tile.svelte";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    import { buttonVariants } from "$lib/components/ui/button/index.js";
    import Ellipsis from '@lucide/svelte/icons/ellipsis';
    import Pencil from '@lucide/svelte/icons/pencil';
    import Plus from '@lucide/svelte/icons/plus'
    import {
        toggleEditInTiles
    } from "$lib/utils/grid_utils.ts";
    import DashboardFilterBar from "$lib/components/dashboard/dashboard_filter_bar.svelte";
    import { setContext } from 'svelte';
    import { createFiltersStore } from "$lib/utils/stores";
    
    // Create one filters store for this dashboard
	// const filtersStore = createFiltersStore();
    let filtersStore = createFiltersStore();

    // Provide it to all children (tiles, filter bar, etc.)
    setContext('filters', filtersStore);

    let {
        dashboardName,
        dataAppName="",
        editURL
    } = $props()
    
    const COLS = 6;
    const cols = [[1200, COLS]];
    const editMode = false;
    let tiles = $state({});
    
    let dashboard = $derived(getDashboardByName(dashboardName));
    let items = $derived.by(() => {
        if (dashboard?.tiles) {
            return dashboard.tiles.map((tile) => ({
                ...tile,
                // ref: null, // add this line
                [COLS]: gridHelp.item(tile[COLS] || { x: 0, y: 0, w: 2, h: 2 }),
            }));
        } else {
            return [];
        }
    });
    onMount(() => {
        toggleEdit(); // ensure attributes are set based on editMode
    });
    function toggleEdit() {
        items = toggleEditInTiles(items, COLS, editMode);
    }

    function bindTileRef(item) {
        return el => item.ref = el;
    }

    function removeFilterFromTile(filterToRemove) {
        const tile = tiles[filterToRemove.tileID]
        tile?.unselect?.(filterToRemove);
    }
</script>


<DashboardFilterBar onRemoveFilter={(filterToRemove) => (removeFilterFromTile(filterToRemove))}/>
<div class="flex items-center mb-4">
    <h2 class="text-3xl font-bold tracking-tight">{dashboardName}</h2>
    <!-- <div class="flex items-center space-x-2"> -->
    <DropdownMenu.Root>
        <DropdownMenu.Trigger class={buttonVariants({ variant: "ghost", size:"icon" })}>
            <Ellipsis />
        </DropdownMenu.Trigger>
        <DropdownMenu.Content class="w-56">
            <DropdownMenu.Group>
                <DropdownMenu.Group>
                    <DropdownMenu.Item>
                        <!-- <span>Edit</span> -->
                        <Pencil class="mr-2 size-4"/>
                        <a href={editURL} class="w-full block">Edit</a>
                    </DropdownMenu.Item>
                </DropdownMenu.Group>
            </DropdownMenu.Group>
        </DropdownMenu.Content>
    </DropdownMenu.Root>
    <!-- </div> -->
</div>

<div class="w-full">
    <Grid bind:items rowHeight={100} let:item let:dataItem {cols}>
        <Tile
            bind:this={tiles[dataItem.id]}
            dataItem={dataItem} 
            {editMode}
        />
    </Grid>
</div>