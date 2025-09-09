import { app } from './app';
import { systemLogger } from './utils';
import { LogLevel } from './utils/common/logger-dtos';
import { appHost, appPort } from './utils/config';
import { cacheAllBalances } from './utils/redis';

app.listen(appPort, async () => {
  systemLogger.log({
    level: LogLevel.INFO,
    module: 'server',
    message: `Digireal Test Task Server is running at http://${appHost}:${appPort}`,
  });

  await cacheAllBalances();
});
