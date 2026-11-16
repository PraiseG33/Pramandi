<script setup>
import {RouterLink, RouterView} from 'vue-router'
import site from './data/site'
import {useCart} from './stores/cart'
import CartDrawer from './components/CartDrawer.vue'
import Logo from './components/Logo.vue'
const cart = useCart()
</script>
<template>
  <header class="fixed inset-x-0 top-0 z-30 flex items-center justify-between bg-gradient-to-b from-paper to-transparent px-5 pb-6 pt-4" style="padding-top:max(1rem,env(safe-area-inset-top))">
    <RouterLink to="/" class="text-xl" aria-label="Home"><Logo :text="site.name" /></RouterLink>
    <nav class="flex items-center gap-5 text-sm font-bold tracking-widest">
      <RouterLink to="/shop">SHOP</RouterLink>
      <button @click="cart.open = true" aria-label="Open cart">CART ({{ cart.count }})</button>
    </nav>
  </header>
  <RouterView />
  <footer class="border-t border-ink/15 px-5 py-14 pb-28">
    <div class="mx-auto grid max-w-6xl gap-10 md:grid-cols-3">
      <div>
        <Logo :text="site.name" />
        <p class="mt-3 max-w-xs text-sm text-ink/60">{{ site.tagline }}</p>
      </div>
      <nav class="space-y-2 text-sm">
        <b class="block">Shop</b>
        <RouterLink to="/shop" class="block text-ink/70 hover:text-accent transition-colors">All products</RouterLink>
        <RouterLink to="/checkout" class="block text-ink/70 hover:text-accent transition-colors">Checkout</RouterLink>
      </nav>
      <div class="space-y-2 text-sm">
        <b class="block">Contact</b>
        <p class="text-ink/70">{{ site.contact.email }}</p>
        <p class="text-ink/70">{{ site.contact.phone }}</p>
        <a :href="site.contact.instagram" target="_blank" rel="noopener" class="block text-ink/70 underline hover:text-accent transition-colors">Instagram</a>
      </div>
    </div>
    <p class="mx-auto mt-10 max-w-6xl text-xs text-ink/50">{{ site.shippingNote }} © 2026 {{ site.name }}</p>
  </footer>
  <CartDrawer />
  <div
    v-if="cart.toast"
    role="status"
    class="fixed left-1/2 top-20 z-50 -translate-x-1/2 bg-accent px-5 py-3 text-sm font-extrabold text-paper shadow-lg"
  >{{ cart.toast }}</div>
</template>
