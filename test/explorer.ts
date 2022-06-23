import * as settings from '../lib/settings';
import { Explorer } from '../lib/explorer';
import { connect, disconnect } from 'mongoose';
const lib = new Explorer();
const main = async () => {
  /**
   * RPC calls
   */
  const hashrate = await lib.get_hashrate();
  const difficulty = await lib.get_difficulty();
  const connectioncount = await lib.get_connectioncount();
  const mempoolInfo = await lib.get_mempoolinfo();
  const rawMempool = await lib.get_rawmempool();
  const blockcount = await lib.get_blockcount();
  const blockhash = await lib.get_blockhash(123456);
  const block = await lib.get_block(blockhash);
  const tx = await lib.get_rawtransaction(block.tx[0]);

  console.log('hashrate', hashrate);
  console.log('difficulty', difficulty);
  console.log('connectioncount', connectioncount);
  console.log('mempoolInfo', mempoolInfo);
  console.log('rawMempool', rawMempool);
  console.log('blockcount', blockcount);
  console.log('blockhash', blockhash);
  console.log('block', block);
  console.log('tx', tx);
  /**
   * Database calls
   */
  const dbString = 'mongodb://' + settings.dbsettings.user
  + ':' + settings.dbsettings.password
  + '@' + settings.dbsettings.address
  + ':' + settings.dbsettings.port
  + '/' + settings.dbsettings.database;
  await connect(dbString);
  const supply = await lib.balance_supply();
  const blockFees = await lib.get_block_fees(273101);
  const burnedSupply = await lib.get_burned_supply();

  console.log('supply', supply);
  console.log('blockFees', blockFees);
  console.log('burnedSupply', burnedSupply);
  await disconnect();

};
main();