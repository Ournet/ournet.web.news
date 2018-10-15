
import { createLogger, format, transports } from 'winston';

const isProduction = process.env.NODE_ENV === 'production';

const logglyLogger = createLogger({
    level: isProduction ? 'warn' : 'info',
    format: format.json(),
});

if (!isProduction) {
    logglyLogger.add(new transports.Console({
        format: format.simple()
    }));
}

export default {
    info(...meta: any[]) {
        logglyLogger.info(meta);
    },
    warn(...meta: any[]) {
        logglyLogger.warn(meta);
    },
    error(...meta: any[]) {
        logglyLogger.error(meta);
    },
}
