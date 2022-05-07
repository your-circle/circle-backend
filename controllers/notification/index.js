const notifications_functions = require('./notification');
const project_notifications_functions = require('./project');


exports.functions={...notifications_functions,...project_notifications_functions};