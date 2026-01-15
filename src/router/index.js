import { createRouter, createWebHistory } from 'vue-router'

// Pages
import Home from '../pages/Home.vue'
import Iphone from '../pages/Iphone.vue'
import Pixel from '../pages/Pixel.vue'
import Samsung from '../pages/Samsung.vue'
import Nokia from '../pages/Nokia.vue'

const routes = [
	{
		path: '/',
		component: Home
	},
	{
		path: '/iphone',
		component: Iphone
	},
	{
		path: '/pixel',
		component: Pixel
	},
	{
		path: '/samsung',
		component: Samsung
	},
	{
		path: '/nokia',
		component: Nokia
	}
]

const router = createRouter({
	history: createWebHistory(),
	routes
})

export default router