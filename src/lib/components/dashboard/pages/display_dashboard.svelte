<script>
    import { page } from "$app/stores";
    import { getDashboardByName } from "$lib/utils/stores";
    import { onMount } from "svelte";
    import Grid from "svelte-grid";
    import gridHelp from "svelte-grid/build/helper/index.mjs";
    import Tile from "$lib/components/dashboard/tile.svelte";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    import { buttonVariants } from "$lib/components/ui/button/index.js";
    import { Ellipsis, Pencil, Plus } from 'lucide-svelte';
    import {
        toggleEditInTiles
    } from "$lib/utils/grid_utils.ts";

    let {
        dashboardName,
        dataAppName="",
        editURL
    } = $props()
    
    const COLS = 6;
    const cols = [[1200, COLS]];
    const editMode = false;
    
    let dashboard = $derived(getDashboardByName(dashboardName));
    let items = $derived.by(() => {
        if (dashboard?.tiles) {
            return dashboard.tiles.map((tile) => ({
                ...tile,
                [COLS]: gridHelp.item(tile[COLS] || { x: 0, y: 0, w: 2, h: 2 }),
            }));
        } else {
            return [];
        }
    })
    onMount(() => {
        toggleEdit(); // ensure attributes are set based on editMode
    });
    function toggleEdit() {
        items = toggleEditInTiles(items, COLS, editMode);
    }
</script>


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
            dataItem={dataItem} 
            {editMode}
        />
    </Grid>
</div>