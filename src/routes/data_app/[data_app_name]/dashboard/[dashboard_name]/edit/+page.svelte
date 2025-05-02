<script>
    import { page } from "$app/stores";
    import EditDashboard from "$lib/components/dashboard/pages/edit_dashboard.svelte";

    let dashboardName = $page.params.dashboard_name;
</script>

<EditDashboard 
    {dashboardName}
/>