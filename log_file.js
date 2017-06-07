var activity_log = function(module_name, action, message) {
    const activitylog = require('./logger.js');
    
    activitylog.info(`${module_name} ${action} ${message}`);
}

module.exports = activity_log;