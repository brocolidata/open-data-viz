import adapter from '@sveltejs/adapter-static';

const isDev = process.argv.includes('dev');
const base = isDev ? '' : process.env.BASE_PATH;

export default {
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: '404.html',
			precompress: false,
			strict: true,
			
		}),
		paths: {
			base
		}
	}
};