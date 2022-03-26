const { check } = require('express-validator');

const UpdateUserValidation = [
    check('about', 'Password must be 10 or more characters').isLength({ min: 10 }),
    check('github', 'github must have value').exists({checkFalsy:true}),
    check('linkedln', 'linkedln must have value').exists({checkFalsy:true}),
    check('skills', 'skills must be array and at-list one skills required').isArray({min:1}),
    check('open_to', 'open_to must be array ').isArray(),

]




exports.UpdateUserValidation=UpdateUserValidation;
