<script>
    import { page } from "$app/stores";
    import EditDashboard from "$lib/components/dashboard/pages/edit_dashboard.svelte";
    import { updateDashboard } from "$lib/utils/stores";

    let dashboardName = $page.params.dashboard_name;

    function saveDashboard(dashboardState) {
        updateDashboard(dashboardName, dashboardState);
    }
</script>

<EditDashboard 
    {dashboardName}
    onSave={(dashboardState) => {saveDashboard(dashboardState)}}
/>