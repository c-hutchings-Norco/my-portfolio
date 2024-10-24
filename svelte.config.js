import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

const config = {
    preprocess: preprocess(),
    kit: {
        adapter: adapter({
            pages: 'build',  // Output directory for your built files
            assets: 'build', // Directory for static assets
            fallback: null   // Set to 'index.html' if you want a fallback page
        }),
        paths: {
            base: process.env.NODE_ENV === 'production' ? '/my-portfolio' : '' // Change 'my-portfolio' to your repo name if applicable
        }
    }
};

export default config;