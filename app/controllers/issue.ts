import { Router, Request, Response } from 'express';
import { MongoClient, ObjectID } from 'mongodb';
import { mongodb } from '../helpers/mongodb';
import * as shortid from 'shortid';
import * as multer from 'multer';
import * as fs from 'fs';
import * as myConfig from 'config';
var mailer = require("nodemailer");

const router: Router = Router();
let config: any = myConfig.get('Config');
var smtpTransport = mailer.createTransport(config.smtp);

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(config.uploadPath + req.params.folderName);
        let folder = config.uploadPath + req.params.folderName;
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder);
        }
        cb(null, folder);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})

var upload = multer({ storage: storage });

router.get('/', (req: Request, res: Response) => {
    mongodb.collection("issue").find().toArray().then((data) => {
        res.json(data);
    });
});

//get value by _id
router.get('/findByID/:id', (req: Request, res: Response) => {
    let id = new ObjectID(req.params.id);
    mongodb.collection("issue").findOne({ _id: id })
        .then((data) => {
            res.json(data);
        });
});

//get value by _id
router.get('/:id', (req: Request, res: Response) => {
    let id = new ObjectID(req.params.id);
    mongodb.collection("issue").findOne({ _id: id })
        .then((data) => {
            res.json(data);
        });
});

router.post('/', (req: Request, res: Response) => {
    //ข้อมูลที่ได้มากจากการ post จะเป็น req.body
    //insert into mongodb from post in postman
    let data = req.body;
    data.no = shortid.generate();
    mongodb.collection("issue").insert(data).then((data) => {
        var mail = {
            to: 'sommai.k@gmail.com',
            subject: `Your issue no ${data.no}`,
            html: `
                <h4>Your issue no ${data.no}</h4>
                <b>Thank your</b>
            `
        }
        smtpTransport.sendMail(mail, (error, response) => {
            smtpTransport.close();
            if (error) {
                res.json(error);
            } else {
                res.json(data);
            }
        });
    });
    //res.json(req.body);
});
//search
router.post('/search', (req: Request, res: Response) => {
    //ข้อมูลที่ได้มากจากการ post จะเป็น req.body
    //insert into mongodb from post in postman

    let ret = {
        row: [],
        total: Number
    };
    let data = req.body;
    mongodb.collection("issue").find({
        title: new RegExp(`${data.searchText}`)
    }).skip(data.numPage * data.rowPerPage)
        .limit(data.rowPerPage)
        .toArray().then((datas) => {
            ret.row = datas;
            mongodb.collection("issue").find({
                title: new RegExp(`${data.searchText}`)
            }).count().then((num) => {
                ret.total = num;
                res.json(ret);
            });


        });
    //res.json(req.body);
});
//delete
///:id คือ parameter ที่รับเข้ามา ในรูปแบบของ url
router.delete('/:id', (req: Request, res: Response) => {
    // req.params.id คือ parameter ที่ได้ ObjectID คือ _id จาก mongodb
    // ถ้าเป็น ฟิล ธรรมดา ไม่ต้องใช้ ObjectID แค่เปลี่ยน _id เป็น ชื่อฟิล เลย
    let id = new ObjectID(req.params.id);
    mongodb.collection("issue").deleteOne({ _id: id }).then((data) => {
        res.json(data);
    });
});

//put
router.put('/:id', (req: Request, res: Response) => {

    let id = new ObjectID(req.params.id);
    let data = req.body;
    mongodb.collection("issue").updateOne({ _id: id }, data).then((data) => {
        res.json(data);
    });
});

router.post('/attach/:folderName',
    upload.single('attach'),
    (req: Request, res: Response) => {
        res.json({
            success: true
        });
    });

router.get('/attach/:folderName',
    (req: Request, res: Response) => {
        let folder = config.uploadPath + req.params.folderName;
        if (fs.existsSync(folder)) {
            fs.readdir(folder, (err, files) => {
                res.json(files);
            });
        } else {
            res.json([]);
        }
    });

router.get('/view-attach/:folderName/:fileName', (req: Request, res: Response) => {
    fs.readFile(
        `${config.uploadPath}${req.params.folderName}/${req.params.fileName}`
        , (err, data) => {
            if (!err) {
                res.write(data);
                res.end();
            } else {
                res.end();
            }
        });
});

export const IssueController: Router = router;