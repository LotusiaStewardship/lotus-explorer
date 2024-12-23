#!/usr/bin/env node
import app from '../app';
import debug from 'debug';
import { Database } from '../lib/database';
import settings from '../lib/settings';
const db = new Database();

export const main = async () => {
  // Initialize instance
  app.set('port', process.env.PORT || settings.port);
  try {
    await db.connect();
    // check stats database; create if doesn't exist
    const dbStats = await db.check_stats(settings.coin);
    if (!dbStats) {
      await db.create_stats(settings.coin);
    }
    // check markets database; create if doesn't exist
    const markets = settings.markets.enabled;
    for (const market of markets) {
      const dbMarket = await db.check_market(market);
      if (!dbMarket) {
        await db.create_market(settings.markets.coin, market);
      }
    }
    // check richlist; create if doesn't exist
    const dbRichlist = await db.check_richlist(settings.coin);
    if (!dbRichlist) {
      await db.create_richlist(settings.coin);
    }
  } catch (e: any) {
    console.log(`instance: main: ${e.message}`);
    console.log(`aborting instance initialization`);
    process.exit(1);
  }
  // Start the listener
  const server = app.listen(app.get('port'), '::', () => {
    debug('Express server listening on port ' + server.address());
  });
};
