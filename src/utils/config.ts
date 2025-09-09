import dotenv from 'dotenv';

dotenv.config();

const appHost = process.env.APP_HOST || '127.0.0.1';
const appPort = process.env.APP_PORT || 8080;
const jwtSecret = process.env.JWT_SECRET;

export { appHost, appPort, jwtSecret };
