import { Router, Request, Response } from 'express';
import { MongoClient, ObjectID } from 'mongodb';
import * as myConfig from 'config';
import { mongodb } from '../helpers/mongodb';
import * as auth from '../helpers/auth';
import * as async from 'async';

let config: any = myConfig.get('Config');

const router: Router = Router();

router.use(auth.authenticate());

router.get('/', (req: Request, res: Response) => {
    mongodb.collection("customer").find().toArray().then((data) => {
        res.json(data);
    });
});

router.get('/findById/:id', (req: Request, res: Response) => {
    let id = new ObjectID(req.params.id);
    mongodb.collection("customer").findOne({ _id: id })
        .then((data) => {
            res.json(data);
        }
        );
});

router.post('/', (req: Request, res: Response) => {
    let data = req.body;
    mongodb.collection("customer").insertOne(data).then((data) => {
        res.json(data);
    });
});

router.delete('/:id', (req: Request, res: Response) => {
    let id = new ObjectID(req.params.id);
    mongodb.collection("customer").deleteOne({ _id: id }).then((data) => {
        res.json(data);
    });
});

router.put('/:id', (req: Request, res: Response) => {
    let id = new ObjectID(req.params.id);
    let data = req.body;
    mongodb.collection("customer").updateOne({ _id: id }, data).then((data) => {
        res.json(data);
    });
});

router.post('/find', (req: Request, res: Response) => {
    let data = req.body;
    async.parallel([
        function (callback) {
            mongodb.collection("customer").find(
                {
                    custName: new RegExp(`${data.searchText}`)
                }
            ).skip(data.numPage * data.rowPerPage)
                .limit(data.rowPerPage)
                .toArray().then((rows) => {
                    callback(null, rows);
                });
        },
        function (callback) {
            mongodb.collection("customer").find(
                {
                    custName: new RegExp(`${data.searchText}`)
                }
            ).count().then((data) => {
                callback(null, data);
            })
        }
    ],
        function (err, results) {
            let ret = {
                rows: results[0],
                total: results[1]
            };
            res.json(ret);
        });
});

export const CustomerController: Router = router;