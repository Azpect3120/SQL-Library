import { Pool, QueryResult } from "pg";

// Enums
export enum Statement {
  WHERE = "WHERE",
  NOT = "NOT",
  OR = "OR",
  AND = "AND",
  IF = "IF",
  BETWEEN = "BETWEEN",
  LIKE = "LIKE",
  ILIKE = "ILIKE",
  EQUALS = "=",
  IS_NULL = "IS NULL",
  IS_NOT_NULL = "IS NOT NULL",
  EXISTS = "EXISTS",
  ANY = "ANY",
  ALL = "ALL",
}



export class Credentials
{
    host: string;
    database: string;
    username: string;
    password: string;
    port: number;

    constructor (host: string, database: string, username: string, password: string, port: number)
    {
        this.host = host || "localhost";
        this.database = database;
        this.username = username;
        this.password = password;
        this.port = port || 5432;
    };
};

export class ConnectionUrl
{
    url: string;

    constructor (url: string)
    {
        this.url = url;
    };
};

export class Condition 
{
    condition: string;
    
    constructor (tableCondition: Statement, column: string, columnCondition: Statement, comparator?: string)
    {
        this.condition = `${tableCondition} ${column} ${columnCondition}${comparator ? " '" + comparator + "'": ""}`;         
    }
}

export class PSQL
{
    private pool: Pool;

    constructor (credentials: Credentials | ConnectionUrl)
    {
        if (credentials instanceof Credentials) {
            this.pool = new Pool({
                host: credentials.host,
                database: credentials.database,
                user: credentials.username,
                password: credentials.password,
                port: credentials.port
            });
        } else if (credentials instanceof ConnectionUrl) {
            this.pool = new Pool({ connectionString: credentials.url });
        } else {
            throw new Error ("Invalid parameters");
        }
    };


    /**
     * Run a select query on a table in the connected database
     * @param table Target table to select from
     * @param columns Columns you would like to select from the table
     * @param condition Condition of the select statement
     * @returns Results of the query
     */
    async select (table: string, columns: string[] | string, condition?: Condition): Promise<QueryResult>
    {
        try {
            // Create client connection
            const connection = await this.pool.connect();

            // Single column: string
            if (typeof columns === "string") {
                // Query string
                const query: string = `SELECT ${columns} FROM ${table}${condition ? " " + condition.condition : ""};`;

                // Query database
                const result: QueryResult = await connection.query(query);
            
                // Release the client connection back to the pool
                connection.release();

                // Return result
                return result;
            
            // Multi column: string[]
            } else if (Array.isArray(columns) && columns.every(col => typeof col === "string")) {
                // Query string
                const query: string = `SELECT ${columns.join(",")} FROM ${table}${condition ? " " + condition.condition : ""};`;

                // Query database
                const result: QueryResult = await connection.query(query);
            
                // Release the client connection back to the pool
                connection.release();

                // Return result
                return result;
            
            // Invalid column
            } else {
                throw new Error("Invalid column parameters");
            }
        
        // Catch errors
        } catch (err: any) {
            throw new Error("Error:" + err);

        // Close pool connection
        } finally {
            this.pool.end();
        }
    };

    /**
     * Drops a table from a database
     * @param table Name(s) of the target table
     * @returns Result of the query
     */
    async drop (table: string | string[]): Promise<QueryResult>
    {
        try {
            // Create client connection
            const connection = await this.pool.connect();

            // Single table: string
            if (typeof table === "string") {
                // Query string
                const query: string = `DROP TABLE ${table}`;

                // Query database
                const result: QueryResult = await connection.query(query);

                // Release the client connection back to the pool
                connection.release();

                // Return result
                return result;

            // Multiple tables: string[]
            } else if (Array.isArray(table) && table.every(col => typeof col === "string")) {

            // Invalid table
            } else {
                throw new Error("Invalid table parameters");
            }
        // Catch errors
        } catch (err) {
            throw new Error("Error: " + err);
        
        // Close pool connection
        } finally {
            this.pool.end();
        }
    }
    



};