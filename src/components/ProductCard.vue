<script setup>
import {RouterLink} from 'vue-router'
import {money, img} from '../utils'
defineProps({p: Object})
</script>
<template>
  <RouterLink :to="`/product/${p.slug}`" class="group block">
    <div class="relative aspect-[4/5] overflow-hidden bg-ink/5">
      <img v-if="p.cover" :src="img(p.slug, p.cover)" :alt="p.name" loading="lazy" class="h-full w-full object-cover transition duration-500 group-hover:scale-105">
      <div v-else class="grid h-full place-items-center transition duration-500 group-hover:scale-105">
        <svg viewBox="0 0 100 100" class="w-2/3 text-accent" stroke="currentColor" stroke-width="1.5"><path d="M30 10L8 30l12 18 10-8v50h40V40l10 8 12-18L70 10Q50 24 30 10Z" :fill="p.colours[0].hex"/></svg>
      </div>
    </div>
    <div class="mt-3 flex justify-between"><h3 class="font-extrabold">{{ p.name }}</h3><span>{{ money(p.price) }}</span></div>
    <p class="text-sm text-ink/60">{{ p.category }}</p>
  </RouterLink>
</template>
