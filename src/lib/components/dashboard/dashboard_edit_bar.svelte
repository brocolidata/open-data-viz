<script>
    import { onMount } from 'svelte'
    import * as Popover from "$lib/components/ui/popover/index.js";
    import { 
        Check, 
        FileSymlink, 
        Save, 
        SlidersHorizontal, 
        SquarePlus 
    } from 'lucide-svelte';
    import { Button } from "$lib/components/ui/button/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Label } from "$lib/components/ui/label/index.js";
    import { Switch } from "$lib/components/ui/switch/index.js";
    import { buttonVariants } from "$lib/components/ui/button/index.js";
    import { createDashboard } from "$lib/utils/stores";
    import ExportConfigDrawer from '$lib/components/data/export_config_drawer.svelte';
    import { getExportableDashboardState } from "$lib/utils/grid_utils";


    let {
        editMode = $bindable(),
        isSaving = $bindable(),
        dashboardLabel = $bindable(),
        dashboardDescription = $bindable(),
        dashboardState,
        addTile,
        COLS,
        onEditModeToggle
    } = $props();

    let dashboardDefinitionSource = $derived(dashboardState.definition_source)
    let disableSave = $state(false);
    let dashboardExport = $derived(getExportableDashboardState(dashboardState, COLS));
    let saveSuccess = $state(false);
    let openExportConfigDrawer = $state(false);

    onMount(() => {
		if (dashboardDefinitionSource === "configuration file") {
            disableSave = true;
        }
	});

    

    async function saveDashboard() {
        isSaving = true;
        console.log(`Successfully saved ${dashboardLabel} dashboard.`);

        // Trigger animation
        saveSuccess = true;

        // Reset to original after 2 seconds
        setTimeout(() => {
            saveSuccess = false;
        }, 2000);

        isSaving = false;
    }

    function dispatchEditModeToggle() {
        onEditModeToggle();
    }

</script>

<div class="dashboard-bar bg-gray-200 dark:bg-gray-700 py-2 px-4 flex space-x-4">
    <Popover.Root>
        <Popover.Trigger class={buttonVariants({ variant: "secondary" })}>
            <SlidersHorizontal class="mr-2 size-4" />
            Dashboard settings
        </Popover.Trigger>
        <Popover.Content class="w-80 mt-2 p-4 bg-white dark:bg-gray-800 border rounded-md shadow-md">
            <div class="grid gap-4">
                <div class="space-y-2">
                    <p class="text-muted-foreground text-sm text-gray-500 dark:text-gray-400">
                        Dashboard settings
                    </p>
                </div>
                <div class="grid gap-2">
                    <div class="grid grid-cols-3 items-center gap-4">
                        <Label for="dashboard_label" class="text-right text-sm font-medium text-gray-700 dark:text-gray-100">Label</Label>
                        <Input id="dashboard_label" bind:value={dashboardLabel} class="col-span-2 h-8 rounded-md border shadow-sm focus-within:ring-1 focus-within:ring-primary-500 focus-within:border-primary-500 text-sm text-gray-900 dark:text-gray-100" />
                    </div>
                    <div class="grid grid-cols-3 items-center gap-4">
                        <Label for="dashboard_description" class="text-right text-sm font-medium text-gray-700 dark:text-gray-100">Description</Label>
                        <Input id="dashboard_description" bind:value={dashboardDescription} class="col-span-2 h-8 rounded-md border shadow-sm focus-within:ring-1 focus-within:ring-primary-500 focus-within:border-primary-500 text-sm text-gray-900 dark:text-gray-100" />
                    </div>
                </div>
            </div>
        </Popover.Content>
    </Popover.Root>
    <Button variant="secondary" onclick={addTile} class="flex items-center">
        <SquarePlus class="mr-2 size-4" />
        Add Tile
    </Button>
    <!-- <Button variant="secondary" onclick={saveDashboard} disabled={disableSave} class="flex items-center">
        <Save class="mr-2 size-4" />
        Save Dashboard
    </Button> -->
    <Button 
        variant="secondary" 
        onclick={saveDashboard} 
        disabled={disableSave || isSaving} 
        class="flex items-center"
    >
        {#if saveSuccess}
            <Check class="mr-2 size-4 text-green-600 transition-opacity duration-300" />
            Save Dashboard
        {:else}
            <Save class="mr-2 size-4" />
            Save Dashboard
        {/if}
    </Button>
    <Button 
        variant="secondary" 
        onclick={() => ( openExportConfigDrawer = true)} 
        class="flex items-center"
    >
        <FileSymlink class="mr-2 size-4"/>
        Export
    </Button>
    <ExportConfigDrawer {dashboardExport} bind:isOpen={openExportConfigDrawer}/>
    <div class="flex items-center space-x-2">
        <span class="text-sm text-gray-700 dark:text-gray-300">View</span>
        <Switch 
            id="edit-mode" 
            bind:checked={editMode} 
            onCheckedChange={dispatchEditModeToggle}
        />
        <span class="text-sm text-gray-700 dark:text-gray-300">Edit</span>
    </div>
</div>