const config = {
  "apps": [
    {
      "name": "club-LGC",
      "script": "./express/www",
      "instances": 1,
      "wait_ready": true,
      "env": {
        "NODE_ENV": "production",
        "PORT": 3000,
      },
      "combine_logs": true,
      "time": true,
    },
  ],
};

module.exports = config;
