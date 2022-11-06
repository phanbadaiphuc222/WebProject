const express = require('express');
const cors = require('cors');
const app = express();
const contactController = require('./controllers/contact.controller');
const accountController = require('./controllers/account.controller');
const studentController = require('./controllers/student.controller');
const ApiError = require('./api-error');
const { application } = require('express');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json ({ message: 'Welcome to contact book application.'});
});

app.route('/api/register')
    .post(accountController.register);

app.route('/api/login')
    .post(accountController.login)
    .get(accountController.findAllUser);

app.route('/api/student')
    .get(studentController.findAllStudent);

app.route('/api/register/:email')    
    .get(accountController.findAllUser);

app.route('/api/contacts')
    .get(contactController.findAll)
    .post(contactController.create)
    .delete(contactController.deleteAll);

app.route('/api/contacts/favorite').get(contactController.findAllFavorite);

app.route('/api/contatcs/:id')
    .get(contactController.findOne)
    .put(contactController.update)
    .delete(contactController.delete);

app.route('/api/contacts/:id')
    .get(contactController.findOne)
    .put(contactController.update)
    .delete(contactController.delete);

app.use((req, res, next) => {
    return next(new ApiError(404, 'Resource not found'));
});
    
app.use((error, req, res, next) => {
    return res.status(error.statusCode || 500).json({
        message: error.message || 'Internal Server Error',
    });
});

// let encodeUrl = parseUrl.urlencoded({ extended: false });

// app.post('/register', encodeUrl, (req, res) => {
//     var firstName = req.body.firstName;
//     var lastName = req.body.lastName;
//     var userName = req.body.userName;
//     var password = req.body.password;
// });

module.exports = app;