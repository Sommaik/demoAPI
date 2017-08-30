import { Router, Request, Response } from 'express';
import { MongoClient, ObjectID } from 'mongodb';
import * as myConfig from 'config';
import { mongodb } from '../helpers/mongodb';
import * as multer from 'multer';
var fs = require('fs');

let config: any = myConfig.get('Config');

const router: Router = Router();

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, config.uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, req.params.id);
    }
})

var upload = multer({ storage: storage });

router.post('/profile/:id', upload.single('avatar'), (req: Request, res: Response) => {
    res.json({
        success:true
    });
});

router.get('/profile/:id', (req: Request, res: Response) => {
    fs.readFile(`${config.uploadPath}${req.params.id}`, (err, data) => {
        if (!err) {
            res.write(data);
            res.end();
        } else {
            res.end();
        }
    });
});

router.post('/', (req: Request, res: Response) => {
    let data = req.body;
    mongodb.collection("user").insert(data).then((result) => {
       console.dir(data);
        res.json(data);
    });
});

router.get('/', (req: Request, res: Response) => {
    mongodb.collection("user").find().toArray().then((data) => {
        res.json(data);
    });
});

router.delete('/:id', (req: Request, res: Response) => {
    let id = new ObjectID(req.params.id);
    mongodb.collection("user").deleteOne({ _id: id }).then((data) => {
        res.json(data);
    });
});

router.put('/:id', (req: Request, res: Response) => {
    let id = new ObjectID(req.params.id);
    let data = req.body;
    mongodb.collection("user").updateOne({ _id: id }, data).then((data) => {
        res.json(data);
    });
});

router.get('/findById/:id', (req: Request, res: Response) => {
    let id = new ObjectID(req.params.id);
    mongodb.collection("user").findOne({ _id: id })
        .then((data) => {
            res.json(data);
        }
        );
});



export const UserController: Router = router;