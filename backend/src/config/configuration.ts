export default () => ({
  app: {
    env: process.env.NODE_ENV ?? 'development',
    port: parseInt(process.env.PORT ?? '4000', 10),
    publicUrl: process.env.PUBLIC_URL ?? 'http://localhost:4000',
    corsOrigins: (process.env.CORS_ORIGINS ?? 'http://localhost:3000')
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
  },
  jwt: {
    secret: process.env.JWT_SECRET ?? 'change-this-super-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN ?? '1d',
  },
  admin: {
    email: process.env.ADMIN_EMAIL ?? 'admin@samdu.uz',
    password: process.env.ADMIN_PASSWORD ?? 'Admin12345!',
    fullName: process.env.ADMIN_FULL_NAME ?? 'SamDU Administrator',
  },
  upload: {
    dir: process.env.UPLOAD_DIR ?? 'uploads',
    maxSizeMb: parseInt(process.env.UPLOAD_MAX_SIZE_MB ?? '10', 10),
  },
});
