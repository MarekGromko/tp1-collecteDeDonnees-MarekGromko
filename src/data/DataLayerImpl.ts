import type { IDataLayer, RowMapper, ValuesFn, WhereFn, Table, Database, CommonOpts, SetFn } from "../core/IDataLayer.ts";
import fs from "node:fs";
import env from "../utility/EnvStore.ts"

// load env variables
const DB_PATH      = env.requiredExistingFilename('DB_FILENAME');
const DB_INIT_PATH = env.requiredStr('DB_INIT_FILENAME');
const DB_LOAD_INIT = env.requiredStr('DB_LOAD_FILENAME', 'never');

/**
 * JSON replace
 * 
 * Modify some values before parsing Object ot string
 * 
 * - `BigInt` -> `Number`
 * - `Date`-> `YYYY-MM-DD HH-mm-ss`
 */
const replacer = function(_: string, value: any) {
    switch(typeof value) {
        case 'bigint':
            return Number(value);
    }
    if(value instanceof Date) return (
        value.getUTCFullYear().toString().padStart(4, '0') + '-' + 
        value.getUTCMonth().toString().padStart(2, '0') + '-' +
        value.getUTCDate().toString().padStart(2, '0') + ' ' +
        value.getUTCHours().toString().padStart(2, '0') + ':' + 
        value.getUTCMinutes().toString().padStart(2, '0') + ':' +
        value.getUTCSeconds().toString().padStart(2, '0')
    );
    return value;
}

/**
 * Implementation of the Data layer
 */
class DataLayerImpl implements IDataLayer{
    // the in-memory database
    private inMemDB?: Database;
    constructor() {
        if(DB_LOAD_INIT === 'always' && DB_INIT_PATH)
            fs.copyFileSync(DB_INIT_PATH, DB_PATH);
    }
    private safeRange(opts: any) {
        let limit = Infinity;
        let offset = 0;
        if(typeof opts === 'object'){
            if(typeof opts.limit === 'number' && opts.limit >= 0) {
                limit = opts.limit;
            }
            if(typeof opts.offset === 'number' && opts.offset >= 0) {
                offset = opts.offest;
            }
        }
        return [offset, limit];
    }
    private loadDB(): Database{
        return this.inMemDB || JSON.parse(fs.readFileSync(DB_PATH, {encoding: 'utf-8'}));
    }
    private saveDB(db: Database): void{
        fs.writeFileSync(DB_PATH, JSON.stringify(db, replacer), {encoding: 'utf-8'});
    }
    private loadTable(tableName: string){
        let db = this.inMemDB || this.loadDB();
        // if the table doesnt exists, creates it
        if(!db[tableName]) 
            db[tableName] = {AUTO_INCREMENT_PK_INDEX: 0, data: {}};
        return db[tableName];
    }
    private saveTable(tableName: string, table: Table<unknown>){
        let db = this.inMemDB || this.loadDB();
        db[tableName] = table;
        if(!this.inMemDB) this.saveDB(db);
    }
    pullDb(): void {
        this.inMemDB = this.loadDB();
    }
    pushDb(): void {
        if(!this.inMemDB) return; 
        this.saveDB(this.inMemDB);
        this.inMemDB = undefined;
    }
    abortDb(): void {
        this.inMemDB = undefined;
    }
    insert(tableName: string, opts: { values: ValuesFn; }): void {
        const table = this.loadTable(tableName);
        // generate the key
        let key     = (++table.AUTO_INCREMENT_PK_INDEX).toString(16);
        let value   = opts.values(key);

        // check if the key is user-defined
        value.length === 2 ?
            [key, value] = value :
            value = value[0];

        table.data[key] = value;
        this.saveTable(tableName, table);
    }
    delete<T>(tableName: string, opts: CommonOpts & { where: WhereFn<T>; }): number {
        const table = this.loadTable(tableName);
        const entries = Object.entries(table.data);
        const [offset, limit] = this.safeRange(opts);
        let affectedRow = 0; // number of row affected by the action
        let relevantRow = 0; // number of row seen relevant
        for(let i = 0; i<entries.length; i++) {
            const [key, value] = entries[i];

            // stop if exceeded limit
            if(limit <= affectedRow) 
                break;

            // check if the row is relevant
            if(!opts.where(value as any, key)) 
                continue;
            
            // continue if the row is within the offset
            relevantRow++;
            if(offset >= relevantRow) 
                continue;

            // if the row is relevant and outside the offset
            delete table.data[key];
            affectedRow ++;
        }
        this.saveTable(tableName, table);
        return affectedRow;
    }
    update<T>(tableName: string, opts: CommonOpts & { where: WhereFn<T>; set: SetFn<T>; }): number {
        const table = this.loadTable(tableName);
        const entries = Object.entries(table.data);
        const [offset, limit] = this.safeRange(opts);
        let affectedRow = 0; // number of row affected by the action
        let relevantRow = 0; // number of row seen relevant
        for(let i = 0; i<entries.length; i++) {
            const [key, value] = entries[i];

            // stop if exceeded limit
            if(limit <= affectedRow) 
                break;

            // check if the row is relevant
            if(!opts.where(value as any, key)) 
                continue;
            
            // continue if the row is within the offset
            relevantRow++;
            if(offset >= relevantRow) 
                continue;

            // if the row is relevant and outside the offset
            table.data[key] = opts.set(value as any, key);
            affectedRow++;
        }
        this.saveTable(tableName, table);
        return affectedRow;
    }
    read<T>(tableName: string, opts: CommonOpts & RowMapper<T> & { where?: WhereFn<T>; }): T[] {
        const table = this.loadTable(tableName);
        const entries = Object.entries(table.data);
        const [offset, limit] = this.safeRange(opts);
        let affectedRow = 0; // number of row affected by the action
        let relevantRow = 0; // number of row seen relevant
        const result = [];
        for(let i = 0; i<entries.length; i++) {
            const [key, value] = entries[i];

            // stop if exceeded limit
            if(limit <= affectedRow) 
                break;

            // check if the row is relevant / if relevancy matter
            if(opts.where !== undefined && !opts.where(value as any, key)) 
                continue;
            
            // continue if the row is within the offset
            relevantRow++;
            if(offset >= relevantRow) 
                continue;

            // if the row is relevant and outside the offset
            if(opts.where !== undefined && !opts.where(value as any, key)) 
                continue;
            
            // if the row is relevant and outside the offset
            const mappedValue = opts.map(value as any, key);
            result.push(mappedValue);
            affectedRow++;
        }
        this.saveTable(tableName, table);
        return result;
    }
};

export {
    DataLayerImpl
}