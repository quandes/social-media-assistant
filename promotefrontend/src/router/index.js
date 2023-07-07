import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../components/LoginPage.vue'
import GenCompWrapper from '../components/GenCompWrapper.vue'


const routes = [{
    path: '/',
    component: LoginPage,
},
{
    path: '/GenCompWrapper',
    component: GenCompWrapper,
}]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router


