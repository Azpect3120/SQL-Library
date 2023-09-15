import { PSQL, Credentials, ConnectionUrl, Condition, Statement } from "./psql";
import { Query, QueryResult } from "pg";

// const object: PSQL = new PSQL(new Credentials("bubble.db.elephantsql.com", "afdezhvt", "afdezhvt", "IRIOr9zZ0yZenxud03vs0wJWguwUxF21", 5432));
// const object2: PSQL = new PSQL(new ConnectionUrl("postgres://afdezhvt:IRIOr9zZ0yZenxud03vs0wJWguwUxF21@bubble.db.elephantsql.com/afdezhvt"));

const object: PSQL = new PSQL(new ConnectionUrl("postgres://ruczahzd:Gj4VH-9koRNaijBm_OV27D-10AgIjZPq@mahmud.db.elephantsql.com/ruczahzd"));

// object.select("users", ["id", "username", "password"]);
// object.select("users", "*");

const condition: Condition = new Condition(Statement.WHERE, "account_name", Statement.ILIKE, "Chase Bank");
const condition2: Condition = new Condition(Statement.WHERE, "account_id", Statement.EQUALS, "4");



async function test (): Promise<void>
{
    const result: QueryResult = await object.select("accounts", ["account_name", "account_user", "account_password"], condition);
    console.log(result.rows);
}


async function example (): Promise<void>
{
   const result: QueryResult = await object.select(
        "users",
        ["username", "password"],
        new Condition(
            Statement.WHERE,
            "id",
            Statement.IS_NOT_NULL
        )
    ); 
    console.log(result);
}

async function exampleTwo (): Promise<void>
{
    const result: QueryResult = await object.select(
        "users",
        "*"
    );
    console.log(result);
}


async function testThree () {
    const result: QueryResult = await object.select("accounts", ["*"], new Condition(Statement.WHERE, "id", Statement.IS_NOT_NULL));
    console.log(result.rows);
}
testThree();