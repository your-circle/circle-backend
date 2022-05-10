const notifications_read_functions = require('./crud/read');
const notifications_create_functions = require('./crud/create');
const notifications_update_functions = require('./crud/update');


exports.functions={
    ...notifications_read_functions,
    ...notifications_create_functions,
    ...notifications_update_functions
};