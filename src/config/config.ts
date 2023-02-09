export default () => ({
  app: {
    env: process.env.APP_ENV || 'development',
    port: parseInt(process.env.APP_PORT, 10) || 3000,
  },
  swagger: {
    docsUrl: process.env.DOCS_URL || 'docs',
  },
});
