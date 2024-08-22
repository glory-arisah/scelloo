import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue()],
	resolve: {
		alias: {
			'@components': path.resolve(__dirname, 'src/components'),
			'@store': path.resolve(__dirname, 'src/store'),
			'@views': path.resolve(__dirname, 'src/views'),
			'@utils': path.resolve(__dirname, 'src/utils'),
		},
	},
	css: {
		preprocessorOptions: {
			scss: {
				additionalData: `@import "src/assets/styles/mixins.scss";`,
			},
		},
	},
	build: {
		// Specify the directory where Vite will output the build files
		assetsDir: '@/assets', // This can be adjusted if needed
		rollupOptions: {
			// Configuration options for Rollup (which Vite uses internally)
			output: {
				// Ensure that assets are included in the build output
				assetFileNames: '@/assets/[name][extname]',
			},
		},
	},
})
