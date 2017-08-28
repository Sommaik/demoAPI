import { MongoClient, ObjectID } from 'mongodb';
import * as myConfig from 'config';

class MongoDB {
    public mongodb;

    constructor() {
        let config:any = myConfig.get('Config');
        MongoClient.connect(config.mongodbUrl, (err, db) => {
            if (err) {
                console.log(err);
            } else {
                this.mongodb = db;
            }
        });
    }
}
var mongoDB = new MongoDB();

export = mongoDB;