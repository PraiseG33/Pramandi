<script setup>
import {ref} from 'vue'
import products from '../data/products'
import site from '../data/site'
import {useCart} from '../stores/cart'
import Product from './Product.vue'
import ProductCard from '../components/ProductCard.vue'
const featured = products.find(p => p.featured) || products[0]
const cart = useCart(), email = ref('')
function join() {
  if (!/^\S+@\S+\.\S+$/.test(email.value)) return cart.say('Enter a valid email')
  cart.say("You're on the list"); email.value = ''   // connect your email service here
}
</script>
<template>
  <Product :slug="featured.slug" />
  <section class="mx-auto grid max-w-6xl gap-8 px-5 py-20 md:grid-cols-3">
    <div v-for="(f, i) in site.features" :key="f.t" class="border-t-2 border-accent pt-4">
      <p class="font-display text-3xl font-black text-accent">{{ String(i + 1).padStart(2, '0') }}</p>
      <h3 class="mt-2 text-xl font-extrabold">{{ f.t }}</h3><p class="mt-1 text-ink/70">{{ f.d }}</p>
    </div>
  </section>
  <section class="mx-auto max-w-6xl px-5 pb-20">
    <div class="mb-8 flex items-end justify-between"><h2 class="font-display text-5xl font-black">THE DROP</h2><RouterLink to="/shop" class="text-sm font-bold underline">View all</RouterLink></div>
    <div class="grid grid-cols-2 gap-5 md:grid-cols-3"><ProductCard v-for="p in products" :key="p.id" :p="p" /></div>
  </section>
  <section class="mx-auto max-w-3xl px-5 pb-20">
    <h2 class="font-display text-4xl font-black">QUESTIONS</h2>
    <details v-for="f in site.faq" :key="f.q" class="border-b border-ink/15 py-4"><summary class="cursor-pointer font-extrabold">{{ f.q }}</summary><p class="mt-2 text-ink/70">{{ f.a }}</p></details>
  </section>
  <section class="bg-accent px-5 py-16 text-paper"><div class="mx-auto max-w-3xl text-center">
    <h2 class="font-display text-4xl font-black">GET FIRST ACCESS TO DROPS</h2>
    <form class="mt-6 flex flex-col gap-3 sm:flex-row" @submit.prevent="join" novalidate>
      <input v-model="email" type="email" placeholder="Your email" aria-label="Email" class="flex-1 border-2 border-paper bg-transparent px-4 py-3 placeholder:text-paper/60">
      <button class="border-2 border-paper bg-paper px-6 py-3 font-extrabold tracking-widest text-accent">JOIN</button>
    </form></div>
  </section>
</template>
