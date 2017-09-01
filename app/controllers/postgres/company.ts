import { Router, Request, Response } from 'express';
import * as pg from 'pg';

const router: Router = Router();

router.post('/', (req: Request, res: Response) => {
    let data = req.body;
    const client = new pg.Client(
        'postgres://isadmin:isadmin@localhost:5432/issue'
    );
    client.connect();
    const query = client.query(`
        insert into tb_company (comp_code, comp_name)
        values ('${data.compCode}', '${data.compName}')
    `).then((result) => {
            res.json(result.rows);
            client.end();
        }).catch((error) => {
            res.json(error);
            client.end();
        });
});

export const CompanyController: Router = router;