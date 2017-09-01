import { Router, Request, Response } from 'express';
import * as pg from 'pg';

const router: Router = Router();

router.post('/', (req: Request, res: Response) => {
    let data = req.body;
    const client = new pg.Client(
        'postgres://isadmin:isadmin@localhost:5432/issue'
    );
    client.query(`
        insert into tb_company (comp_code, com_name)
        values ('${data.compCode}', '${data.compName}')
    `, (error, result) => {
        if(error){
            res.json(error);
        }else{
            res.json(result);
        }
        client.end();
    });  
});

export const CompanyController: Router = router;