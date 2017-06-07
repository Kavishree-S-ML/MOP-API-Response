/**
 * Configurations of logger.
 */
const winston = require('winston');
const fs = require('fs');
const config = require('./config.json');
const winstonRotator = require('winston-daily-rotate-file');

var logDir = config.morph_path+'/logs'; // directory path you want to set
if ( !fs.existsSync( logDir ) ) {
    // Create the directory if it does not exist
    fs.mkdirSync( logDir );
}

const consoleConfig = [
    new winston.transports.Console({
        'colorize': true
    })
];

var twoDigit = '2-digit';
var options = {
  day: twoDigit,
  month: twoDigit,
  year: twoDigit,
  hour: twoDigit,
  minute: twoDigit,
  second: twoDigit
};


function formatter(args) {
  var dateTimeComponents = new Date().toLocaleTimeString('en-us', options).split(',');
  var time  = formatConsoleDate(new Date());

  var logMessage = dateTimeComponents[0] +" "+ time + " "+ args.message;
  return logMessage;
}

var datalogger = new(winston.Logger)({
    level: 'info',
    transports: [
        new(winston.transports.File)({
            filename: `${logDir}/`,
            maxsize: 10000, // 1MB maxsize must be in bytes
            maxFiles: 3,
        })
    ]
});

const createLogger = new winston.Logger({
    'transports': consoleConfig
});

const activityLogger = createLogger;
activityLogger.add(winston.transports.File, {
    filename: `${logDir}/activity.log.0`,
    json: false,
    prettyPrint: true,
    formatter: formatter
});

module.exports = activityLogger;

function formatConsoleDate (date) {
        var hour = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();
        
        var time = hour + ":" + minutes + ":" + seconds;
        return time;
}