# open-data-viz
BI-as-Code tool : define your dashboard as YAML and generate a static web page

## Useful links : 
- [Attach a DuckDB file to DuckDB-WASM](https://observablehq.com/@huggingface/attach-a-duckdb-file-to-duckdb-wasm)
- [ECharts chart options](https://echarts.apache.org/en/option.html)

## Test EChart creation

SQL Query : 
```sql
select 
  shipCountry, 
  count(entityId) as orders_count 
from sales_orders 
group by shipCountry
order by count(entityId) desc
```

Chart options : 
```json
{
    "title": {
        "text": "# Orders per country"
    },
    "xAxis": {
        "type": "category"
    },
    "yAxis": {
        "type": "value"
    },
    "series": [
        {
            "type": "bar",
            "encode": {
                "x": "shipCountry",
                "y": "orders_count"
            }
        }
    ]
}
```