import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

const config = {
    preprocess: preprocess(),
    kit: {
        adapter: adapter({
            pages: 'build',  // Output directory for built files
            assets: 'build', // Where static assets go
            fallback: 'index.html' // Optional: fallback for SPA routing
        }),
        paths: {
            base: process.env.NODE_ENV === 'production' ? '/my-portfolio' : ''
        }
    }
};

export default config;