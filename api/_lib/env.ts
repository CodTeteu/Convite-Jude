export function getEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`A variável de ambiente ${name} não está configurada.`);
  }

  return value;
}

export function getServerEnv() {
  return {
    supabaseUrl: getEnv("SUPABASE_URL"),
    supabaseServiceRoleKey: getEnv("SUPABASE_SERVICE_ROLE_KEY"),
    adminPassword: getEnv("ADMIN_PASSWORD"),
    adminJwtSecret: getEnv("ADMIN_JWT_SECRET"),
  };
}
