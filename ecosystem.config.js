module.exports = {
  apps: [{
    name: 'verticals',
    script: './src/index.js',
    watch: ['./src'],
    args: [
      '--color',
    ],
    exec_mode: 'cluster',
    instances: 1,
    // instances: 'max',
    env: {
      NODE_ENV: 'development',
      DEBUG_COLORS: true,
      HOST: '0.0.0.0',
      PORT: 3000,
      JWT_EXPIRE: '1Y',
      JWT_SECRET: 'verticals_secret_yB4wh92erhF',
      CORS_ORIGIN: '*',
      METRICS_ENABLED: true,
      METRICS_PORT: 3001,
      METRICS_HOST: '0.0.0.0',
      METRICS_ROUTE: '/metrics',
      METRICS_TIMEOUT: 5000,
      SWAGGER_JSON_ROUTE: '/doc.json',
      SWAGGER_TITLE: 'Verticals Backend',
      SWAGGER_VERSION: '0.1.0',
      SWAGGER_DESCRIPTION: 'Backend part for verticals project',
      SWAGGER_HOST: '0.0.0.0:3000',
      SWAGGER_BASE_PATH: '/api',
      LOG_FILE_NAME: `app_${new Date().getTime()}`,
      CDN_LINK: 'cdn.verticals.xom9ik.com',
    },
    env_production: {
      NODE_ENV: 'production',
      JWT_EXPIRE: '1H',
    },
  }],
};
