import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as auth from './helpers/auth';
import { CompanyController } from './controllers/company';
import { LoginController } from './controllers/login';
import { UserController } from './controllers/user';
import { CustomerController } from './controllers/customer';
import { IssueController } from './controllers/issue';

// Create a new express application instance
const app: express.Application = express();
// The port the express app will listen on
const port: string = process.env.PORT || '3000';

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(auth.initialize());

app.use('/company', CompanyController);
app.use('/user', UserController);
app.use('/login', LoginController);
app.use('/customer', CustomerController);
app.use('/issue', IssueController);

// Serve the application at the given port
var server = app.listen(port, () => {
  // Success callback
  console.log(`Listening at http://localhost:${port}/`);
});

/*
* Socket.IO server section 
*/
var io = require('socket.io')(server);
io.on('connection', function (socket) {

  socket.on('hello', function (data) {
    socket.emit('news', "xxxxxx");
  });

  socket.on('add-message', (data) => {
    socket.emit('message', data);
  });

});