
/**
 * @file Interface for a basic data layer that copy SQL in functional way
 */

/**
 * Callback that return true or false if the row is/isn't a match
 * 
 * @example
 *  where = row=>row.year > 10
 *  where = row=>row.title.toLowerCase().include('hello')
 *  where = row=>row.id === '123' && row.type = 'abc'
 *  where = (row, key)=>key === '1234'
 */
type WhereFn<T> = (row:T, key: string)=>boolean;
/**
 * Callback that return the object to be put in the database
 * 
 * @param {String} key - The key that will match the database
 * @return `[Object]` - The tuple at index 0 will be put in the databse at key
 * @return `[String, Object]` - The tuple at index 0 will be the key, and the value at index 1
 * 
 * @example
 *  valuesAutoKey = key=>[
 *      {id: key, label: 'My key is generated the DataLayer}
 *  ]
 * 
 *  valuesCustomKey = key=>[
 *      'lol',
 *      { id: key, label: 'My key is \'lol\'' }
 *  ]
 */
type ValuesFn = (key: string)=>[any] | [string, any] | null | undefined;
/**
 * Callback that set the row, the return value is what will replace the the previous value
 * 
 * @example
 *  set = row=>({
 *      ...row,
 *      label: 'Im the new label'
 *  });
 */
type SetFn<T> = (row:T, key: string)=>any;

/**
 * Map a row to a value
 * @returns {Null} `map(): null` - the object will be ignored on output
 * @returns {Object} `map(): T`- the object will be added to the output
 */
interface RowMapper<T> {
    map(row: any, key: string): T | null
}

/**
 * Common options for CRUD method
 * @field `limit` - Maximum number of row to affect
 * @field `offset` - An offest of matching row to ignore
 */
interface CommonOpts {
    limit?: number;
    offset?: number;
}
/**
 * Interface to implements a DataLayer
 */
interface IDataLayer{
    /**
     * Load the database in memory
     * 
     * Action (insert, read, etc.) won't be saved until `pushDb` is called
     */
    pullDb(): void;
    /**
     * Push the in-memory database in storage
     */
    pushDb(): void;
    /**
     * Abort a pullDb, all actions will be lost
     */
    abortDb(): void;

    /**
     * Insert values into the database
     * 
     * @param table - Table name
     * @param opts - required options {`values`}
     */
    insert(table: string, opts: {
        values: ValuesFn
    }): void;
    /**
     * Delete rows in the database
     * 
     * @param table - Table name
     * @param opts - required options {`where`}
     * @returns - number of row affected
     */
    delete<T>(table: string, opts: CommonOpts & {
        where: WhereFn<T>;
    }): number;
    /**
     * Update rows in the database
     * 
     * @param table - Table name
     * @param opts - required options {`where`, `set`}
     * @returns - number of row affected
     */
    update<T>(table: string, opts: CommonOpts & {
        where: WhereFn<T>;
        set: SetFn<T>;
    }): number;
    /**
     * Read rows in the database
     * 
     * Without the options `where`, returns all rows
     * 
     * @param table - Table name
     * @param opts - required options {`map`}
     */
    read<T>(table: string, opts: CommonOpts & RowMapper<T> & {
        where?: WhereFn<T>;
    }): T[];
}

/**
 * Internal type for that represent a table
 * @inner
 */
type Table<T> = {
    AUTO_INCREMENT_PK_INDEX: number,
    data: Record<string, T>
};

/**
 * Internal type for that represent the database
 * @inner
 */
type Database = Record<string, Table<unknown>>;

export type {
    IDataLayer,
    RowMapper,
    CommonOpts,
    SetFn,
    ValuesFn,
    WhereFn,
    Table,
    Database
}