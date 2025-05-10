<script>
    import { page } from "$app/stores";
    import EditDashboard from "$lib/components/dashboard/pages/edit_dashboard.svelte";
    import { createDashboard } from "$lib/utils/stores";
    
    function saveDashboard(dashboardState) {
        createDashboard(dashboardState);
    }

</script>

<EditDashboard 
    onSave={(dashboardState) => {saveDashboard(dashboardState)}}
/>