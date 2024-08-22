import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue()],
	resolve: {
		alias: {
			'@assets': path.resolve(__dirname, 'src/assets'),
			'@components': path.resolve(__dirname, 'src/components'),
			'@store': path.resolve(__dirname, 'src/store'),
			'@views': path.resolve(__dirname, 'src/views'),
			'@utils': path.resolve(__dirname, 'src/utils'),
		},
	},
	css: {
		preprocessorOptions: {
			scss: {
				additionalData: `@import "@assets/styles/mixins.scss";`,
			},
		},
	},
})
