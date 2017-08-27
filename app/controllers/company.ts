import { Router, Request, Response } from 'express';
import { MongoClient, ObjectID } from 'mongodb';

// Assign router to the express.Router() instance
const router: Router = Router();
var mongodb;

router.get('/', (req: Request, res: Response) => {
    mongodb.collection("company").find().toArray().then((data) => {
        res.json(data);
    });
});

router.get('/findById/:id', (req: Request, res: Response) => {
    let id = new ObjectID(req.params.id);
    mongodb.collection("company").findOne({ _id: id })
        .then((data) => {
            res.json(data);
        }
    );
});

router.post('/', (req: Request, res: Response) => {
    let data = req.body;
    mongodb.collection("company").insertOne(data).then((data) => {
        res.json(data);
    });
});

router.delete('/:id', (req: Request, res: Response) => {
    let id = new ObjectID(req.params.id);
    mongodb.collection("company").deleteOne({ _id: id }).then((data) => {
        res.json(data);
    });
});

router.put('/:id', (req: Request, res: Response) => {
    let id = new ObjectID(req.params.id);
    let data = req.body;
    mongodb.collection("company").updateOne({ _id: id }, data).then((data) => {
        res.json(data);
    });
});

router.post('/search', (req: Request, res: Response) => {
    let ret = {
        rows : [],
        total : 0
    };
    let data = req.body;
    mongodb.collection("company").find(
        { 
            compName: new RegExp(`${data.searchText}`)
        }
    ).skip(data.numPage*data.rowPerPage)
    .limit(data.rowPerPage)
    .toArray().then((rows) => {
        ret.rows = rows;
        mongodb.collection("company").find(
            { 
                compName: new RegExp(`${data.searchText}`)
            }
        ).count().then((data) =>{
            ret.total = data;
            res.json(ret);
        })
    });
});

MongoClient.connect(
    "mongodb://localhost:27017/issuedb", (err, db) => {
        if (err) {
            console.log(err);
        } else {
            mongodb = db;
        }
    });
export const CompanyController: Router = router;