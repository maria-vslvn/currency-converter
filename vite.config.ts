import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');

    return {
        plugins: [react(), tailwindcss()],
        server: {
            proxy: {
                '/api/currency': {
                    target: 'https://api.currencybeacon.com',
                    changeOrigin: true,
                    rewrite: (path) => {
                        const rewrittenPath = path.replace('/api/currency', '/v1');
                        const separator = rewrittenPath.includes('?') ? '&' : '?';

                        return `${rewrittenPath}${separator}api_key=${env.CURRENCY_BEACON_API_KEY}`;
                    },
                },
            },
        },
        test: {
            environment: 'jsdom',
            setupFiles: './src/test/setup.ts',
        },
    };
});
