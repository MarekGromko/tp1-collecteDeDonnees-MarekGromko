import { Request, Response, NextFunction } from "express";
import winston, {format, transports, Logger} from "winston";

const USER_LOG_PATH  = process.env.USER_LOG_FILENAME
const ERROR_LOG_PATH = process.env.ERROR_LOG_FILENAME

/**
 * Factory that create middleware logger or service logger
 */
class LoggerFactory{
    private rootLogger: winston.Logger;
    constructor(version: string) {
        // format for the console
        const consoleFormat = format.combine(
            format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
            format.printf(info=>{
                return (
                    `[${info.timestamp}] ` + 
                    `[v${info.version}] ` + 
                    `[${info.service}] `+
                    `${info.level.toUpperCase()}: `+
                    `${info.message}`
                )
            }),
            format.colorize({all: true}),
        )
        // format for files
        const fileFormat = format.combine(
            format.timestamp(),
            format.json()
        );
        this.rootLogger = winston.createLogger({
            level: 'debug',
            defaultMeta: { service: 'root', version: version },
            transports: [
                new transports.Console({format: consoleFormat}),
                new transports.File({
                    level: 'info',
                    filename: USER_LOG_PATH,
                    format: fileFormat
                }),
                new transports.File({
                    level: 'error',
                    filename: ERROR_LOG_PATH,
                    format: fileFormat
                })
            ]
        });
    }
    /**
     * Create a logger for a given service
     * 
     * @param service - the service name
     * @returns a logger
     */
    service(service: string): winston.Logger{
        const logger = this.rootLogger.child({});
        logger.defaultMeta = {...logger.defaultMeta, service};
        return logger;
    }
    /**
     * Create a middleware with a given name
     * 
     * @param name - the middleware name
     * @returns a logger
     */
    middleware(name: string) {
        const logger = this.service(name);
        return (req: Request, res: Response, next: NextFunction) => {
            logger.info(`${req.method} ${req.url}`);
            next();
        }
    }
}

export default LoggerFactory;
export type {
    LoggerFactory,
    Logger
}