





// Based off this example for using DuckDB-Wasm with SvelteKit:
// https://github.com/duckdb-wasm-examples/sveltekit-typescript

// I think this code needs to be kept apart from the App.svelte to function?
// Either way, it's neater to keep the worker and logger imports separate from everything else

import { base } from '$app/paths';


import * as duckdb from '@duckdb/duckdb-wasm';

import duckdb_wasm from '/node_modules/@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm?url';
import duckdb_worker from '/node_modules/@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js?worker';

import datasets from '$lib/config/datasets.json'

import type {
    AsyncDuckDB
} from '@duckdb/duckdb-wasm'


let db : AsyncDuckDB | null = null;


const instantiateDuckDb = async () => {
    if (db) {
        return db; // Return existing database, if any
    }
    
    // Instantiate worker 
    const logger = new duckdb.ConsoleLogger();
    const worker = new duckdb_worker();

    // and asynchronous database
    db = new duckdb.AsyncDuckDB(logger, worker);
    await db.instantiate(duckdb_wasm)
    return db;
};

export async function queryData(tableName) {
    console.log(`Querying ${tableName}..`)
    const db = await instantiateDuckDb();
    const conn = await db.connect();
    const results = conn.query(`
        SELECT * FROM ${tableName}
    `);
    const data = await results;
    await conn.close();
    console.log(data)
    return data
}

async function createTable(dataset) {
    const tableName = dataset.name;
    const filePath = dataset.path;
    console.log(`Loading ${tableName} at path ${filePath}`);
    // A simple case of a db of a single parquet file.
    const db = await instantiateDuckDb();
    await db.registerFileURL(`${tableName}.parquet`, `${base}/${filePath}`, 4, false);
    const conn = await db.connect();
    await conn.query(`CREATE TABLE ${tableName} AS SELECT * FROM parquet_scan('${tableName}.parquet')`);
    console.log(`Successfully loaded ${tableName} data in DuckDB`);
    await conn.close()
}

export async function loadData() {
    for (const dataset of datasets) {
        await createTable(dataset);
    };
}


export { instantiateDuckDb }; // so we can import this elsewhere