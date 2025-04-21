<script>
    import { page } from '$app/stores';
    import { getDataSourceByName } from '$lib/utils/odv_config';
    import { queryData } from '$lib/utils/duckdb';
    import DataTable from "$lib/components/data/table.svelte";

    let data_source_name = $page.params.data_source_name;
    const dataSourceConfig = getDataSourceByName(data_source_name);
    
</script>

<DataTable tableName={data_source_name}/>