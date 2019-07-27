module.exports = (router) => {
  const v1 = require('./v1');
  router.use('/', v1);
}
