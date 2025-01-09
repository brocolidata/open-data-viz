import { base } from '$app/paths';
import * as duckdb from '@duckdb/duckdb-wasm';
import duckdb_wasm from '/node_modules/@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm?url';
import duckdb_worker from '/node_modules/@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js?worker';
import datasets from '$lib/config/datasets.json';

import type { AsyncDuckDB } from '@duckdb/duckdb-wasm';

let db: AsyncDuckDB | null = null;

const instantiateDuckDb = (() => {
    let dbPromise: Promise<AsyncDuckDB> | null = null;

    return async () => {
        if (db) return db;
        if (dbPromise) return dbPromise;

        const logger = new duckdb.ConsoleLogger();
        const worker = new duckdb_worker();

        dbPromise = new Promise(async (resolve, reject) => {
            try {
                db = new duckdb.AsyncDuckDB(logger, worker);
                await db.instantiate(duckdb_wasm);
                resolve(db);
            } catch (err) {
                reject(err);
            }
        });

        return dbPromise;
    };
})();

export async function queryData(tableName) {
    try {
        console.log(`Querying ${tableName}...`);
        const db = await instantiateDuckDb();
        const conn = await db.connect();
        const results = await conn.query(`SELECT * FROM ${tableName}`);
        await conn.close();
        console.log(results);
        return results;
    } catch (error) {
        console.error(`Error querying ${tableName}:`, error);
        throw error;
    }
}

async function createTable(dataset) {
    try {
        const tableName = dataset.name;
        const filePath = dataset.path;
        console.log(`Loading ${tableName} from ${filePath}`);
        const db = await instantiateDuckDb();
        await db.registerFileURL(`${tableName}.parquet`, `${base}/${filePath}`, 4, false);
        const conn = await db.connect();
        await conn.query(`CREATE TABLE ${tableName} AS SELECT * FROM parquet_scan('${tableName}.parquet')`);
        await conn.close();
        console.log(`Successfully loaded ${tableName}`);
    } catch (error) {
        console.error(`Error loading table ${dataset.name}:`, error);
        throw error;
    }
}

export async function loadData() {
    try {
        for (const dataset of datasets) {
            await createTable(dataset);
        }
        console.log("All datasets loaded successfully.");
    } catch (error) {
        console.error("Error loading datasets:", error);
        throw error;
    }
}

export function initializeApp() {
    return new Promise((resolve, reject) => {
        loadData()
            .then(() => {
                console.log("Data loading completed.");
                resolve();
            })
            .catch((error) => {
                console.error("Data loading failed:", error);
                reject(error);
            });
    });
}

export async function loadDataSync() {
    try {
        await initializeApp();
        console.log("App is ready for user interaction.");
        return true;
        // Initialize UI or other components here.
    } catch (error) {
        console.error("Failed to initialize app:", error);
    }
}