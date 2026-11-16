<script setup>
import {ref, computed} from 'vue'
import products from '../data/products'
import ProductCard from '../components/ProductCard.vue'
const q = ref(''), cat = ref('All'), sort = ref('new')
const cats = ['All', ...new Set(products.map(p => p.category))]
const list = computed(() => {
  let l = products.filter(p => (cat.value === 'All' || p.category === cat.value) && p.name.toLowerCase().includes(q.value.toLowerCase()))
  if (sort.value === 'low') l = [...l].sort((a, b) => a.price - b.price)
  if (sort.value === 'high') l = [...l].sort((a, b) => b.price - a.price)
  return l
})
</script>
<template>
  <main class="mx-auto max-w-6xl px-5 pb-16 pt-28">
    <h1 class="font-display text-6xl font-black sm:text-8xl">SHOP</h1>
    <div class="mt-8 flex flex-wrap items-center gap-3">
      <button v-for="c in cats" :key="c" class="btn !py-2" :class="cat === c && 'btn-fill'" @click="cat = c">{{ c.toUpperCase() }}</button>
      <input v-model="q" type="search" placeholder="Search" aria-label="Search products" class="ml-auto border-2 border-ink bg-transparent px-3 py-2">
      <select v-model="sort" aria-label="Sort" class="border-2 border-ink bg-transparent px-3 py-2">
        <option value="new">Newest</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option>
      </select>
    </div>
    <div class="mt-8 grid grid-cols-2 gap-5 md:grid-cols-3">
      <ProductCard v-for="p in list" :key="p.id" :p="p" />
    </div>
    <p v-if="!list.length" class="mt-10">No products match.</p>
  </main>
</template>
