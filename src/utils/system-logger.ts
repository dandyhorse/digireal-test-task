import { BaseLogDto, FinishLogDto, LogDto, LogLevel } from './common/logger-dtos';

const makeRed = (message: string) => `\x1b[31m${message}\x1b[0m`;
const makeGreen = (message: string) => `\x1b[32m${message}\x1b[0m`;
const makeYellow = (message: string) => `\x1b[33m${message}\x1b[0m`;
// const makeBlue = (message: string) => `\x1b[34m${message}\x1b[0m`;

const formatTS = (timestamp: number) =>
  Intl.DateTimeFormat('ru-RU', {
    timeZone: 'Europe/Moscow',
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
    .format(new Date(timestamp))
    .replace(/\//g, '.')
    .replace(',', '');

const makePrefix = ({ timestamp, level, path, statusCode, message }: BaseLogDto) => {
  const prefix = `[${formatTS(timestamp)}] [${level.toUpperCase()}]`;

  const additional: string[] = [];

  path ? additional.push(`[${path}]`) : null;
  statusCode ? additional.push(`(${statusCode.toString()})`) : null;
  message ? additional.push(message) : null;

  return additional.length > 0 ? `${prefix}: ${additional.join(' ')}` : `${prefix}:`;
};

const log = ({ level, module, message, details }: LogDto) => {
  const logPrefix = makePrefix({ timestamp: Date.now(), level, path: module, message });

  const logDetails = details ? ` ${JSON.stringify({ details: sanitizeLog(details) })}` : '';

  let logMessage = logPrefix + logDetails;

  switch (level) {
    case LogLevel.INFO:
    case LogLevel.WARN:
    case LogLevel.DEBUG:
      logMessage = makeYellow(logMessage);
      break;
    case LogLevel.LOG:
      logMessage = makeGreen(logMessage);
      break;
    case LogLevel.ERROR:
      logMessage = makeRed(logMessage);
      break;
  }

  console[level](logMessage);
};

const finishLog = ({ res, req, error }: FinishLogDto) => {
  let level: LogLevel = error ? LogLevel.ERROR : LogLevel.LOG;

  const path = req.baseUrl + (req.path !== '/' ? req.path : '');

  const prefix = makePrefix({
    timestamp: req.startTime,
    level,
    path,
    statusCode: res.statusCode,
  });

  const details = ` ${JSON.stringify({
    requestTime: (Date.now() - req.startTime) / 1000,
    body: sanitizeLog(req.body, req.user?.id),
    error,
  })}`;

  let message = prefix + details;

  if (error) {
    message = makeRed(message);
  } else {
    message = makeGreen(message);
  }

  console[level](message);
};

const sanitizeLog = (obj: any, userId?: number) => ({
  ...obj,
  userId,
  jwt: undefined,
  password: undefined,
  token: undefined,
});

export const systemLogger = {
  finishLog,
  log,
};
