import adapter from '@sveltejs/adapter-static';

const config = {
    kit: {
        adapter: adapter({
            pages: 'build', // Directory to deploy to GitHub Pages
            assets: 'build'
        }),
        paths: {
            base: process.env.NODE_ENV === 'production' ? '/REPO_NAME' : '' // Change REPO_NAME to your repo
        }
    }
};

export default config;
