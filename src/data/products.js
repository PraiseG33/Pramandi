// PRODUCTS. Add or edit items here. Images go in public/images/products/<slug>/
// shape: 'tee' | 'crop' | 'long'  (the 3D placeholder uses this until you add real photos)
// turntable: ordered file names, e.g. ['01.webp','02.webp', ...] (leave [] to use the 3D placeholder)
// xray: optional inside view(s), e.g. ['xray-01.webp']   cover: shop card photo   gallery: extra photos
// hotspots: main labels (desktop). at = scroll position (0 to 1), x/y = position in % on screen
// model: optional per-product GLB path, e.g. model: '/models/baby-tee.glb'
// notes: side rail details shown one by one while scrolling (sample copy: replace with your own)
const spots = [
  {at: 0.24, x: 8, y: 30, title: 'Fabric', text: '240gsm combed cotton. Soft, dense, holds its shape.'},
  {at: 0.38, x: 8, y: 56, title: 'Fit', text: 'Boxy cut with dropped shoulders.'},
  {at: 0.52, x: 56, y: 34, title: 'Stitching', text: 'Double-needle seams at every stress point.'},
  {at: 0.66, x: 56, y: 62, title: 'Care', text: 'Wash cold, inside out. Do not tumble dry.'}
]
const notes = [
  {at: 0, title: 'Drop 01', text: 'Limited run. When a size is gone, it is gone.'},
  {at: 0.14, title: 'Front print', text: 'High-density print that stays crisp wash after wash.'},
  {at: 0.3, title: 'Neckline', text: 'Ribbed collar that keeps its shape.'},
  {at: 0.45, title: 'Model fit', text: 'Model is 6ft and wears size L.'},
  {at: 0.6, title: 'Sizing', text: 'Size up one for the oversized look.'},
  {at: 0.75, title: 'Inside', text: 'Soft brushed inner for all-day wear.'}
]
const sizes = [{label: 'S', stock: 8}, {label: 'M', stock: 12}, {label: 'L', stock: 10}, {label: 'XL', stock: 0}]
const xrayNotes = [
  {title: 'Taped neck', text: 'Seam tape stops the collar stretching.'},
  {title: 'Brushed inner', text: 'Soft against the skin, all day.'},
  {title: 'Reinforced shoulders', text: 'Extra stitching where tees fail first.'}
]
const base = {xrayNotes, category: 'Tops', sizes, turntable: [], xray: [], cover: '', gallery: [], hotspots: spots, notes}
export default [
  {...base, id: 1, slug: 'static-tee', name: 'Static Boxy Tee', price: 25000, featured: true, shape: 'tee',
   description: 'Heavyweight boxy tee with a glitch print. Made for the group photo.',
   colours: [{name: 'Black', hex: '#151515'}, {name: 'Acid Green', hex: '#39F27A'}, {name: 'Off-white', hex: '#ECEAE3'}]},
  {...base, id: 2, slug: 'baby-tee', name: 'Y2K Baby Tee', price: 18000, shape: 'crop',
   description: 'Cropped, fitted and a little bit loud.',
   colours: [{name: 'Black', hex: '#151515'}, {name: 'Acid Green', hex: '#39F27A'}]},
  {...base, id: 3, slug: 'acid-longsleeve', name: 'Acid Long Sleeve', price: 32000, shape: 'long',
   description: 'Long sleeve with an oversized fit and sleeve print.',
   colours: [{name: 'Charcoal', hex: '#2c2c2c'}, {name: 'Acid Green', hex: '#39F27A'}]}
]
