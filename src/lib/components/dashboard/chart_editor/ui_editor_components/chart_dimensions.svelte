<script>
    import { Label } from "$lib/components/ui/label/index.js";
    import Button from "$lib/components/ui/button/button.svelte";
    import { buttonVariants } from "$lib/components/ui/button/index.js";
    import Combobox from "$lib/components/custom_ui/combobox.svelte";
    import * as Collapsible from "$lib/components/ui/collapsible/index.js";
    import { ChevronDown, ChevronUp } from 'lucide-svelte';

    let {
        columnOptions,
        mainDimension = $bindable(),
        secondaryDimension = $bindable()
    } = $props();

    let displaySecondaryDimBox = $state(false);
    let collapsibleisOpen = $state(true);

    function removeSecondary() {
        displaySecondaryDimBox = false;
        secondaryDimension = "";
    }
</script>

<!-- UI -->
<Collapsible.Root bind:open={collapsibleisOpen}>
    <div class="flex items-center justify-between space-x-4">
        <h2 class="mt-4 mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">Dimensions</h2>
        <Collapsible.Trigger
          class={buttonVariants({ variant: "ghost", size: "sm", class: "w-9 p-0" })}
        >
            {#if collapsibleisOpen === true}
                <ChevronUp />
            {:else}
                <ChevronDown />
            {/if}
        </Collapsible.Trigger>
    </div>
    
    <Collapsible.Content>


        <!-- Main Dimension -->
        <div class="mt-4 space-y-3 flex flex-col">
            <Label>Primary Dimension</Label>
            <Combobox
                boxOptions={columnOptions}
                objectName="dimension"
                bind:value={mainDimension}
            />
        </div>

        <!-- Optional Secondary Dimension -->
        {#if !displaySecondaryDimBox}
            {#if mainDimension !== ""}
                <Button
                    variant="link"
                    class="mt-2"
                    onclick={() => displaySecondaryDimBox = true}
                >
                    + Add another dimension
                </Button>
            {/if}
        {:else}
            <div class="mt-4 flex items-center space-x-2">

                <!-- Secondary dimension Combobox -->
                <div class="flex-1">
                    <Label>Secondary Dimension</Label>
                    <Combobox
                        boxOptions={columnOptions}
                        objectName="dimension"
                        bind:value={secondaryDimension}
                    />
                </div>

                <!-- Remove button -->
                <Button 
                    variant="ghost"
                    size="icon"
                    class="text-red-500"
                    onclick={removeSecondary}
                    aria-label="Remove secondary dimension"
                >
                    ✕
                </Button>
            </div>
        {/if}
    </Collapsible.Content>
</Collapsible.Root>
