const project_read_functions = require('./crud/read');
const project_create_functions = require('./crud/create');
const project_update_functions = require('./crud/update');
const project_delete_functions = require('./crud/delete');

exports.functions={
    ...project_read_functions,
    ...project_create_functions,
    ...project_update_functions,
    ...project_delete_functions
};