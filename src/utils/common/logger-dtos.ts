import { RequestExt } from './interfaces';
import { Response } from 'express';

export interface LogDto {
  level: LogLevel;
  module: string;
  message: string;
  details?: any;
}

export interface FinishLogDto {
  req: RequestExt;
  res: Response;
  error?: any;
}

export interface BaseLogDto {
  timestamp: number;
  level: LogLevel;
  path?: string;
  statusCode?: number;
  message?: string;
}

export enum LogLevel {
  LOG = 'log',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  DEBUG = 'debug',
}
