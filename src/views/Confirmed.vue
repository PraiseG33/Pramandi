<script setup>
import {useRoute} from 'vue-router'
const id = useRoute().query.id
</script>
<template><main class="grid min-h-screen place-items-center px-5 text-center"><div>
<p class="text-xs font-bold tracking-[.3em] text-accent">ORDER CONFIRMED</p>
<h1 class="mt-3 font-display text-6xl font-black">Thank you.</h1>
<p class="mt-3">Your order <b>{{ id }}</b> has been received.</p>
<RouterLink to="/shop" class="btn mt-6">KEEP SHOPPING</RouterLink></div></main></template>
