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
var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.File) ({ 
            level: 'info',
            name: '',
            filename: `${logDir}/activity.log.0`,
            maxsize: 10000, // 1MB maxsize must be in bytes
            maxFiles: 3,
            json: false,
            handleExceptions: true,
            formatter: formatter
        }),
        new (winston.transports.File) ({ 
            level: 'error',
            name: '',
            filename: `${logDir}/response.log.0`,
            maxsize: 10000, // 1MB maxsize must be in bytes
            maxFiles: 3,
            json: true,
            handleExceptions: true,
            formatter: formatter
        })
    ]
});

/*
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
*/
const createLogger = new winston.Logger({
    'transports': consoleConfig
});

const activityLogger = createLogger;
activityLogger.add(winston.transports[0], {
    filename: `${logDir}/activity.log.0`,
    json: false,
    prettyPrint: true,
    formatter: formatter
});

const responseLogger = createLogger;
activityLogger.add(winston.transports[1], {
    filename: `${logDir}/response.log.0`,
    json: false,
    prettyPrint: true,
    formatter: formatter
});

module.exports = {
  'activitylog':activityLogger,
  'responselog':responseLogger
};

function formatConsoleDate (date) {
        var hour = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();
        
        var time = hour + ":" + minutes + ":" + seconds;
        return time;
}