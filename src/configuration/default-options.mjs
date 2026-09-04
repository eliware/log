import winston from 'winston';

export const createDefaultTransports = () => [new winston.transports.Console()];
