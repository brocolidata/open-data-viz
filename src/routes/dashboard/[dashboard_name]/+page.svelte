<script>
    import { page } from "$app/stores";
    import DisplayDashboard from "$lib/components/dashboard/pages/display_dashboard.svelte";

    let dashboardName = $page.params.dashboard_name;
    let editURL = `/dashboard/${dashboardName}/edit`
</script>

<DisplayDashboard
    {dashboardName}
    {editURL}
/>