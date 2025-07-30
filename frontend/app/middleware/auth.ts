export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore();
  const localePath = useLocalePath();

  if (auth.isLoggedIn && !auth.user) await auth.fetchMe();
  if (!auth.isLoggedIn) {
    return navigateTo(localePath({ path: '/login', query: { redirect: to.fullPath } }));
  }
});
