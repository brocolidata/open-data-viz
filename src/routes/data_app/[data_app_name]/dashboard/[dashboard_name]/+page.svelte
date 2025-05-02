<script>
    import { page } from "$app/stores";
    import DisplayDashboard from "$lib/components/dashboard/pages/display_dashboard.svelte";

    let dashboardName = $page.params.dashboard_name;
    let dataAppName = $page.params.data_app_name;
    let editURL = `/data_app/${dataAppName}/dashboard/${dashboardName}/edit`
</script>

<DisplayDashboard
    {dashboardName}
    {dataAppName}
    {editURL}
/>