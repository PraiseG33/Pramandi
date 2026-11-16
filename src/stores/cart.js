import {defineStore} from 'pinia'
import {ref, computed, watch} from 'vue'
import site from '../data/site'
const KEY = 'pramandi-cart'
export const useCart = defineStore('cart', () => {
  const items = ref(JSON.parse(localStorage.getItem(KEY) || '[]'))
  const open = ref(false), toast = ref(''), code = ref('')
  let t
  watch(items, v => localStorage.setItem(KEY, JSON.stringify(v)), {deep: true})
  const count = computed(() => items.value.reduce((a, i) => a + i.qty, 0))
  const subtotal = computed(() => items.value.reduce((a, i) => a + i.qty * i.price, 0))
  const pct = computed(() => site.promos[code.value.trim().toUpperCase()] || 0)
  const discount = computed(() => Math.round(subtotal.value * pct.value / 100))
  function say(m) { toast.value = m; clearTimeout(t); t = setTimeout(() => toast.value = '', 2200) }
  function add(p, size, colour, qty = 1) {
    const key = `${p.id}-${size}-${colour}`, f = items.value.find(i => i.key === key)
    f ? f.qty += qty : items.value.push({key, slug: p.slug, name: p.name, price: p.price, size, colour, qty})
    say(`${p.name} added to cart`)
  }
  const setQty = (key, q) => { const f = items.value.find(i => i.key === key); if (f) f.qty = Math.max(1, q) }
  const remove = key => items.value = items.value.filter(i => i.key !== key)
  const clear = () => { items.value = []; code.value = '' }
  return {items, open, toast, code, count, subtotal, pct, discount, say, add, setQty, remove, clear}
})
