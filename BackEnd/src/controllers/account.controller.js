const AccountService = require('../services/account.service');
const ApiError = require('../api-error');

exports.create = (req, res) => {
    return res.send({ message: 'create handler'});
};

exports.register = async (req, res, next) => {

    if (!req.body?.email) {
        return next (new ApiError(500, 'Email can not be empty!'));
    } else if (!req.body?.password) {
        return next (new ApiError(500, 'Password cannot be empty!'));
    }

    try {
        const accountService = new AccountService();
        const account = await accountService.create(req.body);
        return res.send(account);
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, 'An error occurred while creating the contact')
        );
    }
}

exports.login = async (req, res, next ) => {

    if (!req.body?.email) {
        return next (new ApiError(500, 'Email can not be empty!'));
    } else if (!req.body?.password) {
        return next (new ApiError(500, 'Password cannot be empty!'));
    }

    const { email, password } = req.body;

    try {

        const accountService = new AccountService();
        const dbEmail = await accountService.login(email, password);

        if (dbEmail[0]) {
            return next (new ApiError(500, 'Successfully to login!'))
        } else {
            return next (new ApiError(500, 'Failed to login!'));
        }

    } catch (err) {
        res.status(500).json(err);
    }

    // return res.send(accounts);

}

exports.login2 = async (req, res) => {
    const {email, password} = req.body 

    if (isEmpty(email) || isEmpty(password)) {
        return Response.sendErrorResponse({
            res,
            message: 'Email or Password detail is missing',
            statusCode: 400,
        })
    }

    // if (!isValidEmail(email) || !validatePassword(password)) {
    //     return Response.sendErrorResponse({
    //         res,
    //         message: 'Please enter a valid Email or Password',
    //         statusCode: 400,
    //     })
    // }

    const loginUserQuery = 'SELECT * FROM users WHERE email = $1'

    try {

        const { rows } = await dbQuery.query(loginUserQuery, [email])
        const dbResponse = rows[0]

        if (!dbResponse) {
            return Response.sendErrorResponse({
                res,
                message: 'User with this email does not exist',
                statusCode: 400,
            })
        }

        if (!comparePassword(dbResponse.password, password)) {
            return Response.sendErrorResponse({
                res,
                message: 'The password you provided is incorrect',
                statusCode: 400,
            })
        }

        // delete dbResponse.password

        return Response.sendResponse({
            res,
            responseBody: { user: dbResponse},
            message: 'login successful',
        })
    } catch (error) {
        console.log(error)
        return Response.sendErrorResponse({
            res,
            message: error,
            statusCode: 500,
        })
    }
}

exports.findAllUser = async (req, res, next) => {
    let accounts = [];
    try {
        const accountService = new AccountService();
        const {email} = req.query;
        if (email) {
            accounts = await accountService.findByEmail(email);
        } else {
            accounts = await accountService.all();
        }
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, 'An error occurred while retrieving contacts')
        );
    }

    return res.send(accounts);
};