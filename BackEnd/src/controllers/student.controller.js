const StudentService = require('../services/student.service');
const ApiError = require('../api-error');

exports.create = (req, res) => {
    return res.send({ message: 'create handler'});
};

exports.findAllStudent = async (req, res, next) => {
    let students = [];
    try {
        const studentService = new StudentService();
        const {name} = req.query;
        if (name) {
            students = await studentService.findByName(name);
        } else {
            students = await studentService.all();
        }
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, 'An error occurred while retrieving contacts')
        );
    }

    return res.send(students);
};