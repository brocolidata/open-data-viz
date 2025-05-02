<script>
    import Combobox from "$lib/components/custom_ui/combobox.svelte";
    import Button from "$lib/components/ui/button/button.svelte";

    let {
        series = $bindable(),
        columnOptions,
        onRemove
    } = $props();

    const chartTypes = [
        { label: "Line", value: "line" },
        { label: "Bar", value: "bar" },
        { label: "Area", value: "area" },
    ];

    // $inspect('Chart series item chartDataColumns', chartDataColumns);
    // $inspect('Chart series item columnOptions', columnOptions);

    function removeItem() {
        onRemove();
    }

</script>

<div class="flex items-center gap-2">
    <div class="flex-1">
        <Combobox
            boxOptions={chartTypes}
            objectName="chart type"
            bind:value={series.type}
        />
    </div>
    <div class="flex-1">
        <Combobox
            boxOptions={columnOptions}
            objectName="data column"
            bind:value={series.column}
        />
    </div>
    <Button
        variant="ghost"
        size="icon"
        class="text-red-500 mb-[2px]"
        onclick={removeItem}
        aria-label="Remove series item"
    >
        ✕
    </Button>
</div>
