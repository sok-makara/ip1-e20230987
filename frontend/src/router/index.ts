import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import ProductListView from '../views/ProductListView.vue'
import ProductFormView from '../views/ProductFormView.vue'
import ProductDetailView from '../views/ProductDetailView.vue'
import StockFormView from '../views/StockFormView.vue'
import LowStockView from '../views/LowStockView.vue'
import ReportView from '../views/ReportView.vue'
import NotFoundView from '../views/NotFoundView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: LoginView },
    { path: '/products', component: ProductListView },
    { path: '/products/new', component: ProductFormView },
    { path: '/products/:id(\\d+)', component: ProductDetailView }, // detail page with a route parameter
    { path: '/products/:id(\\d+)/edit', component: ProductFormView },
    { path: '/stock', component: StockFormView },
    { path: '/low-stock', component: LowStockView },
    { path: '/report', component: ReportView },
    { path: '/:pathMatch(.*)*', component: NotFoundView },
  ],
})

export default router
