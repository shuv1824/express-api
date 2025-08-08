import { isDevelopment } from '@/config';

export enum LogLevel {
  ERROR = 'ERROR',
  WARN = 'WARN',
  INFO = 'INFO',
  DEBUG = 'DEBUG',
}

class Logger {
  private static instance: Logger;

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatMessage(level: LogLevel, message: string, meta?: any): string {
    const timestamp = new Date().toISOString();
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] [${level}] ${message}${metaStr}`;
  }

  public error(message: string, meta?: any): void {
    console.error(this.formatMessage(LogLevel.ERROR, message, meta));
  }

  public warn(message: string, meta?: any): void {
    console.warn(this.formatMessage(LogLevel.WARN, message, meta));
  }

  public info(message: string, meta?: any): void {
    console.info(this.formatMessage(LogLevel.INFO, message, meta));
  }

  public debug(message: string, meta?: any): void {
    if (isDevelopment) {
      console.debug(this.formatMessage(LogLevel.DEBUG, message, meta));
    }
  }
}

export const logger = Logger.getInstance();
