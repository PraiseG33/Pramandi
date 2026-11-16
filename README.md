# PRAMANDI: interactive clothing store (Vue 3 + Vite)

## Setup
```
npm install
npm run dev
```
Open the address shown in the terminal. Build for production with `npm run build`.

## Folder structure
- `src/data/site.js`: brand name, tagline, currency, accent colour, delivery options, promo codes, contact details
- `src/data/products.js`: every product (prices, sizes, colours, labels, image file names)
- `src/components/`: ProductViewer (scroll spin + labels + x-ray), CartDrawer, ProductCard
- `src/views/`: Home, Shop, Product, Checkout, Confirmed, NotFound
- `src/stores/cart.js`: cart (saved in localStorage)
- `public/images/products/<slug>/`: your images

## Add a product
Copy one object in `src/data/products.js`, change the fields, and make a folder `public/images/products/<new-slug>/`.

## Add your images (no code changes)
Put files in `public/images/products/<slug>/`, then list the names in `products.js`:
- `turntable`: the same garment photographed around 360 degrees, same size, lighting and plain background. Use 4 to 8 for a quick start, 24 to 36 for a smooth spin. Name them in order (`01.webp`, `02.webp`...). Size: 1200 x 1500 px. Format: WebP (or PNG/JPG/AVIF), under 150 KB each if possible.
- `xray` (optional): inside or construction view, e.g. `['xray-01.webp']`, same size.
- `cover`: shop card photo, 1000 x 1250 px.
- `gallery`: extra photos, any size above 1000 px wide.
- Per colour: add `turntable: [...]` inside a colour object to give that colour its own photos.
Until you add images the site shows a placeholder garment that spins and has an x-ray wireframe.

## Labels (hotspots)
In `products.js`, each hotspot is `{at, x, y, title, text}`. `at` is the scroll position (0 to 1) when it appears. `x` and `y` are its position on the screen in %.

## Change brand colours and currency
Edit `accent` and `currency` in `src/data/site.js`. Other colours are in `tailwind.config.js`.

## Payments
`src/views/Checkout.vue` has a `PAYMENT PLACEHOLDER` comment where you plug in Paystack or Flutterwave.

## Deploy to Vercel
Push to GitHub, import the repo in Vercel (it detects Vite), and deploy. For page refresh on `/shop` to work, add a `vercel.json` with `{"rewrites":[{"source":"/(.*)","destination":"/"}]}`.

## Update: theme, 3D shirt, side notes
- Theme: black with green accent (`accent` in `src/data/site.js`, base colours in `tailwind.config.js`).
- 3D shirt: with no photos, the viewer builds a real 3D top in Three.js. Set `shape` in `products.js` to `tee`, `crop` or `long`. Once you list `turntable` photos, the photos are used instead.
- Side notes: the `notes` list in `products.js` appears one by one in the right-hand rail while scrolling (sample copy, replace it).
- Logo: `src/components/Logo.vue` (glitch flicker and spinning star). Edit its CSS in `src/style.css`.
- Product folders are now `static-tee`, `baby-tee` and `acid-longsleeve` under `public/images/products/`.

## Editing the shirt viewer (src/data/viewer.js)
- Lighting: `exposure`, `envIntensity` and the `lights` numbers. Raise them if the shirt looks dark.
- Logo: `logo.text`, `logo.sub`, `logo.image` (a PNG in /public), size and height on the chest. Set `logo.enabled: false` to remove it.
- `plainShirt: true` hides the print baked into the GLB and uses the product colour. Set it to `false` to keep the model as it is.
- `modelTurnY: Math.PI` turns the model if its front faces away.
- `stages`: where the shirt sits at each scroll point. It fades out and reappears in the next one.
- Compress the GLB before deploying (see notes), large files load slowly on phones.
