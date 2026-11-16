<script setup>
// Scroll-driven product viewer: a 3D shirt (GLB) or a photo turntable, drawn to one canvas.
// The shirt fades out and reappears in a new position at each "stage" (see src/data/viewer.js).
// Continuous auto-rotation runs independently of scroll.
import {ref, computed, watch, onMounted, onBeforeUnmount} from 'vue'
import * as THREE from 'three'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js'
import gsap from 'gsap'
import {ScrollTrigger} from 'gsap/ScrollTrigger'
import site from '../data/site'
import cfg from '../data/viewer'
import {img, money} from '../utils'
gsap.registerPlugin(ScrollTrigger)

const props = defineProps({product: Object, colour: {type: Number, default: 0}})
const wrap = ref(null), cv = ref(null), prog = ref(0), pct = ref(0), ready = ref(false), failed = ref(false)
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
const mobile = innerWidth < 700
let frames = [], xr = [], real = false, cur = 0, tgt = 0, raf, st
const pt = {x: .5, y: .5}
let clock = 0 // for continuous rotation

const notes = computed(() => props.product.notes || [])
const ai = computed(() => notes.value.reduce((a, n, i) => prog.value >= n.at ? i : a, 0))
const vis = h => Math.abs(prog.value - h.at) < cfg.hotspotWindow
const pad = n => String(n).padStart(2, '0')

/* ---------- photo turntable (optional) ---------- */
const names = computed(() => {
  const t = props.product.colours[props.colour]?.turntable || props.product.turntable || []
  return mobile && t.length > 12 ? t.filter((_, i) => i % 2 === 0) : t
})
const load = list => Promise.all(list.map(n => new Promise(r => {
  const i = new Image(); i.onload = () => r(i); i.onerror = () => r(null); i.src = img(props.product.slug, n)
})))
async function init() {
  const a = await load(names.value)
  frames = a.filter(Boolean); real = frames.length > 0 && frames.length === a.length
  xr = (await load(props.product.xray || [])).filter(Boolean)
  if (real) ready.value = true
}

/* ---------- stages: where the shirt is for a given scroll position ---------- */
function stageState(p) {
  const S = cfg.stages; let i = S.findIndex(s => p < s.to); if (i < 0) i = S.length - 1
  const s = S[i], t = Math.min(Math.max((p - s.from) / (s.to - s.from), 0), 1)
  let a = 1; if (i > 0) a = Math.min(a, t / cfg.fade); if (i < S.length - 1) a = Math.min(a, (1 - t) / cfg.fade)
  a = Math.min(Math.max(a, 0), 1)
  return {
    x: s.x,
    y: s.y || 0,
    scale: s.scale || 1,
    ry: s.ry[0] + (s.ry[1] - s.ry[0]) * t,
    alpha: a * a * (3 - 2 * a)
  }
}

/* ---------- 3D scene ---------- */
let R, scene, cam, holder, model, xrayRoot, wire, logoMesh, lastHex = ''
function logoTex(hex) {
  if (cfg.logo.image) {
    const t = new THREE.TextureLoader().load(cfg.logo.image)
    t.colorSpace = THREE.SRGBColorSpace
    return t
  }
  const c = document.createElement('canvas')
  c.width = 1024
  c.height = 512
  const g = c.getContext('2d')
  const lum = parseInt(hex.slice(1, 3), 16) * .3 + parseInt(hex.slice(3, 5), 16) * .6 + parseInt(hex.slice(5, 7), 16) * .1
  const fg = cfg.logo.colour === 'auto' ? (lum > 140 ? '#111111' : '#ffffff') : cfg.logo.colour
  g.textAlign = 'center'
  g.textBaseline = 'middle'
  let size = 200
  g.font = `900 ${size}px Archivo, Arial Black, sans-serif`
  while (g.measureText(cfg.logo.text).width > 940 && size > 40) {
    size -= 6
    g.font = `900 ${size}px Archivo, Arial Black, sans-serif`
  }
  g.fillStyle = cfg.logo.shadow
  g.fillText(cfg.logo.text, 522, 226)
  g.fillStyle = fg
  g.fillText(cfg.logo.text, 512, 220)
  g.font = '800 54px Archivo, Arial, sans-serif'
  g.fillText(cfg.logo.sub, 512, 390)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 4
  return t
}

function build() {
  R = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    preserveDrawingBuffer: true,
    powerPreference: 'high-performance'
  })
  R.toneMapping = THREE.ACESFilmicToneMapping
  R.toneMappingExposure = cfg.exposure
  R.outputColorSpace = THREE.SRGBColorSpace

  scene = new THREE.Scene()
  cam = new THREE.PerspectiveCamera(32, 1, .1, 150)

  // Soft studio environment for realistic fabric reflections
  const pmrem = new THREE.PMREMGenerator(R)
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
  pmrem.dispose()

  const L = cfg.lights
  // Ambient — soft overall fill so dark fabric never goes pure black
  scene.add(new THREE.AmbientLight(0xffffff, L.ambient))

  // Key light — main directional from front-top-right
  const key = new THREE.DirectionalLight(0xffffff, L.key)
  key.position.set(5, 7, 8)
  scene.add(key)

  // Fill light — softer from opposite side
  const fill = new THREE.DirectionalLight(0xffffff, L.fill)
  fill.position.set(-6, 3, 4)
  scene.add(fill)

  // Rim light — coloured accent from behind-left for separation
  const rim = new THREE.DirectionalLight(L.rimColour, L.rim)
  rim.position.set(-5, 4, -8)
  scene.add(rim)

  // Subtle top light for shoulder definition
  const top = new THREE.DirectionalLight(0xffffff, 0.45)
  top.position.set(0, 10, 2)
  scene.add(top)

  wire = new THREE.MeshBasicMaterial({
    color: site.accent,
    wireframe: true,
    toneMapped: false
  })

  holder = new THREE.Group()
  scene.add(holder)

  new GLTFLoader().load(
    props.product.model || cfg.model,
    onModel,
    e => { if (e.total) pct.value = Math.round(e.loaded / e.total * 100) },
    err => {
      console.error('PRAMANDI GLB error:', err)
      failed.value = true
      ready.value = true
    }
  )
}

function onModel(gltf) {
  model = gltf.scene
  model.rotation.y = cfg.modelTurnY

  const box = new THREE.Box3().setFromObject(model)
  const size = box.getSize(new THREE.Vector3())
  model.position.sub(box.getCenter(new THREE.Vector3()))

  const inner = new THREE.Group()
  const s = 9 / Math.max(size.x, size.y, size.z)
  inner.add(model)
  inner.scale.setScalar(s)
  holder.add(inner)

  model.traverse(o => {
    if (!o.isMesh) return
    o.userData.orig = o.material
    ;[].concat(o.material).forEach(m => {
      m.envMapIntensity = cfg.envIntensity
      if (cfg.plainShirt) {
        m.map = null
        m.needsUpdate = true
      }
      // Slightly softer roughness for more natural fabric look
      if (m.roughness !== undefined) m.roughness = Math.min(m.roughness + 0.08, 1)
    })
  })

  // Separate wireframe copy used for the x-ray lens (no material swapping)
  let skinned = false
  model.traverse(o => { if (o.isSkinnedMesh) skinned = true })
  if (!skinned) {
    xrayRoot = model.clone(true)
    xrayRoot.traverse(o => { if (o.isMesh) o.material = wire })
    xrayRoot.visible = false
    inner.add(xrayRoot)
  }

  if (cfg.logo.enabled) {
    logoMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(cfg.logo.width, cfg.logo.width / 2),
      new THREE.MeshBasicMaterial({transparent: true, toneMapped: false, depthWrite: false})
    )
    logoMesh.position.set(0, cfg.logo.y, size.z * s / 2 + cfg.logo.z)
    holder.add(logoMesh)
  }

  ready.value = true
}

function setColour(hex) {
  if (hex === lastHex || !model) return
  lastHex = hex
  if (cfg.plainShirt) {
    model.traverse(o => {
      if (o.isMesh) {
        ;[].concat(o.userData.orig).forEach(m => m.color.set(hex))
      }
    })
  }
  if (logoMesh) {
    logoMesh.material.map = logoTex(hex)
    logoMesh.material.needsUpdate = true
  }
}

function render3d(g, W, H, xray, S) {
  if (!R) build()
  if (R.domElement.width !== W || R.domElement.height !== H) {
    R.setSize(W, H, false)
    cam.aspect = W / H
    cam.updateProjectionMatrix()
  }
  if (!model) return

  const half = Math.tan(THREE.MathUtils.degToRad(16))
  const z = Math.max(22, 10 / (2 * half * cam.aspect)) // always fits the shirt's width
  cam.position.set(0, 0.15, z) // slight upward bias for better framing
  cam.lookAt(0, 0, 0)

  const vw = 2 * z * half * cam.aspect
  holder.position.set(S.x * vw * (mobile ? .3 : 1), S.y * vw, 0)
  holder.scale.setScalar(S.scale * (mobile ? .9 : 1))

  // Continuous auto-rotation + stage offset + subtle pointer tilt
  const continuous = clock * (cfg.autoRotateSpeed || 0)
  const stageRy = S.ry * Math.PI * 2
  const pointerTiltX = (pt.y - .5) * .22
  const pointerTiltY = (pt.x - .5) * .45

  holder.rotation.set(
    pointerTiltX,
    continuous + stageRy + pointerTiltY,
    0
  )

  setColour(props.product.colours[props.colour].hex)

  if (xrayRoot) {
    xrayRoot.visible = xray
    model.visible = !xray
  } else {
    model.traverse(o => {
      if (o.isMesh) o.material = xray ? wire : o.userData.orig
    })
  }
  if (logoMesh) logoMesh.visible = !xray

  R.render(scene, cam)
  g.globalAlpha = S.alpha
  g.drawImage(R.domElement, 0, 0, W, H)
  g.globalAlpha = 1
}

/* ---------- drawing ---------- */
function fit() {
  const c = cv.value
  if (!c) return
  const r = c.parentElement.getBoundingClientRect()
  const d = Math.min(devicePixelRatio, 2)
  c.width = r.width * d
  c.height = r.height * d
}

function contain(g, im, W, H, ox = 0, a = 1) {
  const s = Math.min(W * .9 / im.width, H * .78 / im.height)
  g.globalAlpha = a
  g.drawImage(im, (W - im.width * s) / 2 + ox * W, (H - im.height * s) / 2, im.width * s, im.height * s)
  g.globalAlpha = 1
}

function draw() {
  const c = cv.value
  if (!c) return
  const g = c.getContext('2d')
  const W = c.width
  const H = c.height
  const S = stageState(cur)

  g.clearRect(0, 0, W, H)

  if (real) {
    contain(g, frames[Math.round(Math.min(cur / .7, 1) * (frames.length - 1))], W, H, S.x * (mobile ? .3 : 1), S.alpha)
  } else {
    render3d(g, W, H, false, S)
  }

  // X-ray circle follows the pointer near the end of the scroll
  const k = Math.min(Math.max((cur - .74) / .08, 0), 1)
  if (k > 0) {
    const r = (mobile ? 90 : 150) * (W / c.clientWidth) * k
    g.save()
    g.beginPath()
    g.arc(pt.x * W, pt.y * H, r, 0, Math.PI * 2)
    g.clip()
    g.fillStyle = '#050505'
    g.fillRect(0, 0, W, H)
    if (xr.length) {
      contain(g, xr[0], W, H)
    } else if (!real) {
      render3d(g, W, H, true, {...S, alpha: 1})
    }
    g.restore()
    g.strokeStyle = site.accent
    g.lineWidth = 2.5
    g.beginPath()
    g.arc(pt.x * W, pt.y * H, r, 0, Math.PI * 2)
    g.stroke()
  }
}

function loop(t) {
  // Delta-time based continuous rotation so speed is frame-rate independent
  if (!loop.last) loop.last = t
  const dt = Math.min((t - loop.last) / 1000, 0.05)
  loop.last = t
  clock += dt

  cur += (tgt - cur) * .12
  draw()
  raf = requestAnimationFrame(loop)
}

function move(e) {
  const r = cv.value.getBoundingClientRect()
  pt.x = (e.clientX - r.left) / r.width
  pt.y = (e.clientY - r.top) / r.height
}

onMounted(() => {
  if (reduce) return
  init()
  fit()
  addEventListener('resize', fit)
  raf = requestAnimationFrame(loop)
  st = ScrollTrigger.create({
    trigger: wrap.value,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: s => {
      tgt = s.progress
      prog.value = s.progress
    }
  })
})

watch(() => props.colour, () => {
  if (!reduce) init()
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  st && st.kill()
  removeEventListener('resize', fit)
  if (scene) {
    scene.traverse(o => {
      if (o.isMesh) {
        o.geometry.dispose()
        ;[].concat(o.material).forEach(m => m.dispose())
      }
    })
  }
  if (R) {
    R.dispose()
    R.forceContextLoss()
  }
})
</script>

<template>
  <!-- Reduced motion fallback -->
  <section v-if="reduce" class="mx-auto max-w-3xl px-5 pb-10 pt-28">
    <div class="grid grid-cols-2 gap-3">
      <img v-for="n in product.gallery" :key="n" :src="img(product.slug, n)" :alt="product.name">
      <svg v-if="!product.gallery.length" viewBox="0 0 100 100" class="col-span-2 mx-auto w-3/4 text-accent" stroke="currentColor" stroke-width="1.5" role="img" :aria-label="product.name">
        <path d="M30 10L8 30l12 18 10-8v50h40V40l10 8 12-18L70 10Q50 24 30 10Z" :fill="product.colours[colour].hex"/>
      </svg>
    </div>
    <ul class="mt-6 space-y-3">
      <li v-for="h in [...product.hotspots, ...notes]" :key="h.title">
        <b class="text-accent">{{ h.title }}.</b> {{ h.text }}
      </li>
    </ul>
  </section>

  <!-- Main interactive viewer -->
  <section v-else ref="wrap" style="height:420vh" class="relative">
    <div
      class="sticky top-0 h-screen overflow-hidden"
      style="touch-action:pan-y"
      @pointermove="move"
      @pointerdown="move"
    >
      <!-- Large background brand word — perfectly centered -->
      <p
        v-if="cfg.bgWord.show"
        class="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap text-center font-display font-black leading-none"
        :style="{
          fontSize: 'clamp(4rem, 15vw, 18rem)',
          WebkitTextStroke: '1.5px var(--accent)',
          color: 'transparent',
          opacity: cfg.bgWord.opacity
        }"
        aria-hidden="true"
      >{{ site.name }}</p>

      <canvas
        ref="cv"
        class="absolute inset-0 h-full w-full"
        role="img"
        aria-label="Rotating 3D view of the product"
      ></canvas>

      <!-- Intro copy — clean left/right placement, fades early -->
      <div
        class="pointer-events-none absolute inset-x-5 bottom-36 transition-all duration-500 sm:bottom-auto sm:left-auto sm:right-[6%] sm:top-1/2 sm:w-[32%] sm:-translate-y-1/2"
        :class="prog < .09 && ready ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'"
      >
        <p class="text-[11px] font-bold tracking-[0.35em] text-accent">NEW DROP ✱ 2026</p>
        <h1 class="mt-3 font-display text-4xl font-black leading-[0.95] tracking-tight sm:text-5xl lg:text-6xl">
          {{ product.name }}
        </h1>
        <p class="mt-3 max-w-sm text-sm leading-relaxed text-ink/65 sm:text-base">
          {{ product.description }}
        </p>
        <p class="mt-5 text-2xl font-extrabold tracking-tight">{{ money(product.price) }}</p>
        <p class="mt-8 flex items-center gap-2 text-[11px] font-bold tracking-[0.3em] text-ink/50">
          <span class="inline-block h-px w-6 bg-accent"></span>
          SCROLL TO EXPLORE
        </p>
      </div>

      <!-- Desktop hotspots -->
      <div
        v-for="h in product.hotspots"
        :key="h.title"
        class="pointer-events-none absolute hidden max-w-[11rem] transition-all duration-400 md:block"
        :class="vis(h) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'"
        :style="{left: h.x + '%', top: h.y + '%'}"
      >
        <span class="mb-1.5 block h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_0_3px_rgba(57,242,122,0.25)]"></span>
        <div class="border border-ink/10 bg-ink/95 px-3 py-2.5 backdrop-blur-sm">
          <b class="block text-[11px] font-extrabold tracking-wide text-paper">{{ h.title }}</b>
          <p class="mt-0.5 text-[11px] leading-snug text-paper/70">{{ h.text }}</p>
        </div>
      </div>

      <!-- Side rail with sequential notes -->
      <div
        v-if="notes.length"
        class="pointer-events-none absolute bottom-28 left-5 right-5 transition-opacity duration-500 sm:bottom-auto sm:left-auto sm:right-7 sm:top-28 sm:flex sm:items-start sm:gap-4"
        :class="prog < .08 ? 'opacity-0' : 'opacity-100'"
      >
        <!-- Vertical progress line (desktop) -->
        <div class="relative hidden h-40 w-px bg-ink/15 sm:block">
          <div
            class="absolute inset-x-0 top-0 w-px bg-accent transition-[height] duration-300"
            :style="{height: Math.min(prog * 100, 100) + '%'}"
          ></div>
        </div>

        <Transition name="note" mode="out-in">
          <div :key="ai" class="sm:w-48">
            <p class="font-display text-3xl font-black tracking-tight text-accent sm:text-4xl">
              {{ pad(ai + 1) }}<span class="text-sm font-bold text-ink/35">/{{ pad(notes.length) }}</span>
            </p>
            <h4 class="mt-1.5 text-sm font-extrabold uppercase tracking-wide">{{ notes[ai].title }}</h4>
            <p class="mt-1 text-xs leading-relaxed text-ink/60">{{ notes[ai].text }}</p>
          </div>
        </Transition>
      </div>

      <!-- X-ray prompt -->
      <div
        class="pointer-events-none absolute bottom-24 left-5 right-5 text-center transition-all duration-500 sm:left-8 sm:right-auto sm:text-left"
        :class="prog > .76 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'"
      >
        <p class="text-[11px] font-bold tracking-[0.3em] text-accent">
          X-RAY · MOVE CURSOR OVER THE SHIRT
        </p>
        <ul class="mt-3 hidden gap-4 text-xs sm:flex">
          <li
            v-for="x in product.xrayNotes"
            :key="x.title"
            class="max-w-[10rem] border-l-2 border-accent/80 pl-2.5"
          >
            <b class="block text-[11px] font-extrabold">{{ x.title }}</b>
            <span class="text-ink/60">{{ x.text }}</span>
          </li>
        </ul>
      </div>

      <!-- Loading state -->
      <div
        v-if="!ready"
        class="absolute inset-0 grid place-items-center bg-paper"
      >
        <div class="text-center">
          <p class="font-display text-2xl font-black tracking-tight text-accent">LOADING</p>
          <p class="mt-1 text-sm font-bold text-ink/40">{{ pct }}%</p>
          <div class="mx-auto mt-4 h-0.5 w-24 overflow-hidden bg-ink/10">
            <div class="h-full bg-accent transition-all duration-300" :style="{width: pct + '%'}"></div>
          </div>
        </div>
      </div>

      <!-- Error state -->
      <p
        v-if="failed"
        class="absolute bottom-10 left-0 right-0 text-center text-xs font-bold text-red-400"
      >
        Could not load the 3D model. Check the path in src/data/viewer.js
      </p>
    </div>
  </section>
</template>
