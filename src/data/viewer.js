// VIEWER SETTINGS: edit this file to change the 3D shirt, lighting, logo and scroll movement.
export default {
  model: '/models/pramandi-black-tee.glb',  // default model (a product can override with `model: '...'`)
  modelTurnY: 0,          // if the shirt's front faces away, set this to Math.PI

  // The GLB's own print is hidden when plainShirt is true, so you can use the clean logo below.
  // Set plainShirt to false to keep the model's original textures and colours.
  plainShirt: true,

  // LIGHTING: balanced for dark fabric + green accent. Raise exposure if still dark.
  exposure: 1.15,
  envIntensity: 1.35,      // soft all-round reflections (big effect on dark fabric)
  lights: {
    ambient: 0.85,
    key: 2.4,          // main light (front-top-right)
    fill: 1.1,         // soft opposite fill
    rim: 1.8,          // back rim (was 300 — that blew out the model)
    rimColour: '#39F27A'
  },

  // Continuous slow auto-rotation (radians per second). Set to 0 to disable.
  autoRotateSpeed: 0.45,

  // LOGO printed on the chest. Use text, or put an image in /public and set image: '/logo.png'
  logo: {
    enabled: true,
    image: '',
    text: 'PRAMANDI',
    sub: '✱ DROP 01 ✱',
    colour: 'auto',
    shadow: '#39F27A',
    width: 4.2,      // size on the shirt
    y: 1.4,          // height on the chest (up is bigger)
    z: 0.05          // distance from the fabric
  },

  bgWord: {show: true, opacity: 0.12},   // big outlined brand word behind the shirt
  hotspotWindow: 0.07,                   // how long each label stays visible while scrolling
  fade: 0.22,                            // how much of each stage is spent fading in/out

  // SCROLL STAGES: the shirt fades out and reappears in the next position.
  // from/to = scroll range (0 to 1), x/y = position (-0.5 left to 0.5 right), scale,
  // ry = [start, end] additional turns of rotation during the stage (on top of continuous spin).
  stages: [
    {from: 0,    to: 0.17, x: -0.22, y: 0, scale: 1.02, ry: [0, 0.05]},
    {from: 0.17, to: 0.47, x: 0.14,  y: 0, scale: 0.94, ry: [0.05, 0.25]},
    {from: 0.47, to: 0.72, x: -0.18, y: 0, scale: 1.06, ry: [0.25, 0.55]},
    {from: 0.72, to: 1,    x: 0,     y: 0, scale: 1,    ry: [0.55, 0.7]}
  ]
}
