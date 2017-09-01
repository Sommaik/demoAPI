import { Router, Request, Response } from 'express';
import * as pg from 'pg';
import * as postgres from '../../helpers/postgres';

const router: Router = Router();

router.post('/', (req: Request, res: Response) => {
    let data = req.body;
    postgres.doQuery(`
        insert into tb_company (comp_code, comp_name)
        values ('${data.compCode}', '${data.compName}')
    `, (error, result) => {
            if (error) {
                res.json(error);
            } else {
                res.json(result.rows);
            }
        });
});

export const CompanyController: Router = router;