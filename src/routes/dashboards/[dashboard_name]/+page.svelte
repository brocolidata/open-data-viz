<script>
    import { page } from '$app/stores';
    import { getDashboardByName } from '$lib/odv_config';
    import Dashboard from '$lib/components/data/generic_dashboard.svelte';

    let dashboard_name = $page.params.dashboard_name;
    const dashboardConfig = getDashboardByName(dashboard_name);
    const firstLevelLayout = dashboardConfig.layout;
    console.log('Debug dashboardConfig', dashboardConfig);
    
</script>

<h1 class="text-4xl font-bold text-gray-900 dark:text-gray-100">{dashboardConfig.label}</h1>

{#if firstLevelLayout.rows}
    {@const gridStartLayout = 'row'}
    {@const sizeStartLayout = firstLevelLayout.rows.length}
    {@const layout = firstLevelLayout.rows}
    <div id="dashboard-content" class="w-screen h-screen grid grid-{gridStartLayout}s-{sizeStartLayout} grid-flow-{gridStartLayout} gap-4">
        <Dashboard {layout} />
    </div>
{:else if firstLevelLayout.columns}
    {@const gridStartLayout = 'col'}
    {@const sizeStartLayout = firstLevelLayout.columns.length}
    {@const layout = firstLevelLayout.rows}
    <div id="dashboard-content" class="w-screen h-screen grid grid-{gridStartLayout}s-{sizeStartLayout} grid-flow-{gridStartLayout} gap-4">
        <Dashboard {layout} />
    </div>
{/if}