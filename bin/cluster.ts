import cluster from 'cluster';
import * as os from 'os';
import * as fs from 'fs/promises';
import * as instance from './instance';

const main = async () => {
  if (cluster.isMaster) {
    try {
      await fs.appendFile('./tmp/cluster.pid', process.pid.toString());
      console.log('Starting cluster with pid: ' + process.pid);
      process.on('SIGINT', () => {
        console.log('Cluster shutting down...');
        for (const id in cluster.workers) {
          const { pid } = cluster.workers[id].process;
          console.log(`Stopping instance with PID ${pid}`);
          cluster.workers[id].kill();
        }
        // exit the master process
        process.exit(0);
      });
      // set up workers
      const cpuCount = os.cpus().length;
      for (let i = 0; i < cpuCount; i++) {
        cluster.fork();
      }
      // listen for dying workers
      cluster.on('exit', (worker, code, signal) => {
        if (worker.process.exitCode === 0) {
          console.log('Worker shut down.');
        } else if (
          (signal != 'SIGINT')
          && (worker.process.exitCode !== 0)
          && (worker.exitedAfterDisconnect !== true)
        ) {
          console.log('Cluster restarting...');
          cluster.fork();
        }
      });
    } catch (e: any) {
      console.log('Error: unable to create cluster.pid');
      process.exit(1);
    }
  } else {
    console.log(`Starting instance with PID ${process.pid}`);
    await instance.main();
  }
};
main();
