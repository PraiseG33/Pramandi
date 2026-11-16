<script setup>
import {RouterLink} from 'vue-router'
import {useCart} from '../stores/cart'
import {money} from '../utils'
const cart = useCart()
</script>
<template>
  <div v-if="cart.open" class="fixed inset-0 z-40 bg-ink/50" @click="cart.open = false"></div>
  <aside class="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-paper p-5 transition-transform duration-300" :class="cart.open ? 'translate-x-0' : 'translate-x-full'" aria-label="Cart">
    <div class="flex items-center justify-between"><h2 class="font-display text-3xl font-black">CART</h2><button @click="cart.open = false" aria-label="Close cart" class="text-2xl">×</button></div>
    <div class="mt-5 flex-1 overflow-y-auto">
      <p v-if="!cart.items.length">Your cart is empty.</p>
      <div v-for="i in cart.items" :key="i.key" class="flex justify-between border-b border-ink/15 py-4">
        <div><b>{{ i.name }}</b><p class="text-sm text-ink/60">{{ i.colour }} / {{ i.size }}</p>
          <div class="mt-2 flex items-center gap-2"><button class="border px-2" @click="cart.setQty(i.key, i.qty - 1)" aria-label="Less">-</button><span>{{ i.qty }}</span><button class="border px-2" @click="cart.setQty(i.key, i.qty + 1)" aria-label="More">+</button>
          <button class="ml-3 text-sm underline" @click="cart.remove(i.key)">Remove</button></div></div>
        <b>{{ money(i.price * i.qty) }}</b>
      </div>
    </div>
    <div v-if="cart.items.length" class="border-t-2 border-ink pt-4">
      <input v-model="cart.code" placeholder="Promo code" aria-label="Promo code" class="w-full border-2 border-ink bg-transparent px-3 py-2">
      <p v-if="cart.pct" class="mt-1 text-sm text-accent">{{ cart.pct }}% off applied</p>
      <p class="mt-3 flex justify-between font-extrabold"><span>Subtotal</span><span>{{ money(cart.subtotal - cart.discount) }}</span></p>
      <RouterLink to="/checkout" class="btn btn-fill mt-4 block text-center" @click="cart.open = false">CHECKOUT</RouterLink>
    </div>
  </aside>
</template>
