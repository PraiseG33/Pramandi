import site from './data/site'
export const money = n => site.currency + Number(n).toLocaleString()
export const img = (slug, name) => `/images/products/${slug}/${name}`
