export default ({ app, store }) => {
  app.router.beforeEach((to, from, next) => {
    store.dispatch("initializeTimeframes", {});
    next();
  });
  app.router.afterEach((to, from) => {});
};
