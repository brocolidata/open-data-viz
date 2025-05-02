<script>
    import { page } from "$app/stores";
    import EditDashboard from "$lib/components/dashboard/pages/edit_dashboard.svelte";

    let dataAppName = $page.params.data_app_name;
</script>

<EditDashboard 
    {dataAppName}
/>