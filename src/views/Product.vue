<script setup>
import {ref, computed} from 'vue'
import {useRoute, RouterLink} from 'vue-router'
import products from '../data/products'
import {money, img} from '../utils'
import {useCart} from '../stores/cart'
import ProductViewer from '../components/ProductViewer.vue'
const props = defineProps({slug: String})
const route = useRoute(), cart = useCart()
const p = computed(() => products.find(x => x.slug === (props.slug || route.params.slug)))
const ci = ref(0), size = ref('')
function add() {
  if (!size.value) return cart.say('Pick a size first')
  cart.add(p.value, size.value, p.value.colours[ci.value].name)
  cart.open = true
}
</script>
<template>
  <main v-if="p">
    <ProductViewer :key="p.slug" :product="p" :colour="ci" />

    <!-- Ticker -->
    <div class="overflow-hidden border-y border-ink/20 bg-accent py-3 text-paper">
      <div class="ticker flex w-max gap-10 whitespace-nowrap font-display text-xl font-black tracking-wide sm:text-2xl">
        <span v-for="n in 12" :key="n">NEW DROP ✱ LIMITED RUN ✱</span>
      </div>
    </div>

    <!-- Product details -->
    <section class="mx-auto grid max-w-6xl gap-12 px-5 py-16 md:grid-cols-2 md:py-24">
      <div>
        <p class="text-[11px] font-bold tracking-[0.3em] text-accent">{{ p.category.toUpperCase() }}</p>
        <h2 class="mt-3 font-display text-4xl font-black leading-none tracking-tight sm:text-5xl">{{ p.name }}</h2>
        <p class="mt-4 max-w-md text-base leading-relaxed text-ink/65">{{ p.description }}</p>
        <p class="mt-5 text-2xl font-extrabold tracking-tight">{{ money(p.price) }}</p>
        <RouterLink to="/shop" class="btn mt-8">MORE PRODUCTS</RouterLink>
      </div>

      <dl class="divide-y divide-ink/10 border-y border-ink/10">
        <div v-for="h in p.hotspots" :key="h.title" class="grid grid-cols-3 gap-4 py-4">
          <dt class="text-sm font-extrabold">{{ h.title }}</dt>
          <dd class="col-span-2 text-sm leading-relaxed text-ink/65">{{ h.text }}</dd>
        </div>
      </dl>

      <div v-if="p.gallery.length" class="grid grid-cols-2 gap-3 md:col-span-2">
        <img v-for="n in p.gallery" :key="n" :src="img(p.slug, n)" :alt="p.name" loading="lazy" class="w-full object-cover">
      </div>
    </section>

    <!-- Sticky add-to-cart bar -->
    <div
      class="fixed inset-x-0 bottom-0 z-20 flex flex-wrap items-center gap-3 border-t border-ink/15 bg-paper/90 px-4 py-3 backdrop-blur-md"
      style="padding-bottom:max(0.75rem,env(safe-area-inset-bottom))"
    >
      <div class="mr-auto min-w-0">
        <b class="block truncate text-sm">{{ p.name }}</b>
        <span class="text-sm text-ink/60">{{ money(p.price) }}</span>
      </div>

      <div class="flex items-center gap-1.5">
        <button
          v-for="(c, i) in p.colours"
          :key="c.name"
          :aria-label="c.name"
          class="h-6 w-6 rounded-full border-2 transition-transform hover:scale-110"
          :class="ci === i ? 'border-accent scale-110' : 'border-ink/40'"
          :style="{background: c.hex}"
          @click="ci = i"
        ></button>
      </div>

      <select
        v-model="size"
        aria-label="Size"
        class="border border-ink/30 bg-transparent px-3 py-2 text-sm focus:border-accent focus:outline-none"
      >
        <option value="">Size</option>
        <option v-for="s in p.sizes" :key="s.label" :value="s.label" :disabled="!s.stock">
          {{ s.label }}{{ s.stock ? '' : ' (sold out)' }}
        </option>
      </select>

      <button class="btn btn-fill !py-2.5 !px-5" @click="add">ADD TO CART</button>
    </div>
  </main>
  <main v-else class="grid min-h-screen place-items-center">
    <p class="text-lg font-bold">Product not found.</p>
  </main>
</template>
