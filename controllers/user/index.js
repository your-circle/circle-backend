const user_read_functions = require('./crud/read');
const user_update_functions = require('./crud/update');

exports.functions={...user_read_functions,...user_update_functions};