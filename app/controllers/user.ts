import { Router, Request, Response } from 'express';
import { MongoClient, ObjectID } from 'mongodb';
import * as myConfig from 'config';
import { mongodb } from '../helpers/mongodb';

let config: any = myConfig.get('Config');

const router: Router = Router();

router.post('/', (req: Request, res: Response) => {
    let data = req.body;
    mongodb.collection("user").insertOne(data).then((data) => {
        res.json(data);
    });
});

router.get('/', (req: Request, res: Response) => {
    mongodb.collection("user").find().toArray().then((data) => {
        res.json(data);
    });
});

export const UserController: Router = router;