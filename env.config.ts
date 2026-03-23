export type TestEnv = 'prod' | 'dev';

interface EnvConfig {
  authApiUrl: string;
  appUrl: string;
  envParam: TestEnv;
}

const envConfigs: Record<TestEnv, EnvConfig> = {
  prod: {
    authApiUrl: 'https://db.gtwy.ai/api/auth/generate-token',
    appUrl: 'https://app.gtwy.ai',
    envParam: 'prod',
  },
  dev: {
    authApiUrl: 'https://dev-db.gtwy.ai/api/auth/generate-token',
    appUrl: 'https://dev.gtwy.ai',
    envParam: 'dev',
  },
};

export function getEnvConfig(): EnvConfig {
  const env = (process.env.TEST_ENV || 'dev') as TestEnv;
  const config = envConfigs[env];
  if (!config) throw new Error(`Unknown TEST_ENV: "${env}". Use "prod" or "dev".`);
  return config;
}
