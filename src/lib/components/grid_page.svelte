<script>
    import Grid from "svelte-grid";
    import gridHelp from "svelte-grid/build/helper/index.mjs";
    import { Button } from "$lib/components/ui/button/index.js";

    import Tile from "$lib/components/data/tile.svelte";

    let dashboardName = $state("My Dashboard"); // Initialize with a default name or fetch from data
    let isSaving = $state(false); // Track saving state
    let editMode = $state(true);
    const COLS = 6;

    const id = () => "_" + Math.random().toString(36).substr(2, 9);

    const randomNumberInRange = (min, max) => Math.random() * (max - min) + min;

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

        // {
        //     [COLS]: gridHelp.item({
        //         x: 2,
        //         y: 0,
        //         w: 2,
        //         h: 2,
        //     }),
        //     id: id(),
        // },
    ]);

    const cols = [[1200, 6]];

    function addTile() {
        let newItem = {
            6: gridHelp.item({
                w: Math.round(randomNumberInRange(1, 4)),
                h: Math.round(randomNumberInRange(1, 4)),
                x: 0,
                y: 0,
            }),
            id: id(),
        };

        let findOutPosition = gridHelp.findSpace(newItem, items, COLS);

        newItem = {
            ...newItem,
            [COLS]: {
                ...newItem[COLS],
                ...findOutPosition,
            },
        };

        items = [...items, ...[newItem]];
    }

    // const addAt = () => {
    //     let newItem = {
    //         6: gridHelp.item({
    //             w: Math.round(randomNumberInRange(1, 4)),
    //             h: Math.round(randomNumberInRange(1, 4)),
    //             x: 0,
    //             y: 0,
    //         }),
    //         id: id(),
    //     };

    //     items = [...[newItem], ...items];

    //     items = gridHelp.normalize(items, COLS);
    // };

    const remove = (item) => {
        items = items.filter((value) => value.id !== item.id);

        if (adjustAfterRemove) {
            items = gridHelp.adjust(items, COLS);
        }
    };

    let adjustAfterRemove = false;

    function saveDashboard() {
        isSaving = true; // Set saving state
        console.log('Saving Dashboard');
    }

    function toggleEditMode() {
		editMode = !editMode;
		// grid.enableMove(editMode);
		// grid.enableResize(editMode);
	}

    function exportLayout() {
        // console.log('Exporting layout');
		// const layout = grid.save(true); // Save grid layout with tile data
		// console.log("Layout output:", JSON.stringify(layout, null, 2)); // Export as JSON
        const layoutJSON = JSON.stringify(items, null, 2); // Pretty-print with indentation
        console.log("Exported Layout:", layoutJSON);
	}
</script>

<div class="dashboard-bar bg-gray-200 dark:bg-gray-700 gap-4">
	<input
		type="text"
		bind:value={dashboardName}
		placeholder="Dashboard Name"
	/>
	<Button onclick={addTile}>Add Tile</Button>
	<Button onclick={saveDashboard} disabled={isSaving}>
		{isSaving ? "Saving..." : "Save Dashboard"}
	</Button>
	{#if !editMode}
		<Button onclick={exportLayout}>Export Layout</Button>
	{/if}
	<Button onclick={toggleEditMode}>
		{editMode ? "View Mode" : "Edit Mode"}
	</Button>
</div>

<h1 class="text-4xl font-bold text-gray-900 dark:text-gray-100">
	{dashboardName}
</h1>


<div class="w-full">
    <Grid bind:items rowHeight={100} let:item let:dataItem {cols}>
         <!-- <div class="h-full w-full bg-gray-300">
              <Tile remove={() => remove(dataItem)} />
        </div> -->
        <Tile remove={() => remove(dataItem)} tileID={dataItem.id}/>
    </Grid>
</div>
