<script setup>
import {reactive, ref, computed} from 'vue'
import {useRouter} from 'vue-router'
import site from '../data/site'
import {useCart} from '../stores/cart'
import {money} from '../utils'
const cart = useCart(), router = useRouter()
const f = reactive({name: '', phone: '', address: '', delivery: site.delivery[0].id}), err = ref({})
const fee = computed(() => site.delivery.find(d => d.id === f.delivery).fee)
const total = computed(() => cart.subtotal - cart.discount + fee.value)
function submit() {
  const e = {}
  if (f.name.trim().length < 2) e.name = 'Enter your full name'
  if (!/^\+?[0-9\s-]{10,15}$/.test(f.phone)) e.phone = 'Enter a valid phone number'
  if (f.address.trim().length < 8 && f.delivery !== 'pickup') e.address = 'Enter your full address'
  err.value = e
  if (Object.keys(e).length || !cart.items.length) return
  // PAYMENT PLACEHOLDER: call Paystack or Flutterwave here with `total.value`, then continue on success.
  const id = 'PRM-' + Date.now().toString().slice(-6)
  cart.clear()
  router.push({name: 'confirmed', query: {id}})
}
</script>
<template>
  <main class="mx-auto grid max-w-5xl gap-10 px-5 pb-16 pt-28 md:grid-cols-2">
    <form @submit.prevent="submit" novalidate class="space-y-4">
      <h1 class="font-display text-5xl font-black">CHECKOUT</h1>
      <label class="block">Full name<input v-model="f.name" class="mt-1 w-full border-2 border-ink bg-transparent px-3 py-2"><span class="text-sm text-accent">{{ err.name }}</span></label>
      <label class="block">Phone<input v-model="f.phone" inputmode="tel" class="mt-1 w-full border-2 border-ink bg-transparent px-3 py-2"><span class="text-sm text-accent">{{ err.phone }}</span></label>
      <label class="block">Address<textarea v-model="f.address" rows="3" class="mt-1 w-full border-2 border-ink bg-transparent px-3 py-2"></textarea><span class="text-sm text-accent">{{ err.address }}</span></label>
      <label class="block">Delivery<select v-model="f.delivery" class="mt-1 w-full border-2 border-ink bg-transparent px-3 py-2"><option v-for="d in site.delivery" :key="d.id" :value="d.id">{{ d.label }}</option></select></label>
      <button class="btn btn-fill w-full">PLACE ORDER ({{ money(total) }})</button>
    </form>
    <section>
      <h2 class="font-display text-3xl font-black">SUMMARY</h2>
      <p v-if="!cart.items.length" class="mt-4">Your cart is empty. <RouterLink to="/shop" class="underline">Shop</RouterLink></p>
      <p v-for="i in cart.items" :key="i.key" class="mt-3 flex justify-between"><span>{{ i.qty }} x {{ i.name }} ({{ i.size }})</span><span>{{ money(i.qty * i.price) }}</span></p>
      <p class="mt-4 flex justify-between border-t border-ink/20 pt-3"><span>Discount</span><span>-{{ money(cart.discount) }}</span></p>
      <p class="flex justify-between"><span>Delivery</span><span>{{ money(fee) }}</span></p>
      <p class="mt-2 flex justify-between text-xl font-extrabold"><span>Total</span><span>{{ money(total) }}</span></p>
    </section>
  </main>
</template>
