import * as pg from 'pg';
import * as myConfig from 'config';

class PostgresDB {

    doQuery(sql: string, callback) {
        let config: any = myConfig.get('Config');
        const client = new pg.Client(config.postgresUrl);
        client.connect();
        client.query(sql).then((result) => {
            callback(null, result);
            client.end();
        }).catch((error) => {
            callback(error);
            client.end();
        });
    }
}
var postgresdb = new PostgresDB();

export = postgresdb;