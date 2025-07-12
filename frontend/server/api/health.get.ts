export default defineEventHandler(async () => {
  const config = useRuntimeConfig();
  const backend = await $fetch<{ status: string }>(`${config.apiBaseServer}/health`, { timeout: 3000 })
    .then((response) => response.status)
    .catch(() => 'unreachable');
  return { status: 'ok', backend, timestamp: new Date().toISOString() };
});
