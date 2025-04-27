<script>
    import { page } from "$app/stores";
    import { getDashboardByName } from "$lib/utils/stores";
    import { onMount } from "svelte";
    import Grid from "svelte-grid";
    import gridHelp from "svelte-grid/build/helper/index.mjs";
    import Tile from "$lib/components/dashboard/tile.svelte";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    import { buttonVariants } from "$lib/components/ui/button/index.js";
    import { Pencil } from 'lucide-svelte';
    import { Ellipsis } from 'lucide-svelte';



    const cols = [[1200, 6]];
    let dashboardName = $page.params.dashboard_name;
    let dashboard = $derived(getDashboardByName(dashboardName));
    $inspect("Dashboard name:", dashboardName);
    $inspect("dashboard:", dashboard);
    let items = $derived.by(() => {
        if (dashboard?.tiles) {
            return dashboard.tiles.map((tile) => ({
                ...tile,
                [6]: gridHelp.item(tile[6] || { x: 0, y: 0, w: 2, h: 2 }),
            }));
        } else {
            return [];
        }
    })
    $inspect("debug items:", items);
    let editMode = false;
</script>


<div class="flex items-center justify-between space-y-2 ps-8 pt-3">
    <h2 class="text-3xl font-bold tracking-tight">{dashboardName}</h2>
    <!-- <div class="flex items-center space-x-2"> -->
    <DropdownMenu.Root>
        <DropdownMenu.Trigger class={buttonVariants({ variant: "outline", size:"icon" })}>
            <Ellipsis />
        </DropdownMenu.Trigger>
        <DropdownMenu.Content class="w-56">
            <DropdownMenu.Group>
                <DropdownMenu.Group>
                    <DropdownMenu.Item>
                        <!-- <span>Edit</span> -->
                        <Pencil class="mr-2 size-4"/>
                        <a href="/dashboard/{dashboardName}/edit" class="w-full block">Edit</a>
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
