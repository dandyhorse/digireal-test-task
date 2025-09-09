import express, { Express } from 'express';
import { setRequestStartTime } from './middlewares';
import { AuthModule, BalanceModule } from './modules';

const app: Express = express();

// Middlewares:
app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ extended: true, limit: '200mb' }));
app.use(setRequestStartTime);

// Routers:
app.use('/auth', AuthModule.router);
app.use('/balance', BalanceModule.router);

export { app };
