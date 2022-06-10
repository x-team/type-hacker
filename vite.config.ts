import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ /*command,*/ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  return {
    // vite config
    define: {
      __API_SIGNING_SECRET__: JSON.stringify(env.API_SIGNING_SECRET),
    },
  };
});
