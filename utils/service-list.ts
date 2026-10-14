import { execFileSync } from 'child_process';
import { getEnvConfig } from '../env.config';
import { getDbBaseUrl } from './api-cleanup';

export interface ServiceInfo {
  key: string;
  name: string;
}

// Runs in a child Node process because spec files load synchronously and can't await the auth + service calls.
const FETCH_SERVICES_SCRIPT = `
(async () => {
  const auth = await fetch(process.env.AUTH_API_URL, {
    method: 'POST',
    headers: { 'automation-token': process.env.GTWY_AUTOMATION_TOKEN, 'content-type': 'application/json' },
    body: JSON.stringify({ env: process.env.ENV_PARAM }),
  });
  const { token } = await auth.json();
  const res = await fetch(process.env.DB_BASE_URL + '/api/service', { headers: { authorization: token } });
  const body = await res.json();
  const services = Object.entries(body.services ?? {}).map(([key, value]) => ({
    key,
    name: value.default_name ?? key,
  }));
  process.stdout.write(JSON.stringify(services));
})().catch((err) => { console.error(err); process.exit(1); });
`;

/**
 * Returns every service the backend supports (GET /api/service), keyed by the lowercase id the
 * service dropdown uses (e.g. 'openai', 'open_router'). Synchronous so spec files can create one test per service.
 */
export function loadServicesSync(): ServiceInfo[] {
  const envConfig = getEnvConfig();
  const output = execFileSync(process.execPath, ['-e', FETCH_SERVICES_SCRIPT], {
    env: {
      ...process.env,
      AUTH_API_URL: envConfig.authApiUrl,
      ENV_PARAM: envConfig.envParam,
      DB_BASE_URL: getDbBaseUrl(),
    },
    encoding: 'utf8',
  });
  const services: ServiceInfo[] = JSON.parse(output);
  if (services.length === 0) throw new Error('No services returned from GET /api/service');
  return services;
}
