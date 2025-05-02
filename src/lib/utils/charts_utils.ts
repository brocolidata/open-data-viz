import { getDataByQuery } from "./duckdb";

export const aggregationOptions = [
    { label: "Sum", value: "sum" },
    { label: "Count", value: "count" },
    { label: "Average", value: "avg" },
    { label: "Min", value: "min" },
    { label: "Max", value: "max" }
];

export async function fetchColumnOptions(tableName) {
    try {
        const arrowTable = await getDataByQuery(`DESCRIBE ${tableName}`);
        const results = arrowTable.toArray();
        return results.map((col) => ({
            label: col.column_name,
            value: col.column_name,
        }));
    } catch (err) {
        console.error("Failed to fetch column names:", err);
        return [];
    }
}

export function getDataSourceOptions(data_sources) {
    return data_sources.map((source) => ({
        label: source.label,
        value: source.name,
    }));
}

export function getDataColumnsOptions(chartDataColumns) {
    return chartDataColumns.map((col) => ({
        label: col,
        value: col,
    }));
}

export function inferSeries({
    mainDimension,
    secondaryDimension,
    mainMetric,
    secondaryMetrics,
    columns
}) {
    // Case 1: Main dimension and main metric (optional secondary metrics)
    if (mainDimension && mainMetric?.column && !secondaryDimension  && secondaryMetrics.length === 0) {
        console.log('inferSeries Case 1');
        return [{
            column: `${mainMetric.aggregation}_${mainMetric.column}`,
            type: "bar", // or another chart type depending on preference
        }];
    }

    // Case 2: Main dimension, secondary dimension, and main metric (pivoted by secondary dimension)
    if (mainDimension && secondaryDimension && mainMetric?.column) {
        console.log('inferSeries Case 2');
        return columns
            .filter((col) => col !== mainDimension && col !== secondaryDimension)
            .map((col) => ({
                column: col,
                type: "bar", // or another chart type depending on preference
            }));
    }

    // Case 3: Main dimension, main metric, and secondary metrics (one series per secondary metric)
    if (mainDimension && mainMetric?.column && secondaryMetrics.length > 0) {
        console.log('inferSeries Case 3');
        return [mainMetric, ...secondaryMetrics]
            .filter((m) => m?.column)
            .map((m) => ({
                column: `${m.aggregation}_${m.column}`,
                type: "bar", // you can customize the type if needed
            }));
    }

    return [];
}

type Metric = {
    column: string;
    aggregation: "SUM" | "AVG" | "COUNT" | "MIN" | "MAX";
}

type QueryParams = {
    dataset: string;
    mainDimension?: string;
    secondaryDimension?: string;
    mainMetric?: Metric;
    secondaryMetrics?: Metric[];
};

export function buildChartQuery({
	dataset,
	mainDimension,
	secondaryDimension,
	mainMetric,
	secondaryMetrics = []
}: QueryParams): string {
	if (!dataset || !mainMetric?.column) return "-- Invalid configuration";

	const hasMainDim = !!mainDimension;
	const hasSecondaryDim = !!secondaryDimension;
	const mainAgg = mainMetric.aggregation.toLowerCase();

	// CASE 1: Pivot table
	if (hasMainDim && hasSecondaryDim) {
        return `
            PIVOT ${dataset} 
            ON ${secondaryDimension}
            USING ${mainAgg}(${mainMetric.column})
            GROUP BY ${mainDimension} 
		`.trim();
	}

	// CASE 2: Grouped aggregation by main dimension
	if (hasMainDim && !hasSecondaryDim) {
		const metrics = [mainMetric, ...secondaryMetrics].filter(
            m => m.column && m.aggregation
        );
		const selectParts = [
			mainDimension,
			...metrics.map(
				m => `${m.aggregation.toLowerCase()}(${m.column}) AS ${m.aggregation.toLowerCase()}_${m.column}`
			)
		];
		return `
            SELECT
                ${selectParts.join(",\n  ")}
            FROM ${dataset}
            GROUP BY ${mainDimension}
        `.trim();
	}

	// CASE 3: No dimension, simple aggregation
	return `
        SELECT ${mainAgg}(${mainMetric.column}) AS ${mainAgg}_${mainMetric.column}
        FROM ${dataset}
	`.trim();
}




export async function runChartQuery(chartQuery) {
    try {
        const arrowTable = await getDataByQuery(chartQuery);
        const columns = arrowTable.schema.fields.map((field) => field.name);
        const rawRows = arrowTable.toArray();
        const rows = rawRows.map((row) => {
            const rowData = {};
            columns.forEach((col, index) => {
                rowData[col] = row[col];
            });
            return rowData;
        });
        return { columns: columns, rows: rows };
    } catch (error) {
        console.error("Error executing query:", error);
        return { columns: [], rows: [] };
    }
}

export function buildOptionsFromUI({
    mainDimension,
    secondaryDimension,
    mainMetric,
    secondaryMetrics,
    seriesList,
    dimensionOnXAxis,
    chartProperties
}) {
    if (!mainDimension || !mainMetric || !seriesList) {
        return {};
    }

    const xAxisField = dimensionOnXAxis ? mainDimension : mainMetric.column;
    const yAxisField = dimensionOnXAxis ? mainMetric.column : mainDimension;

    return {
        dataset: {
            // The `source` will be injected separately in the component
        },
        title: {
            text: chartProperties?.chartLabel || '',
            subtext: chartProperties?.chartDescription || '',
            left: 'center'
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            top: 'bottom'
        },
        xAxis: {
            type: dimensionOnXAxis ? 'value' : 'category',
            name: xAxisField
        },
        yAxis: {
            type: dimensionOnXAxis ? 'category' : 'value',
            name: yAxisField
        },
        series: seriesList.map((series) => ({
            type: series.type || 'bar',
            name: series.column,
            encode: {
                x: dimensionOnXAxis ? series.column : mainDimension,
                y: dimensionOnXAxis ? mainDimension : series.column,
            }
        }))
    };
}