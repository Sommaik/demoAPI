import { Router, Request, Response } from 'express';
import { mongodb } from '../helpers/mongodb';
import * as myConfig from 'config';

let config: any = myConfig.get('Config');
var jwt = require("jwt-simple");

const router: Router = Router();

router.post("/doLogin", function (req, res) {
    if (req.body.email && req.body.password) {
        mongodb.collection("user").findOne({ 
            email: req.body.email,
            password : req.body.password
        }).then((results) => {
            var userInfo = results;
            if (userInfo) {
                var token = jwt.encode(userInfo, config.auth.jwtSecret);
                res.json({
                    success : true,
                    token: token
                });
            }else{
                res.json({
                    success : false,
                    message : 'Login fail.'
                });
            }
        }).catch((err) => {
            res.sendStatus(401);
        });
    } else {
        res.sendStatus(401);
    }
});

export const LoginController: Router = router;