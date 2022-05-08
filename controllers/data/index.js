const data_read_functions = require('./crud/read');
const data_update_functions = require('./crud/update');
const data_create_functions = require('./crud/create');

exports.functions={
    ...data_create_functions,
    ...data_update_functions,
    ...data_read_functions
};