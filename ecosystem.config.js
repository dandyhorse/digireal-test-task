module.exports = {
  apps: [
    {
      name: 'api-boilerplate',
      script: 'npm',
      args: 'start',
      max_memory_restart: '1000M',
      exec_mode: 'fork',
      instances: 1,
      node_args: '--expose-gc',
    },
  ],
};
