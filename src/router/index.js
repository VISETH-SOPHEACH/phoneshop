import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import Iphone from '../pages/Iphone.vue'
import SecondHand from '../pages/SecondHand.vue'
import Samsung from '../pages/Samsung.vue'
import Accessory from '../pages/Accesury.vue'

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
		path: '/secondHand',
		component: SecondHand
	},
	{
		path: '/samsung',
		component: Samsung
	},
	{
		path: '/accessory',
		component: Accessory
	}
]

const router = createRouter({
	history: createWebHistory(),
	routes
})

export default router