interface NameToType {
  // THESE ALL ARE PUBLIC
  // VITE CONFIG
  MODE: string;
  // API
  VITE_API_CLIENT_SECRET: string;
  VITE_API_HOST: string;
  VITE_GAMES_API_HIGHEST_LEADERBOARD_ID: string;
}

export function getConfig<T extends keyof NameToType>(name: T): NameToType[T];
export function getConfig(name: string): string | number | boolean {
  const value = import.meta.env[name];

  switch (name) {
    case 'MODE':
      return value || 'development';
  }

  if (!value) {
    throw new Error(`Cannot find environmental variable: ${name}`);
  }

  return value;
}

export const isProd = () => getConfig('MODE') === 'production';

export const isStaging = () => getConfig('MODE') === 'development';
