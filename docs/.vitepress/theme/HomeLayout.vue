<script setup>
import { useData } from 'vitepress'
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { splitHover } from '../../../src/split-hover.js'

const { lang } = useData()
const isZh = computed(() => lang.value === 'zh-CN')
const link  = (path) => isZh.value ? `/zh/${path}` : `/${path}`

const en = {
  nav: { launch: 'Launch App ↗', docs: 'Documentation' },
  hero: {
    title: 'WebGL\nGradient Engine',
    sub: 'OKLab color science. 13 fluid algorithms. Halftone, ASCII matrix, and three export formats. Free, runs entirely in your browser.',
    cta1: 'Launch App ↗', cta2: 'Quick Start',
    pills: ['13 algorithms', '3 export formats', 'free · no login'],
  },
  caps: {
    heading: 'Six Capabilities',
    items: [
      { name: 'Palette & OKLab',   tags: ['8 colors','oklab','rgb','image extract'],          desc: 'Up to 8 colors blended in OKLab perceptual space. Drag to reorder. Extract a palette from any photo.' },
      { name: 'Shape & Flow',      tags: ['13 algorithms','glsl','60fps'],                     desc: '13 GPU-shaded fluid algorithms — from sine waves to curl noise vortices and signed-distance field shapes.' },
      { name: 'Post-Processing',   tags: ['film grain','border','corner radius','3d tilt'],    desc: 'Non-destructive compositing passes layered over the gradient. Film grain, inner border, corner radius, 3D parallax tilt.' },
      { name: 'Halftone',          tags: ['4 matrices','6 shapes','gpu'],                      desc: 'Dithered halftone rendered as a GPU compositing pass. 4 Bayer matrices × 6 dot shapes with contrast control.' },
      { name: 'ASCII Matrix',      tags: ['7 charsets','mouse','heatmap'],                     desc: 'Full-canvas character grid that reacts to mouse proximity in real time. 7 character sets plus custom text input.' },
      { name: 'Export',            tags: ['png','mp4','html','2×+'],                           desc: 'PNG at 2× minimum resolution, MP4/WebM with ping-pong loop, or a self-contained HTML file with zero dependencies.' },
    ],
  },
  algos: {
    heading: '13 Algorithms',
    sub: 'Every algorithm runs as a GLSL fragment shader on the GPU.',
    categories: [
      { name: 'classic',   items: [{ name:'Sin/Cos', desc:'Smooth periodic waves' },{ name:'Structured Mapping', desc:'Ordered geometric gradients' },{ name:'Linear Stratified', desc:'Architectural layered bands' }] },
      { name: 'organic',   items: [{ name:'Fluid Dynamics', desc:'Turbulent noise-based motion' },{ name:'Domain Warp', desc:'Marble-like UV distortion' },{ name:'Curl Noise', desc:'Divergence-free vortex flows' },{ name:'Polar Vortex', desc:'Cosmic spiral structures' }] },
      { name: 'topology',  items: [{ name:'Radial Topography', desc:'Concentric contour rings' },{ name:'Conic Sweep', desc:'Angular polar color sectors' },{ name:'Nested SDF Shape', desc:'Geometric glow from SDF math' }] },
      { name: 'diffusion', items: [{ name:'Diffusion Gradient', desc:'Soft procedural color spread' },{ name:'Diffusion Fluid', desc:'Image-warped blend field' },{ name:'Procedural SDF', desc:'Multi-point distance fields' }] },
    ],
  },
  exports: {
    heading: 'Export Anywhere',
    items: [
      { format:'PNG',  tag:'static asset',   desc:'Full-resolution screenshot at 2× minimum device pixel ratio. Includes all active layers: gradient, halftone, ASCII matrix, and grain.' },
      { format:'MP4',  tag:'video loop',     desc:'Live-recorded animation with optional ping-pong loop for seamless playback. WebM fallback on unsupported browsers.' },
      { format:'HTML', tag:'embed anywhere', desc:'Self-contained file with the full WebGL shader and all parameters embedded. Drop into an iframe with zero dependencies.' },
    ],
  },
  usecases: {
    heading: 'Built for Makers',
    items: [
      { role:'ui/ux designer',      desc:'Generate animated gradient backgrounds for landing pages and hero sections. Export PNG for static mockups or MP4 for presentations.' },
      { role:'frontend developer',  desc:'Export standalone HTML and embed via iframe. Full-bleed animated backgrounds in any web project, one file, no build step.' },
      { role:'brand designer',      desc:'Upload a brand reference photo to extract dominant colors. Blend into a fluid gradient and export MP4 for social media.' },
      { role:'content creator',     desc:'Record short MP4 loops with ping-pong playback for seamless social media content. No watermark, no restrictions.' },
    ],
  },
  cta: { line:'Free. No account. No install.', btn1:'Launch App ↗', btn2:'Quick Start' },
  footer: { copy:`© ${new Date().getFullYear()} GradLab`, launch:'Launch App ↗', docs:'Documentation', github:'GitHub' },
}

const zh = {
  nav: { launch: '打开应用 ↗', docs: '文档' },
  hero: {
    title: 'WebGL\n渐变引擎',
    sub: 'OKLab 色彩科学。13 种流体算法。半调、ASCII 矩阵，三种导出格式。免费，完全在浏览器中运行。',
    cta1: '打开应用 ↗', cta2: '快速上手',
    pills: ['13 种算法', '3 种导出格式', '免费 · 无需登录'],
  },
  caps: {
    heading: '六大能力',
    items: [
      { name:'调色板 & OKLab',  tags:['最多 8 色','oklab','rgb','图像提取'],       desc:'最多 8 种颜色在 OKLab 感知色彩空间中混合。拖拽排序，或从任意图片提取主色调。' },
      { name:'形态与流动',       tags:['13 种算法','glsl','60fps'],                 desc:'13 种 GPU 着色器流体算法——从正弦波到卷曲噪声漩涡，再到有向距离场几何形态。' },
      { name:'后期处理',         tags:['胶片颗粒','内边框','圆角','3D 视差'],       desc:'非破坏性合成层叠加于渐变之上。胶片颗粒、内边框、圆角、3D 鼠标视差倾斜。' },
      { name:'半调效果',         tags:['4 种矩阵','6 种点形','gpu'],                desc:'半调图案作为 GPU 合成通道渲染。4 种 Bayer 矩阵 × 6 种点形，支持对比度控制。' },
      { name:'ASCII 字符矩阵',   tags:['7 种字符集','鼠标交互','热力衰减'],         desc:'全画布字符网格实时响应鼠标位置。7 种字符集，支持自定义文本输入。' },
      { name:'导出',             tags:['png','mp4','html','2× 分辨率'],             desc:'最低 2× 分辨率 PNG、含乒乓循环的 MP4/WebM，或零依赖独立 HTML 文件。' },
    ],
  },
  algos: {
    heading: '13 种算法',
    sub: '每种算法均作为 GLSL 片段着色器在 GPU 上运行。',
    categories: [
      { name:'经典周期', items:[{ name:'正弦/余弦',desc:'平滑周期波形'},{name:'结构映射',desc:'有序几何渐变'},{name:'线性分层',desc:'建筑感水平分层'}] },
      { name:'有机混沌', items:[{name:'流体动力学',desc:'湍流噪声运动'},{name:'域扭曲',desc:'大理石 UV 畸变'},{name:'卷曲噪声',desc:'无散度漩涡流'},{name:'极坐标漩涡',desc:'宇宙螺旋结构'}] },
      { name:'拓扑几何', items:[{name:'径向等高线',desc:'同心环等高线'},{name:'锥形扫描',desc:'角度极坐标扇区'},{name:'嵌套 SDF 形态',desc:'SDF 数学几何光晕'}] },
      { name:'扩散',     items:[{name:'扩散渐变',desc:'柔和程序性色彩扩散'},{name:'扩散流体',desc:'图像扭曲混合场'},{name:'程序 SDF',desc:'多点距离场'}] },
    ],
  },
  exports: {
    heading: '多格式导出',
    items: [
      { format:'PNG',  tag:'静态资产',    desc:'全分辨率截图，最低 2× 设备像素比。包含所有激活图层：渐变、半调、ASCII 矩阵和颗粒效果。' },
      { format:'MP4',  tag:'视频循环',    desc:'实时录制动画，支持乒乓循环无缝播放。不支持的浏览器自动降级为 WebM 格式。' },
      { format:'HTML', tag:'嵌入任意页面', desc:'包含完整 WebGL 着色器和所有参数的独立文件。直接放入 iframe，零依赖，零构建步骤。' },
    ],
  },
  usecases: {
    heading: '为创作者而生',
    items: [
      { role:'ui/ux 设计师',  desc:'为落地页和 Hero 区域生成动态渐变背景。导出 PNG 用于静态设计稿，或导出 MP4 用于提案演示。' },
      { role:'前端开发者',     desc:'导出独立 HTML 通过 iframe 嵌入。一个文件，无构建步骤，在任何 Web 项目中实现全屏动态背景。' },
      { role:'品牌设计师',     desc:'上传品牌参考图片提取主色调，混合生成流体渐变，导出 MP4 用于社交媒体内容。' },
      { role:'内容创作者',     desc:'录制短视频循环，启用乒乓播放实现无缝社交媒体内容。无水印，无使用限制。' },
    ],
  },
  cta: { line:'免费。无需账户。无需安装。', btn1:'打开应用 ↗', btn2:'快速上手' },
  footer: { copy:`© ${new Date().getFullYear()} GradLab`, launch:'打开应用 ↗', docs:'文档', github:'GitHub' },
}

const t = computed(() => isZh.value ? zh : en)
const heroLines = computed(() => t.value.hero.title.split('\n'))
const navScrolled = ref(false)
const heroCanvas  = ref(null)
const heroNoise   = ref(null)

/* ── Liquid glass: SVG feDisplacementMap on real backdrop ── */
/* Technique from shuding/liquid-glass — CPU computes a pill-SDF  */
/* displacement field encoded into an RG canvas; SVG filter reads  */
/* it via feImage → feDisplacementMap and applies it as             */
/* backdrop-filter: url(#id), warping the ACTUAL page content       */
/* behind the capsule (the live shader iframe) through a glass lens.*/
function setupGlassFilter(navEl) {
  const id = 'gl-nav-glass-fx'

  /* Hermite smooth-step (a→0, b→1) */
  function sStep(a, b, t) {
    t = Math.max(0, Math.min(1, (t - a) / (b - a)))
    return t * t * (3 - 2 * t)
  }

  /* Build SVG filter injected once into <body> */
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  Object.assign(svg.style, { position: 'fixed', top: '0', left: '0', width: '0', height: '0', pointerEvents: 'none', overflow: 'visible' })
  svg.setAttribute('aria-hidden', 'true')

  const defs   = document.createElementNS('http://www.w3.org/2000/svg', 'defs')
  const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter')
  filter.setAttribute('id', id)
  /* objectBoundingBox anchors the filter region to the element's visual bounding
     box automatically, bypassing coordinate-system conflicts caused by the nav's
     transform: translateX(-50%) and Chrome's userSpaceOnUse viewport-vs-local
     ambiguity in backdrop-filter contexts. */
  filter.setAttribute('filterUnits', 'objectBoundingBox')
  filter.setAttribute('colorInterpolationFilters', 'sRGB')

  /* Single displacement map image — shared across all three channel passes */
  const feImg = document.createElementNS('http://www.w3.org/2000/svg', 'feImage')
  feImg.setAttribute('result', 'dispMap')
  feImg.setAttribute('preserveAspectRatio', 'none')

  /* ── Chromatic aberration: R/G/B displaced at different scales ──────── */
  /* Real glass bends short wavelengths (blue) more than long (red).       */
  /* R = least displaced, B = most displaced → color fringing at edges.    */
  function makeDisp(scaleAttr, resultName) {
    const d = document.createElementNS('http://www.w3.org/2000/svg', 'feDisplacementMap')
    d.setAttribute('in', 'SourceGraphic')
    d.setAttribute('in2', 'dispMap')
    d.setAttribute('xChannelSelector', 'R')
    d.setAttribute('yChannelSelector', 'G')
    d.setAttribute('scale', scaleAttr)
    d.setAttribute('result', resultName)
    return d
  }
  function makeIsolate(inName, r, g, b, resultName) {
    const m = document.createElementNS('http://www.w3.org/2000/svg', 'feColorMatrix')
    m.setAttribute('in', inName)
    m.setAttribute('type', 'matrix')
    m.setAttribute('values', `${r} 0 0 0 0  0 ${g} 0 0 0  0 0 ${b} 0 0  0 0 0 1 0`)
    m.setAttribute('result', resultName)
    return m
  }
  function makeAdd(in1, in2, resultName) {
    const c = document.createElementNS('http://www.w3.org/2000/svg', 'feComposite')
    c.setAttribute('in', in1)
    c.setAttribute('in2', in2)
    c.setAttribute('operator', 'arithmetic')
    c.setAttribute('k2', '1')
    c.setAttribute('k3', '1')
    if (resultName) c.setAttribute('result', resultName)
    return c
  }

  const dispR = makeDisp('0', 'dispR')
  const dispG = makeDisp('0', 'dispG')
  const dispB = makeDisp('0', 'dispB')

  const onlyR = makeIsolate('dispR', 1, 0, 0, 'onlyR')
  const onlyG = makeIsolate('dispG', 0, 1, 0, 'onlyG')
  const onlyB = makeIsolate('dispB', 0, 0, 1, 'onlyB')

  const mergeRG = makeAdd('onlyR', 'onlyG', 'mergeRG')
  const mergeRGB = makeAdd('mergeRG', 'onlyB', null)

  ;[feImg, dispR, onlyR, dispG, onlyG, dispB, onlyB, mergeRG, mergeRGB].forEach(n => filter.appendChild(n))
  defs.appendChild(filter)
  svg.appendChild(defs)
  document.body.insertBefore(svg, document.body.firstChild)

  let lastW = 0, lastH = 0

  function computeMap() {
    const W = Math.round(navEl.offsetWidth)
    const H = Math.round(navEl.offsetHeight)
    if (W < 4 || H < 4 || (W === lastW && H === lastH)) return
    lastW = W; lastH = H

    const halfW = W / 2, halfH = H / 2

    /* filterUnits="objectBoundingBox": x/y/width/height are fractions of the
       element's bounding box — (0,0,1,1) always covers the element exactly.
       primitiveUnits stays "userSpaceOnUse" (default) so feImage and
       SourceGraphic share the same element-local CSS-pixel coordinate system. */
    filter.setAttribute('x', '0'); filter.setAttribute('y', '0')
    filter.setAttribute('width', '1'); filter.setAttribute('height', '1')
    feImg.setAttribute('x', '0'); feImg.setAttribute('y', '0')
    feImg.setAttribute('width', String(W)); feImg.setAttribute('height', String(H))

    const canvas = document.createElement('canvas')
    canvas.width = W; canvas.height = H
    const ctx  = canvas.getContext('2d')
    const data = new Uint8ClampedArray(W * H * 4)
    // Neutral displacement = R:128 G:128 (0.5 → 0 displacement).
    // Without this init, zero-filled pixels outside/inside the pill get
    // R=0,G=0 which feDisplacementMap reads as −maxD shift → rectangular ghost.
    for (let i = 0; i < W * H; i++) {
      data[i * 4] = 128; data[i * 4 + 1] = 128
      data[i * 4 + 2] = 128; data[i * 4 + 3] = 255
    }
    const rawDx = new Float32Array(W * H)
    const rawDy = new Float32Array(W * H)

    function pillSDF(cx, cy) {
      const r  = halfH
      const qx = Math.abs(cx) - (halfW - r)
      const qy = Math.abs(cy)
      return Math.sqrt(Math.max(qx, 0) ** 2 + Math.max(qy, 0) ** 2) +
             Math.min(Math.max(qx, qy), 0) - r
    }

    /* ReactBits params: ior=1.15, thickness=5, scale=0.25, CA=0.1, anisotropy=0.01
       dispH = (ior-1) * thickness * scale * halfH * tuning
             = 0.15    * 5         * 0.25  * halfH * 13  ≈ halfH * 2.44 ≈ 68px
       dispV kept small (flat glass sides, no curvature = less vertical refraction). */
    const p = window.__glass ?? {}
    const transRange = halfH * (p.transRange ?? 0.55)
    const dispH      = halfH * (p.dispH      ?? 0.50)
    const dispYScale =          p.dispYScale ?? 0.65
    const dispYSign  =          p.dispYSign  ?? 1
    const caSpread   =          p.caSpread   ?? 0.25

    for (let py = 0; py < H; py++) {
      for (let px = 0; px < W; px++) {
        const cx = px - halfW
        const cy = py - halfH
        const sdf = pillSDF(cx, cy)

        if (sdf < -transRange) continue
        if (sdf >= 0) continue  // outside pill: keep neutral, prevents ghost at rounded corners

        // Bell curve peaking at mid-transition, 0 at interior boundary AND pill edge.
        // Displacement fades to zero before reaching the element boundary so
        // Chrome's backdrop-filter has nothing displaced outside the pill shape.
        // ×4 restores peak to 1.0 (s*(1-s) peaks at 0.25 when s=0.5).
        const edgeProx = 4 * sStep(-transRange, 0, sdf) * sStep(0, -transRange, sdf)
        if (edgeProx < 0.001) continue

        /* SDF gradient = outward surface normal (accurate for pill shape):
           flat top/bottom → (0, ±1);  end caps → radially outward.        */
        const eps = 0.5
        const gx  = pillSDF(cx + eps, cy) - pillSDF(cx - eps, cy)
        const gy  = pillSDF(cx, cy + eps) - pillSDF(cx, cy - eps)
        const gLen = Math.sqrt(gx * gx + gy * gy) + 0.001
        const nx = gx / gLen, ny = gy / gLen

        rawDx[py * W + px] = -nx * edgeProx * dispH
        /* dispYSign: tune in dev panel to find correct Chrome objectBoundingBox Y direction */
        rawDy[py * W + px] = dispYSign * ny * edgeProx * dispH * dispYScale
      }
    }

    /* Encode: R = dx/(2·maxD)+0.5 so SVG scale=2·maxD gives exact dx.   */
    let maxD = 1
    for (let i = 0; i < W * H; i++) {
      maxD = Math.max(maxD, Math.abs(rawDx[i]), Math.abs(rawDy[i]))
    }
    const svgScale = maxD * 2

    for (let i = 0; i < W * H; i++) {
      data[i * 4]     = Math.round(Math.max(0, Math.min(255, (rawDx[i] / svgScale + 0.5) * 255)))
      data[i * 4 + 1] = Math.round(Math.max(0, Math.min(255, (rawDy[i] / svgScale + 0.5) * 255)))
      data[i * 4 + 2] = 128
      data[i * 4 + 3] = 255
    }

    ctx.putImageData(new ImageData(data, W, H), 0, 0)
    /* Modern href — xlink:href is deprecated and ignored in current Chrome */
    feImg.setAttribute('href', canvas.toDataURL())

    /* Chromatic aberration: R=0.88×, G=1.0×, B=1.14× displacement.
       Blue bends most (physically correct); creates color fringing at edges. */
    /* caSpread controls RGB channel separation independently of displacement size */
    dispR.setAttribute('scale', String(svgScale * (1 - caSpread)))
    dispG.setAttribute('scale', String(svgScale * 1.000))
    dispB.setAttribute('scale', String(svgScale * (1 + caSpread)))
  }

  window.__glassRecompute = () => { lastW = 0; lastH = 0; computeMap() }

  setTimeout(computeMap, 60)
  const ro = new ResizeObserver(() => setTimeout(computeMap, 16))
  ro.observe(navEl)

  return () => { svg.remove(); ro.disconnect() }
}

onMounted(() => {
  if (typeof window === 'undefined') return

  const obs = new IntersectionObserver(
    (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('gl-visible'); obs.unobserve(e.target) } }),
    { threshold: 0.08 }
  )
  document.querySelectorAll('.gl-reveal').forEach(el => obs.observe(el))
  let prevScrolled = false
  const onScroll = () => {
    const isScrolled = window.scrollY > 40
    navScrolled.value = isScrolled
    if (isScrolled && !prevScrolled) {
      /* nextTick: wait for Vue to finish patching the class binding
         (adding gl-nav--scrolled) before we add gl-nav--spring,
         otherwise Vue's className overwrite removes the spring class
         before the animation can start. */
      nextTick(() => {
        const navHost = document.querySelector('.gl-nav-host')
        if (!navHost) return
        // Spring on the HOST: backdrop-filter and animation share the same element,
        // so the filter region scales with the pill — no corona ghost.
        navHost.classList.remove('gl-nav-host--spring')
        void navHost.offsetWidth
        navHost.classList.add('gl-nav-host--spring')
        navHost.addEventListener('animationend', () => navHost.classList.remove('gl-nav-host--spring'), { once: true })
      })
    }
    prevScrolled = isScrolled
  }
  window.addEventListener('scroll', onScroll, { passive: true })

  const logoEl = document.querySelector('.gl-nav-logo')
  if (logoEl) splitHover(logoEl, { stagger: 40, duration: 380 })

  // Detect Safari: CSS.supports('-webkit-touch-callout','none') is true only in Safari/WebKit.
  // @supports does NOT work for this — Safari evaluates @supports not(-webkit-touch-callout:none)
  // as true (bug), so we must use JS to inject Chrome-only rules.
  // CSS.supports('-webkit-touch-callout','none') only works on iOS Safari, not macOS Safari.
  // navigator.vendor is reliable: Safari → "Apple Computer, Inc.", Chrome → "Google Inc."
  const isSafari = typeof navigator !== 'undefined' && navigator.vendor.startsWith('Apple')

  const navEl = document.querySelector('.gl-nav-host')
  const glassCleanup = navEl ? setupGlassFilter(navEl) : null

  // Chrome-only: inject SVG displacement filter rule.
  // Cannot use @supports for this — see comment above.
  let chromeStyleEl = null
  if (!isSafari) {
    chromeStyleEl = document.createElement('style')
    chromeStyleEl.textContent = '.gl-nav-host--scrolled{backdrop-filter:url(#gl-nav-glass-fx) blur(2px) brightness(1.08) saturate(1.12)!important}'
    document.head.appendChild(chromeStyleEl)
  }

  // ── Hero WebGL gradient ────────────────────────────────────────────
  // Safari: WebGL canvas is GPU IOSurface-backed → separate compositor layer →
  // backdrop-filter can't sample it. Fix: Canvas 2D bridge — render WebGL to an
  // offscreen canvas (with preserveDrawingBuffer:true so readback works), then
  // blit each frame to the visible Canvas 2D canvas. Canvas 2D goes through the
  // normal rendering pipeline and is visible to backdrop-filter.
  let heroRafId = null
  const canvas = heroCanvas.value
  if (canvas) {
    const glTarget = isSafari ? document.createElement('canvas') : canvas
    const ctx2d    = isSafari ? canvas.getContext('2d') : null
    const gl = glTarget.getContext('webgl', { preserveDrawingBuffer: isSafari }) ||
               glTarget.getContext('experimental-webgl', { preserveDrawingBuffer: isSafari })
    if (gl) {
      // Grain noise overlay
      if (heroNoise.value) {
        const nc = document.createElement('canvas')
        nc.width = 256; nc.height = 256
        const nctx = nc.getContext('2d')
        const img = nctx.createImageData(256, 256)
        for (let i = 0; i < img.data.length; i += 4) {
          const v = Math.random() * 255
          img.data[i] = v; img.data[i+1] = v; img.data[i+2] = v; img.data[i+3] = 255
        }
        nctx.putImageData(img, 0, 0)
        heroNoise.value.style.backgroundImage = 'url(' + nc.toDataURL() + ')'
      }

      const VERT = `attribute vec2 position;void main(){gl_Position=vec4(position,0.0,1.0);}`
      const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
#else
  precision mediump float;
#endif
uniform vec2 u_resolution;uniform float u_ref_height;uniform float u_time;
uniform vec3 u_colors[8];uniform int u_colorCount;
uniform float u_flow_type;uniform float u_zoom;
uniform vec2 u_pan;uniform float u_flow_speed;uniform float u_liquid_str;
uniform float u_morph;uniform float u_rotation;
uniform int u_color_mode;uniform float u_blend_bias;uniform float u_blend_sharp;
mat2 rot(float a){return mat2(cos(a),-sin(a),sin(a),cos(a));}
float sdCircle(vec2 p,float r){return length(p)-r;}
float sdHexagon(vec2 p,float r){const vec3 k=vec3(-0.866025404,0.5,0.577350269);p=abs(p);p-=2.0*min(dot(k.xy,p),0.0)*k.xy;p-=vec2(clamp(p.x,-k.z*r,k.z*r),r);return length(p)*sign(p.y);}
float sdBox(vec2 p,vec2 b){vec2 d=abs(p)-b;return length(max(d,0.0))+min(max(d.x,d.y),0.0);}
float sdEquilateralTriangle(vec2 p,float r){const float k=sqrt(3.0);p.x=abs(p.x)-r;p.y=p.y+r/k;if(p.x+k*p.y>0.0)p=vec2(p.x-k*p.y,-k*p.x-p.y)/2.0;p.x-=clamp(p.x,-2.0*r,0.0);return -length(p)*sign(p.y);}
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec2 mod289(vec2 x){return x-floor(x*(1.0/289.0))*289.0;}
vec3 permute(vec3 x){return mod289(((x*34.0)+1.0)*x);}
float random(vec2 st){return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123);}
float noise(in vec2 st){vec2 i=floor(st);vec2 f=fract(st);float a=random(i);float b=random(i+vec2(1.0,0.0));float c=random(i+vec2(0.0,1.0));float d=random(i+vec2(1.0,1.0));vec2 u=f*f*(3.0-2.0*f);return mix(a,b,u.x)+(c-a)*u.y*(1.0-u.x)+(d-b)*u.x*u.y;}
float snoise(vec2 st){return noise(st)*2.0-1.0;}
float fbm(vec2 p){float f=0.0;float amp=0.5;mat2 r=mat2(cos(0.65),sin(0.65),-sin(0.65),cos(0.65));for(int i=0;i<4;i++){f+=amp*noise(p);p=r*p*2.01;amp*=0.5;}return f;}
float sfbm(vec2 p){return fbm(p)*2.0-1.0;}
vec3 srgbToLinear(vec3 c){return mix(c/12.92,pow((c+0.055)/1.055,vec3(2.4)),step(0.04045,c));}
vec3 linearToSrgb(vec3 c){c=clamp(c,0.0,1.0);return mix(c*12.92,1.055*pow(c,vec3(1.0/2.4))-0.055,step(0.0031308,c));}
vec3 linearToOklab(vec3 c){float l=0.4122214708*c.r+0.5363325363*c.g+0.0514459929*c.b;float m=0.2119034982*c.r+0.6806995451*c.g+0.1073969566*c.b;float s=0.0883024619*c.r+0.2817188376*c.g+0.6299787005*c.b;float l_=pow(max(l,0.0),1.0/3.0);float m_=pow(max(m,0.0),1.0/3.0);float s_=pow(max(s,0.0),1.0/3.0);return vec3(0.2104542553*l_+0.7936177850*m_-0.0040720468*s_,1.9779984951*l_-2.4285922050*m_+0.4505937099*s_,0.0259040371*l_+0.7827717662*m_-0.8086757660*s_);}
vec3 oklabToLinear(vec3 c){float l_=c.x+0.3963377774*c.y+0.2158037573*c.z;float m_=c.x-0.1055613458*c.y-0.0638541728*c.z;float s_=c.x-0.0894841775*c.y-1.2914855480*c.z;float l=l_*l_*l_;float m=m_*m_*m_;float s=s_*s_*s_;return vec3(4.0767416621*l-3.3077115913*m+0.2309699292*s,-1.2684380046*l+2.6097574011*m-0.3413193965*s,-0.0041960863*l-0.7034186147*m+1.7076147010*s);}
vec3 oklabToOklch(vec3 lab){return vec3(lab.x,length(lab.yz),atan(lab.z,lab.y));}
vec3 oklchToOklab(vec3 lch){return vec3(lch.x,lch.y*cos(lch.z),lch.y*sin(lch.z));}
float applyBlend(float t){float gamma;if(u_blend_bias<0.5){gamma=1.0+(1.0-u_blend_bias*2.0)*3.0;}else{gamma=1.0-(u_blend_bias-0.5)*2.0*0.75;}gamma=max(gamma,0.1);float biased=pow(clamp(t,0.001,0.999),gamma);float halfRange=0.5-u_blend_sharp*0.48;return smoothstep(0.5-halfRange,0.5+halfRange,biased);}
vec3 mixOklab(vec3 a,vec3 b,float t){float bt=applyBlend(t);if(u_color_mode==0){return mix(a,b,bt);}vec3 lchA=oklabToOklch(linearToOklab(srgbToLinear(a)));vec3 lchB=oklabToOklch(linearToOklab(srgbToLinear(b)));float L=mix(lchA.x,lchB.x,bt);float C=mix(lchA.y,lchB.y,bt);float dH=lchB.z-lchA.z;if(dH>3.14159265)dH-=6.28318530;if(dH<-3.14159265)dH+=6.28318530;float H=lchA.z+dH*bt;return linearToSrgb(oklabToLinear(oklchToOklab(vec3(L,C,H))));}
void main(){vec2 fragCoord=gl_FragCoord.xy;vec2 uv=fragCoord/u_resolution.xy;vec2 S=uv-0.5;S.x*=u_resolution.x/u_resolution.y;S*=u_resolution.y/u_ref_height;vec2 p=S/u_zoom+u_pan;p+=0.5;float t=u_time*u_flow_speed;vec3 finalColor=u_colors[0];vec2 flowP=p;float amt=u_liquid_str*0.15;for(int i=0;i<3;i++){float ang=snoise(flowP*2.0+t*0.2)*3.14159;flowP+=vec2(cos(ang),sin(ang))*amt;amt*=0.7;}vec2 centerP=flowP-0.5;centerP*=rot(u_rotation);float d1=sdCircle(centerP,0.3);float d2=sdHexagon(centerP,0.3);float d3=sdBox(centerP,vec2(0.25));float d4=sdEquilateralTriangle(centerP*vec2(1.0,-1.0)-vec2(0.0,0.1),0.35);float morphVal=u_morph*3.0;float finalD=0.0;if(morphVal<1.0)finalD=mix(d1,d2,morphVal);else if(morphVal<2.0)finalD=mix(d2,d3,morphVal-1.0);else finalD=mix(d3,d4,morphVal-2.0);finalColor=u_colors[0];for(int i=1;i<8;i++){if(i<u_colorCount){float ratio=float(i)/float(u_colorCount-1);float targetR=ratio*1.5;float mask=smoothstep(targetR-0.35,targetR+0.35,finalD);finalColor=mixOklab(finalColor,u_colors[i],mask);}}gl_FragColor=vec4(finalColor,1.0);}
`
      function compileShader(type, src) {
        const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s
      }
      const prog = gl.createProgram()
      gl.attachShader(prog, compileShader(gl.VERTEX_SHADER, VERT))
      gl.attachShader(prog, compileShader(gl.FRAGMENT_SHADER, FRAG))
      gl.linkProgram(prog); gl.useProgram(prog)

      const buf = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, buf)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW)
      const pos = gl.getAttribLocation(prog, 'position')
      gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0); gl.enableVertexAttribArray(pos)

      const L = {
        res: gl.getUniformLocation(prog,'u_resolution'), refH: gl.getUniformLocation(prog,'u_ref_height'),
        time: gl.getUniformLocation(prog,'u_time'), colors: gl.getUniformLocation(prog,'u_colors'),
        count: gl.getUniformLocation(prog,'u_colorCount'), zoom: gl.getUniformLocation(prog,'u_zoom'),
        pan: gl.getUniformLocation(prog,'u_pan'), flow: gl.getUniformLocation(prog,'u_flow_speed'),
        liquid: gl.getUniformLocation(prog,'u_liquid_str'), morph: gl.getUniformLocation(prog,'u_morph'),
        rotation: gl.getUniformLocation(prog,'u_rotation'), colorMode: gl.getUniformLocation(prog,'u_color_mode'),
        blendBias: gl.getUniformLocation(prog,'u_blend_bias'), blendSh: gl.getUniformLocation(prog,'u_blend_sharp'),
      }

      const COLORS_HEX = ['#FB7C47','#E1B8FF','#0883F7']
      const COLOR_DATA = new Float32Array(8*3)
      COLORS_HEX.forEach((hex,i) => {
        COLOR_DATA[i*3]   = parseInt(hex.slice(1,3),16)/255
        COLOR_DATA[i*3+1] = parseInt(hex.slice(3,5),16)/255
        COLOR_DATA[i*3+2] = parseInt(hex.slice(5,7),16)/255
      })

      let refH = 0
      function resizeHero() {
        const dpr = Math.max(2, window.devicePixelRatio || 1)
        canvas.width  = Math.round(canvas.clientWidth  * dpr)
        canvas.height = Math.round(canvas.clientHeight * dpr)
        // Safari bridge: offscreen WebGL canvas must match the visible 2D canvas
        if (ctx2d) { glTarget.width = canvas.width; glTarget.height = canvas.height }
        if (!refH) refH = canvas.height
        gl.viewport(0, 0, glTarget.width, glTarget.height)
      }
      resizeHero()
      window.addEventListener('resize', resizeHero)

      let heroStart = null
      function heroFrame(ts) {
        if (!heroStart) heroStart = ts
        const t = (ts - heroStart) * 0.001
        gl.uniform2f(L.res, glTarget.width, glTarget.height)
        gl.uniform1f(L.refH, refH || glTarget.height)
        gl.uniform1f(L.time, t)
        gl.uniform3fv(L.colors, COLOR_DATA)
        gl.uniform1i(L.count, COLORS_HEX.length)
        gl.uniform1f(L.zoom, 49*0.028+0.2)
        gl.uniform2f(L.pan, -1.2917147663632156, -1.2322853637889368)
        gl.uniform1f(L.flow, 25*0.02)
        gl.uniform1f(L.liquid, 25*0.02)
        gl.uniform1f(L.morph, 69/100.0*3.0)
        gl.uniform1f(L.rotation, 80*(Math.PI/180.0))
        gl.uniform1i(L.colorMode, 1)
        gl.uniform1f(L.blendBias, 0.65)
        gl.uniform1f(L.blendSh, 0.0)
        gl.drawArrays(gl.TRIANGLES, 0, 6)
        // Safari bridge: blit WebGL offscreen → visible Canvas 2D each frame
        if (ctx2d) ctx2d.drawImage(glTarget, 0, 0)
        heroRafId = requestAnimationFrame(heroFrame)
      }
      heroRafId = requestAnimationFrame(heroFrame)

      onUnmounted(() => {
        obs.disconnect()
        window.removeEventListener('scroll', onScroll)
        window.removeEventListener('resize', resizeHero)
        if (glassCleanup) glassCleanup()
        if (heroRafId) cancelAnimationFrame(heroRafId)
        if (chromeStyleEl) chromeStyleEl.remove()
      })
      return
    }
  }

  onUnmounted(() => {
    obs.disconnect()
    window.removeEventListener('scroll', onScroll)
    if (glassCleanup) glassCleanup()
    if (chromeStyleEl) chromeStyleEl.remove()
  })
})
</script>

<template>
  <div class="gl-home">

    <!-- Nav host: fixed position, never animated.
         backdrop-filter lives here directly — applying it to a child inside
         overflow:hidden breaks Safari; on the host itself with border-radius
         Chrome and Safari both clip correctly. -->
    <div class="gl-nav-host" :class="{ 'gl-nav-host--scrolled': navScrolled }">
      <!-- Nav: spring animated, contains bg + content only (no backdrop-filter) -->
      <header class="gl-nav" :class="{ 'gl-nav--scrolled': navScrolled }">
        <div class="gl-nav-layer gl-nav-layer--bg" aria-hidden="true"></div>
        <div class="gl-nav-content">
          <a href="/" class="gl-nav-logo" aria-label="GradLab home">GradLab</a>
          <nav class="gl-nav-links" aria-label="Site navigation">
            <a :href="link('quickstart')" class="gl-nav-link">{{ t.nav.docs }}</a>
            <a href="https://gradlab.app" target="_blank" rel="noopener" class="gl-nav-launch">{{ t.nav.launch }}</a>
          </nav>
        </div>
      </header>
    </div>

    <!-- Hero — full-bleed shader (inline canvas, no iframe — Safari backdrop-filter
         cannot sample through iframe compositor layers, breaking the nav glass effect) -->
    <section class="gl-hero" aria-label="GradLab hero">
      <div class="gl-hero-bg" aria-hidden="true">
        <canvas ref="heroCanvas" class="gl-hero-canvas"></canvas>
        <div ref="heroNoise" class="gl-hero-noise"></div>
        <div class="gl-hero-vignette"></div>
      </div>
      <div class="gl-hero-content">
        <h1 class="gl-hero-title">
          <span v-for="(line, i) in heroLines" :key="i" class="gl-hero-line" :style="{ animationDelay: `${i * 0.1}s` }">{{ line }}</span>
        </h1>
        <p class="gl-hero-sub">{{ t.hero.sub }}</p>
        <div class="gl-hero-actions">
          <a href="https://gradlab.app" target="_blank" rel="noopener" class="gl-btn-primary">{{ t.hero.cta1 }}</a>
          <a :href="link('quickstart')" class="gl-btn-ghost">{{ t.hero.cta2 }}</a>
        </div>
        <div class="gl-hero-pills" aria-label="Key facts">
          <span v-for="pill in t.hero.pills" :key="pill" class="gl-pill">{{ pill }}</span>
        </div>
      </div>
    </section>

    <main>

      <!-- Capabilities -->
      <section class="gl-section gl-reveal">
        <div class="gl-container">
          <h2 class="gl-section-title">{{ t.caps.heading }}</h2>
          <ul class="gl-cap-list" role="list">
            <li v-for="cap in t.caps.items" :key="cap.name" class="gl-cap-row">
              <span class="gl-cap-name">{{ cap.name }}</span>
              <span class="gl-cap-tags">
                <span v-for="tag in cap.tags" :key="tag" class="gl-tag">{{ tag }}</span>
              </span>
              <span class="gl-cap-desc">{{ cap.desc }}</span>
            </li>
          </ul>
        </div>
      </section>

      <!-- Algorithms -->
      <section class="gl-section gl-section-sep gl-reveal">
        <div class="gl-container">
          <div class="gl-algo-header">
            <h2 class="gl-section-title">{{ t.algos.heading }}</h2>
            <p class="gl-algo-sub">{{ t.algos.sub }}</p>
          </div>
          <div class="gl-algo-grid">
            <div v-for="cat in t.algos.categories" :key="cat.name" class="gl-algo-col">
              <p class="gl-algo-cat">{{ cat.name }}</p>
              <ul role="list">
                <li v-for="algo in cat.items" :key="algo.name" class="gl-algo-item">
                  <span class="gl-algo-name">{{ algo.name }}</span>
                  <span class="gl-algo-desc">{{ algo.desc }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- Export -->
      <section class="gl-section gl-section-sep gl-reveal">
        <div class="gl-container">
          <h2 class="gl-section-title">{{ t.exports.heading }}</h2>
          <div class="gl-export-grid">
            <div v-for="item in t.exports.items" :key="item.format" class="gl-export-item">
              <p class="gl-export-format">{{ item.format }}</p>
              <p class="gl-export-tag">{{ item.tag }}</p>
              <p class="gl-export-desc">{{ item.desc }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Use Cases -->
      <section class="gl-section gl-section-sep gl-reveal">
        <div class="gl-container">
          <h2 class="gl-section-title">{{ t.usecases.heading }}</h2>
          <div class="gl-usecase-grid">
            <div v-for="uc in t.usecases.items" :key="uc.role" class="gl-usecase">
              <p class="gl-usecase-role">{{ uc.role }}</p>
              <p class="gl-usecase-desc">{{ uc.desc }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Bottom CTA -->
      <section class="gl-cta">
        <div class="gl-container gl-cta-inner">
          <p class="gl-cta-line">{{ t.cta.line }}</p>
          <div class="gl-cta-actions">
            <a href="https://gradlab.app" target="_blank" rel="noopener" class="gl-btn-primary">{{ t.cta.btn1 }}</a>
            <a :href="link('quickstart')" class="gl-btn-ghost">{{ t.cta.btn2 }}</a>
          </div>
        </div>
      </section>

    </main>

    <!-- Footer -->
    <footer class="gl-footer">
      <div class="gl-container gl-footer-inner">
        <span class="gl-footer-copy">{{ t.footer.copy }}</span>
        <nav class="gl-footer-links" aria-label="Footer navigation">
          <a href="https://gradlab.app" target="_blank" rel="noopener" class="gl-footer-link">{{ t.footer.launch }}</a>
          <a :href="link('quickstart')" class="gl-footer-link">{{ t.footer.docs }}</a>
          <a href="https://github.com/Super-bob3/GradLab" target="_blank" rel="noopener" class="gl-footer-link">{{ t.footer.github }}</a>
        </nav>
      </div>
    </footer>

  </div>
</template>

<style scoped>
/* ── Fonts ─────────────────────────────────────────────── */
@font-face {
  font-family: 'Geist';
  src: url('/fonts/Geist-Regular.woff2') format('woff2');
  font-weight: 400; font-style: normal; font-display: swap;
}
@font-face {
  font-family: 'Geist';
  src: url('/fonts/Geist-Medium.woff2') format('woff2');
  font-weight: 500; font-style: normal; font-display: swap;
}
@font-face {
  font-family: 'Geist';
  src: url('/fonts/Geist-SemiBold.woff2') format('woff2');
  font-weight: 600; font-style: normal; font-display: swap;
}
@font-face {
  font-family: 'Geist Mono';
  src: url('/fonts/GeistMono-Regular.woff2') format('woff2');
  font-weight: 400; font-style: normal; font-display: swap;
}

/* ── Base ──────────────────────────────────────────────── */
.gl-home {
  min-height: 100vh;
  background: #ffffff;
  color: #111111;
  font-family: 'Geist', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.gl-home *, .gl-home *::before, .gl-home *::after { box-sizing: border-box; }
.gl-home a { text-decoration: none; }
.gl-home ul, .gl-home li { list-style: none; margin: 0; padding: 0; }

.gl-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 clamp(24px, 5vw, 80px);
}

/* ── Nav — liquid glass capsule ────────────────────────── */

/* Host: fixed position, never animated — glass layer lives here at rest.
   Separating positioning from animation avoids Chrome's compositor issue
   where backdrop-filter children are skipped inside animated elements. */
.gl-nav-host {
  position: fixed;
  top: 14px;
  left: 0;
  right: 0;
  margin-inline: auto;
  z-index: 100;
  width: min(960px, calc(100vw - 32px));
  border-radius: 9999px;
  pointer-events: none;
  /* No transform — transform creates a compositing stacking context that blocks
     backdrop-filter in Safari and causes coordinate confusion in Chrome's SVG filter. */
}

/* Nav: spring animated, no positioning of its own */
.gl-nav {
  border-radius: 9999px;
  pointer-events: auto;
}

/* Shared layer base */
.gl-nav-layer {
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  opacity: 0;
  pointer-events: none;
}

/* Glass effect on the host itself — not on a child layer.
   Applying backdrop-filter to a child inside overflow:hidden breaks Safari.
   On the host directly, border-radius clips the effect in both Chrome and Safari.
   blur(0.001px) when not scrolled keeps the compositor layer warm (no cold-start). */
.gl-nav-host {
  -webkit-backdrop-filter: blur(0.001px);
  backdrop-filter: blur(0.001px);
}

.gl-nav-host--scrolled {
  /* Safari: -webkit-backdrop-filter handles the blur. Safari 15.4+ also processes
     the standard backdrop-filter, but we keep it at blur(16px) here as the safe base. */
  -webkit-backdrop-filter: blur(16px) saturate(1.6) brightness(1.08);
  backdrop-filter: blur(16px) saturate(1.6) brightness(1.08);
}

/* Chrome SVG displacement filter is injected via JS in onMounted (only when !isSafari),
   because @supports(-webkit-touch-callout) incorrectly evaluates in Safari. */

/* Background + shadow layer: inside nav, smooth GPU opacity fade */
.gl-nav-layer--bg {
  background: rgba(255,255,255,0.14);
  box-shadow: 0 8px 24px rgba(0,0,0,0.10),
              inset 0 0 0 0.5px rgba(0,0,0,0.10),
              inset 0 -1px 2px rgba(0,0,0,0.10),
              inset 0 0 1px 2px rgba(255,255,255,0.10);
  transition: opacity 380ms cubic-bezier(0.16,1,0.3,1);
}

/* Scrolled: reveal bg layer */
.gl-nav--scrolled .gl-nav-layer {
  opacity: 1;
}

/* Spring pop — on the HOST so backdrop-filter scales with the pill (no corona ghost).
   Chrome: backdrop-filter on the same element as will-change:transform works fine —
   the Chrome bug only affects backdrop-filter on CHILDREN of animated elements. */
@keyframes gl-nav-pop {
  0%   { transform: translateY(-14px) scaleY(0.72) scaleX(0.96); opacity: 0; }
  5%   { opacity: 1; }
  60%  { transform: translateY(4px)   scaleY(1.06) scaleX(1.01); }
  78%  { transform: translateY(-2px)  scaleY(0.98) scaleX(1.00); }
  100% { transform: translateY(0)     scaleY(1)    scaleX(1);    opacity: 1; }
}
.gl-nav-host--spring {
  will-change: transform, opacity;
  animation: gl-nav-pop 640ms cubic-bezier(0.34, 1.4, 0.64, 1) forwards;
}

/* Content wrapper */
.gl-nav-content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 8px 8px 8px 20px;
}

/* Text: always dark — doesn't change between states */
.gl-nav-logo {
  font-size: 0.9375rem; font-weight: 500; letter-spacing: -0.02em;
  color: #111111;
  white-space: nowrap;
  cursor: pointer;
}
.gl-nav-links { display: flex; align-items: center; gap: 4px; margin-left: auto; }
.gl-nav-link {
  font-size: 0.875rem;
  color: rgba(0,0,0,0.44);
  padding: 7px 14px; border-radius: 9999px;
  transition: color 150ms, background 150ms;
  white-space: nowrap;
}
.gl-nav-link:hover { color: rgba(0,0,0,0.78); background: rgba(0,0,0,0.06); }

/* CTA pill — solid dark, always readable */
.gl-nav-launch {
  display: inline-flex; align-items: center;
  font-size: 0.875rem; font-weight: 500; letter-spacing: -0.01em;
  color: #ffffff;
  background: rgba(0,0,0,0.80);
  border-radius: 9999px;
  padding: 7px 16px;
  white-space: nowrap;
  transition: background 150ms;
}
.gl-nav-launch:hover { background: rgba(0,0,0,0.92); }

/* Scrolled state: child layers handle all visuals via opacity */
.gl-nav--scrolled { }

/* ── Hero ──────────────────────────────────────────────── */
.gl-hero {
  position: relative;
  height: 100svh; min-height: 580px;
  display: flex; align-items: center; justify-content: center;
}
.gl-hero-bg {
  position: absolute; inset: 0; overflow: hidden;
  /* Safari / no-WebGL fallback — matches preset colors so hero looks consistent */
  background: linear-gradient(135deg, #FB7C47 0%, #E1B8FF 50%, #0883F7 100%);
}
.gl-hero-bg iframe {
  width: 100%; height: 100%; border: none; pointer-events: none; display: block;
}
.gl-hero-canvas {
  display: block; width: 100%; height: 100%; pointer-events: none;
}
.gl-hero-noise {
  position: absolute; inset: 0;
  background-size: 128px 128px;
  pointer-events: none;
  mix-blend-mode: overlay;
  opacity: 0.12;
}
/* White radial halo at text center + linear fade to white page at bottom */
.gl-hero-vignette {
  position: absolute; inset: 0;
  background:
    radial-gradient(ellipse 82% 52% at 50% 54%, rgba(255,255,255,0.60) 0%, rgba(255,255,255,0) 100%),
    linear-gradient(180deg,
      rgba(255,255,255,0)    0%,
      rgba(255,255,255,0.06) 22%,
      rgba(255,255,255,0.42) 55%,
      rgba(255,255,255,0.90) 78%,
      #ffffff 94%
    );
}
.gl-hero-content {
  position: relative; z-index: 1;
  text-align: center;
  padding: 0 clamp(24px, 5vw, 48px);
  max-width: 760px;
}
.gl-hero-title {
  display: flex; flex-direction: column;
  font-size: clamp(2.75rem, 7.5vw, 5.5rem);
  font-weight: 300;
  letter-spacing: -0.035em;
  line-height: 1.02;
  color: #111111;
  text-wrap: balance;
  margin: 0 0 clamp(14px, 2vw, 20px);
}
.gl-hero-line {
  display: block;
  opacity: 0; transform: translateY(20px);
  animation: gl-rise 0.8s cubic-bezier(0.16,1,0.3,1) forwards;
}
@keyframes gl-rise { to { opacity: 1; transform: translateY(0); } }

.gl-hero-sub {
  font-size: clamp(0.9375rem, 1.8vw, 1.0625rem);
  color: #555555;
  line-height: 1.7; max-width: 52ch;
  margin: 0 auto clamp(24px, 3.5vw, 32px);
  text-wrap: pretty;
  opacity: 0;
  animation: gl-rise 0.8s 0.14s cubic-bezier(0.16,1,0.3,1) forwards;
}
.gl-hero-actions {
  display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;
  opacity: 0;
  animation: gl-rise 0.8s 0.22s cubic-bezier(0.16,1,0.3,1) forwards;
}
.gl-hero-pills {
  display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;
  margin-top: 20px;
  opacity: 0;
  animation: gl-rise 0.8s 0.32s cubic-bezier(0.16,1,0.3,1) forwards;
}

/* ── Buttons ───────────────────────────────────────────── */
.gl-btn-primary {
  display: inline-flex; align-items: center;
  background: #111111; color: #ffffff;
  padding: 9px 22px;
  font-family: 'Geist', sans-serif; font-size: 0.875rem; font-weight: 500; letter-spacing: -0.01em;
  border-radius: 9999px;
  transition: background 150ms cubic-bezier(0.16,1,0.3,1);
  white-space: nowrap;
}
.gl-btn-primary:hover { background: #333333; color: #ffffff; }

.gl-btn-ghost {
  display: inline-flex; align-items: center;
  background: transparent; color: #111111;
  padding: 9px 22px;
  font-family: 'Geist', sans-serif; font-size: 0.875rem; font-weight: 400; letter-spacing: -0.01em;
  border: 1px solid rgba(0,0,0,0.18); border-radius: 9999px;
  transition: background 150ms, border-color 150ms;
  white-space: nowrap;
}
.gl-btn-ghost:hover { background: rgba(0,0,0,0.04); border-color: rgba(0,0,0,0.3); color: #111111; }

/* ── Pills ─────────────────────────────────────────────── */
.gl-pill {
  display: inline-block; font-size: 0.8125rem;
  color: #777777;
  background: rgba(0,0,0,0.04);
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 9999px; padding: 4px 13px;
}

/* ── Sections ──────────────────────────────────────────── */
.gl-section      { padding: clamp(72px, 9vw, 120px) 0; }
.gl-section-sep  { border-top: 1px solid rgba(0,0,0,0.06); }
.gl-section-title {
  font-size: clamp(1.5rem, 2.8vw, 2.125rem);
  font-weight: 400; letter-spacing: -0.025em; line-height: 1.15;
  color: #111111; text-wrap: balance;
  margin: 0 0 clamp(40px, 5vw, 60px);
}

/* ── Capabilities ──────────────────────────────────────── */
.gl-cap-list { display: flex; flex-direction: column; }
.gl-cap-row {
  display: grid;
  grid-template-columns: 200px 1fr 1.6fr;
  gap: 12px 48px;
  padding: 24px 0;
  border-top: 1px solid rgba(0,0,0,0.06);
  align-items: start;
}
.gl-cap-row:last-child { border-bottom: 1px solid rgba(0,0,0,0.06); }
.gl-cap-name { font-size: 0.9375rem; font-weight: 500; letter-spacing: -0.01em; color: #111111; padding-top: 2px; }
.gl-cap-tags { display: flex; gap: 5px; flex-wrap: wrap; align-items: flex-start; }
.gl-tag {
  font-family: 'Geist Mono', ui-monospace, monospace;
  font-size: 0.625rem; color: #888888;
  background: rgba(0,0,0,0.04);
  border-radius: 9999px; padding: 3px 9px;
  white-space: nowrap; letter-spacing: 0.02em;
}
.gl-cap-desc { font-size: 0.9375rem; color: #555555; line-height: 1.65; }

/* ── Algorithms ────────────────────────────────────────── */
.gl-algo-header { display: flex; align-items: baseline; gap: 24px; flex-wrap: wrap; margin-bottom: clamp(40px, 5vw, 60px); }
.gl-algo-header .gl-section-title { margin-bottom: 0; flex-shrink: 0; }
.gl-algo-sub { font-size: 0.875rem; color: #888888; line-height: 1.5; }
.gl-algo-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0 40px; }
.gl-algo-cat {
  font-family: 'Geist Mono', ui-monospace, monospace;
  font-size: 0.625rem; color: #aaaaaa;
  letter-spacing: 0.06em; text-transform: lowercase;
  margin-bottom: 16px; padding-bottom: 10px;
  border-bottom: 1px solid rgba(0,0,0,0.06);
}
.gl-algo-item { padding: 10px 0; border-bottom: 1px solid rgba(0,0,0,0.05); display: flex; flex-direction: column; gap: 3px; }
.gl-algo-name { font-size: 0.9375rem; font-weight: 400; color: #111111; letter-spacing: -0.01em; }
.gl-algo-desc { font-size: 0.75rem; color: #888888; line-height: 1.4; }

/* ── Export ────────────────────────────────────────────── */
.gl-export-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0 40px; }
.gl-export-item { padding: 28px 0 20px; border-top: 1px solid rgba(0,0,0,0.06); }
.gl-export-format { font-size: 2.25rem; font-weight: 300; letter-spacing: -0.04em; color: #111111; margin-bottom: 6px; line-height: 1; }
.gl-export-tag { font-family: 'Geist Mono', ui-monospace, monospace; font-size: 0.625rem; color: #aaaaaa; letter-spacing: 0.04em; text-transform: lowercase; margin-bottom: 16px; }
.gl-export-desc { font-size: 0.9375rem; color: #555555; line-height: 1.65; }

/* ── Use Cases ─────────────────────────────────────────── */
.gl-usecase-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0 80px; }
.gl-usecase { padding: 24px 0; border-top: 1px solid rgba(0,0,0,0.06); }
.gl-usecase-role { font-family: 'Geist Mono', ui-monospace, monospace; font-size: 0.625rem; color: #aaaaaa; letter-spacing: 0.05em; text-transform: lowercase; margin-bottom: 10px; }
.gl-usecase-desc { font-size: 0.9375rem; color: #555555; line-height: 1.65; max-width: 62ch; }

/* ── CTA ───────────────────────────────────────────────── */
.gl-cta {
  border-top: 1px solid rgba(0,0,0,0.06);
  padding: clamp(80px, 10vw, 140px) 0;
}
.gl-cta-inner { display: flex; flex-direction: column; align-items: center; gap: 2.25rem; text-align: center; }
.gl-cta-line {
  font-size: clamp(1.625rem, 3.5vw, 2.625rem);
  font-weight: 300; letter-spacing: -0.03em;
  color: #111111; text-wrap: balance; line-height: 1.2;
}
.gl-cta-actions { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; }

/* ── Footer ────────────────────────────────────────────── */
.gl-footer { border-top: 1px solid rgba(0,0,0,0.06); padding: 28px 0; }
.gl-footer-inner { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; }
.gl-footer-copy { font-size: 0.8125rem; color: #aaaaaa; }
.gl-footer-links { display: flex; gap: 24px; }
.gl-footer-link { font-size: 0.8125rem; color: #888888; transition: color 150ms; }
.gl-footer-link:hover { color: #111111; }

/* ── Reveal ────────────────────────────────────────────── */
.gl-reveal { opacity: 1; transform: none; }
@media (prefers-reduced-motion: no-preference) {
  .gl-reveal {
    opacity: 0; transform: translateY(20px);
    transition: opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1);
  }
  .gl-reveal.gl-visible { opacity: 1; transform: none; }
}
@media (prefers-reduced-motion: reduce) {
  .gl-hero-line, .gl-hero-sub, .gl-hero-actions, .gl-hero-pills { opacity: 1; transform: none; animation: none; }
}

/* ── Responsive ────────────────────────────────────────── */
@media (max-width: 900px) {
  .gl-algo-grid { grid-template-columns: repeat(2, 1fr); gap: 32px 32px; }
  .gl-cap-row { grid-template-columns: 1fr 1fr; }
  .gl-cap-desc { grid-column: 1 / -1; }
}
@media (max-width: 700px) {
  .gl-hero-bg iframe { display: none; }
  .gl-cap-row { grid-template-columns: 1fr; gap: 10px; }
  .gl-cap-desc { grid-column: auto; }
  .gl-algo-grid { grid-template-columns: 1fr 1fr; }
  .gl-export-grid { grid-template-columns: 1fr; }
  .gl-usecase-grid { grid-template-columns: 1fr; }
  .gl-nav-link { display: none; }
  .gl-nav-links { gap: 16px; }
  .gl-algo-header { flex-direction: column; gap: 8px; }
  .gl-footer-inner { flex-direction: column; align-items: flex-start; }
}
@media (max-width: 480px) {
  .gl-algo-grid { grid-template-columns: 1fr; }
}
</style>
