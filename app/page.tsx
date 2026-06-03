'use client'

import React, { useEffect, useRef, Suspense, lazy } from "react"
import * as THREE from "three"
import { Shield, Cpu, Terminal, Layers, Calendar, Award, Users, ArrowUpRight, Trophy, Zap, Globe, Ticket } from "lucide-react"

// ==========================================
// 1. LAZY LOAD SPLINE
// ==========================================
const Spline = lazy(() => import('@splinetool/react-spline'))

function SplineScene({ scene }: { scene: string }) {
  return (
    <Suspense 
      fallback={
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-cyan-500 text-xs font-mono animate-pulse tracking-widest">[ INITIALIZING_3D_ENGINE... ]</span>
        </div>
      }
    >
      <Spline scene={scene} className="w-full h-full" />
    </Suspense>
  )
}

// ==========================================
// 2. FULL-SCREEN GLOBAL SHADER BACKGROUND
// ==========================================
function ShaderAnimation() {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<{
    camera: THREE.Camera
    scene: THREE.Scene
    renderer: THREE.WebGLRenderer
    uniforms: any
    animationId: number
  } | null>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const container = containerRef.current

    const vertexShader = `
      void main() {
        gl_Position = vec4( position, 1.0 );
      }
    `
    const fragmentShader = `
      #define TWO_PI 6.2831853072
      #define PI 3.14159265359
      precision highp float;
      uniform vec2 resolution;
      uniform float time;

      void main(void) {
        vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
        float t = time * 0.04;
        float lineWidth = 0.002;
        vec3 color = vec3(0.0);
        for(int j = 0; j < 3; j++){
          for(int i=0; i < 5; i++){
            color[j] += lineWidth * float(i*i) / abs(fract(t - 0.01 * float(j) + float(i) * 0.01) * 5.0 - length(uv) + mod(uv.x + uv.y, 0.2));
          }
        }
        gl_FragColor = vec4(color[0], color[1], color[2], 1.0);
      }
    `

    const camera = new THREE.Camera()
    camera.position.z = 1
    const scene = new THREE.Scene()
    const geometry = new THREE.PlaneGeometry(2, 2)
    const uniforms = {
      time: { value: 1.0 },
      resolution: { value: new THREE.Vector2() },
    }
    const material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      depthWrite: false,
      depthTest: false,
    })
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    
    renderer.domElement.style.position = "absolute"
    renderer.domElement.style.top = "0"
    renderer.domElement.style.left = "0"
    renderer.domElement.style.width = "100%"
    renderer.domElement.style.height = "100%"
    container.appendChild(renderer.domElement)

    const onWindowResize = () => {
      if (!container) return
      const width = window.innerWidth
      const height = window.innerHeight
      renderer.setSize(width, height, false)
      uniforms.resolution.value.x = width * window.devicePixelRatio
      uniforms.resolution.value.y = height * window.devicePixelRatio
    }

    onWindowResize()
    const sizeCheck = setTimeout(onWindowResize, 100)
    window.addEventListener("resize", onWindowResize, false)

    const animate = () => {
      const animationId = requestAnimationFrame(animate)
      uniforms.time.value += 0.05
      renderer.render(scene, camera)
      if (sceneRef.current) sceneRef.current.animationId = animationId
    }

    sceneRef.current = { camera, scene, renderer, uniforms, animationId: 0 }
    animate()

    return () => {
      clearTimeout(sizeCheck)
      window.removeEventListener("resize", onWindowResize)
      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId)
        if (container && sceneRef.current.renderer.domElement && container.contains(sceneRef.current.renderer.domElement)) {
          container.removeChild(sceneRef.current.renderer.domElement)
        }
        sceneRef.current.renderer.dispose()
        geometry.dispose()
        material.dispose()
      }
    }
  }, [])

  return (
    <div ref={containerRef} className="fixed inset-0 w-[100vw] h-[100vh] bg-[#030303] z-0 pointer-events-none" />
  )
}

// ==========================================
// 3. MAIN EVENT PORTAL ARCHITECTURE
// ==========================================
export default function Home() {
  return (
    <div className="min-h-screen text-white selection:bg-cyan-500 selection:text-black overflow-x-hidden font-mono relative scroll-smooth">
      
      {/* === LAYER 1: GLOBAL SHADER === */}
      <ShaderAnimation />

      {/* === LAYER 2: FREESTANDING BORDERLESS ROBOT === */}
      <div className="fixed top-0 left-0 w-[100vw] md:w-[140vw] h-[100vh] z-10 pointer-events-auto flex items-center justify-center">
        <SplineScene scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode" />
      </div>

      {/* === LAYER 3: FOREGROUND UI === */}
      <div className="relative z-20 w-full pointer-events-none">
        
        {/* ENHANCED NAV BAR */}
        <nav className="w-full max-w-[1200px] mx-auto px-6 py-8 flex justify-between items-center">
          <div className="flex items-center gap-3 pointer-events-auto cursor-pointer group">
            <div className="h-8 w-8 rounded-sm bg-cyan-500/10 border border-cyan-500/50 flex items-center justify-center font-bold text-cyan-400 text-xs shadow-[0_0_15px_rgba(34,211,238,0.2)] group-hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] group-hover:bg-cyan-500 group-hover:text-black transition-all duration-300">
              TF
            </div>
            <span className="font-bold tracking-widest text-xs lg:text-sm text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
              TECHFEST.ORG
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-[11px] text-neutral-400 font-semibold tracking-widest">
            <a href="#hero" className="pointer-events-auto hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] transition-all">// EXHIBITIONS</a>
            <a href="#events" className="pointer-events-auto hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] transition-all">// COMPETITIONS</a>
            <a href="#matrix" className="pointer-events-auto hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] transition-all">// KEYNOTES</a>
          </div>
          <a href="#register" className="pointer-events-auto flex items-center gap-2 px-5 py-2 rounded bg-cyan-500/10 border border-cyan-500/50 text-[11px] text-cyan-400 font-bold hover:bg-cyan-500 hover:text-black hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] backdrop-blur-md transition-all duration-300">
            <Ticket size={14} />
            GET_PASSES
          </a>
        </nav>

        {/* HERO SECTION */}
        <main id="hero" className="w-full max-w-[1200px] mx-auto px-6 pt-16 md:pt-28 pb-32 flex items-center min-h-[85vh]">
          <div className="w-full md:w-[60%] flex flex-col justify-center gap-6">
            
            <div className="pointer-events-auto w-fit inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-cyan-500/5 text-cyan-400 text-[10px] md:text-xs border border-cyan-500/30 tracking-widest uppercase shadow-[inset_0_0_20px_rgba(34,211,238,0.05)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              ASIA'S LARGEST SCIENCE & TECHNOLOGY FESTIVAL
            </div>
            
            <h1 className="pointer-events-auto w-fit text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-white via-neutral-200 to-neutral-600 leading-[1.05] drop-shadow-lg">
              Enter The <br />
              Future Grid.
            </h1>
            
            <p className="pointer-events-auto text-neutral-300 max-w-[480px] leading-relaxed text-sm md:text-base font-sans drop-shadow-md border-l-2 border-cyan-500/50 pl-4">
              Witness the absolute pinnacle of human innovation. Immerse yourself in international robotics arenas, AI neural-net symposiums, and breathtaking technological exhibitions.
            </p>

            <div className="flex gap-4 mt-4">
               <a href="#register" className="pointer-events-auto px-6 py-3 rounded bg-cyan-500 text-black font-bold text-xs tracking-wider shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] hover:bg-cyan-400 transition-all duration-300">
                INITIALIZE_TICKETS
              </a>
               <a href="#events" className="pointer-events-auto flex items-center gap-2 px-6 py-3 rounded bg-white/5 border border-white/10 text-white font-bold text-xs tracking-wider hover:bg-white/10 transition-all duration-300 backdrop-blur-sm">
                VIEW_SCHEDULE <ArrowUpRight size={14} />
              </a>
            </div>

            {/* High-Tech Stats */}
            <div className="grid grid-cols-3 gap-3 mt-8 max-w-[480px]">
              <div className="pointer-events-auto p-3 rounded border border-white/5 bg-white/[0.02] backdrop-blur-md">
                <div className="text-neutral-500 text-[9px] mb-1 tracking-widest">GLOBAL_FOOTFALL</div>
                <div className="text-lg font-bold text-white tracking-tight">175,000<span className="text-cyan-500">+</span></div>
              </div>
              <div className="pointer-events-auto p-3 rounded border border-white/5 bg-white/[0.02] backdrop-blur-md">
                <div className="text-neutral-500 text-[9px] mb-1 tracking-widest">TECH_EVENTS</div>
                <div className="text-lg font-bold text-white tracking-tight">200<span className="text-cyan-500">+</span></div>
              </div>
              <div className="pointer-events-auto p-3 rounded border border-white/5 bg-white/[0.02] backdrop-blur-md">
                <div className="text-neutral-500 text-[9px] mb-1 tracking-widest">PRIZE_POOL</div>
                <div className="text-lg font-bold text-white tracking-tight">₹5M<span className="text-cyan-500">+</span></div>
              </div>
            </div>
          </div>
        </main>

        {/* FLAGSHIP EVENTS SECTION */}
        <section id="events" className="w-full max-w-[1200px] mx-auto px-6 pb-28">
          <div className="flex flex-col mb-12 pointer-events-auto w-fit">
            <span className="text-xs text-cyan-500 font-bold tracking-widest drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">[ CORE_MODULES ]</span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mt-2 text-white">Flagship Experiences</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="pointer-events-auto group relative p-8 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:border-cyan-500/50 hover:shadow-[0_10px_40px_rgba(34,211,238,0.1)]">
              {/* Animated Top Glow Line */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Zap size={24} className="text-cyan-400 mb-5 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
              <h3 className="text-base font-bold tracking-widest text-white uppercase mb-3">Robowars Arena</h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">Experience the most brutal combat robotics tournament in Asia. Heavyweight machines clash in a custom-built, hazard-filled arena.</p>
            </div>

            <div className="pointer-events-auto group relative p-8 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:border-cyan-500/50 hover:shadow-[0_10px_40px_rgba(34,211,238,0.1)]">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Globe size={24} className="text-cyan-400 mb-5 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
              <h3 className="text-base font-bold tracking-widest text-white uppercase mb-3">Tech Exhibitions</h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">Interact with cutting-edge innovations from global tech giants and secret research facilities, featuring humanoid synthetics and drones.</p>
            </div>

            <div className="pointer-events-auto group relative p-8 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:border-cyan-500/50 hover:shadow-[0_10px_40px_rgba(34,211,238,0.1)]">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Cpu size={24} className="text-cyan-400 mb-5 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
              <h3 className="text-base font-bold tracking-widest text-white uppercase mb-3">Oculus Keynotes</h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">Listen to the architects of the future. Industry pioneers, Nobel laureates, and tech founders share their vision for tomorrow.</p>
            </div>

          </div>
        </section>

        {/* REGISTRATION FORM (TERMINAL STYLE) */}
        <section id="register" className="w-full max-w-[1200px] mx-auto px-6 pb-32">
          <div className="pointer-events-auto relative p-10 md:p-14 rounded-2xl border border-cyan-500/30 bg-black/60 backdrop-blur-xl max-w-3xl mx-auto text-center flex flex-col items-center shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden group">
            
            {/* Background glowing orb */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-cyan-500/20 transition-all duration-700" />

            <div className="relative z-10 flex flex-col items-center">
              <Terminal size={32} className="text-cyan-400 mb-6 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
              <h3 className="text-2xl font-extrabold text-white tracking-tight">Secure Your Access Node</h3>
              <p className="text-sm text-neutral-400 mt-3 max-w-md font-sans">
                Input your credentials to join the network. Early access passes unlock exclusive backstage technical zones.
              </p>
              
              <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full max-w-lg">
                <div className="relative flex-1">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500 text-sm">{">"}</div>
                  <input 
                    type="email" 
                    placeholder="ENTER_EMAIL_ADDRESS..." 
                    className="w-full bg-black/80 border border-neutral-700 rounded-lg pl-8 pr-4 py-3.5 text-xs font-mono text-neutral-200 focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_15px_rgba(34,211,238,0.2)] placeholder:text-neutral-600 transition-all" 
                  />
                </div>
                <button className="px-8 py-3.5 rounded-lg bg-cyan-500 text-black font-extrabold text-xs tracking-widest hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] hover:-translate-y-0.5">
                  INITIALIZE.SH
                </button>
              </div>
            </div>

            {/* Decorator brackets */}
            <div className="absolute top-6 left-6 w-4 h-4 border-t-2 border-l-2 border-cyan-500/50 opacity-50" />
            <div className="absolute bottom-6 right-6 w-4 h-4 border-b-2 border-r-2 border-cyan-500/50 opacity-50" />
          </div>
        </section>

      </div>
    </div>
  )
}