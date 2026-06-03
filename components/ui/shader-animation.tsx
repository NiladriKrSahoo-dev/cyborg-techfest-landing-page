'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export function ShaderAnimation() {
  const mountRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setClearColor(0x000000, 0)
    renderer.domElement.style.position = 'absolute'
    renderer.domElement.style.inset = '0'
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    renderer.domElement.style.display = 'block'
    renderer.domElement.style.pointerEvents = 'none'
    mount.appendChild(renderer.domElement)

    const geometry = new THREE.PlaneGeometry(2, 2)
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(1, 1) },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;

        uniform float uTime;
        uniform vec2 uResolution;
        varying vec2 vUv;

        mat2 rot(float a) {
          float c = cos(a);
          float s = sin(a);
          return mat2(c, -s, s, c);
        }

        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
        }

        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          float a = hash(i);
          float b = hash(i + vec2(1.0, 0.0));
          float c = hash(i + vec2(0.0, 1.0));
          float d = hash(i + vec2(1.0, 1.0));
          return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
        }

        void main() {
          vec2 uv = vUv * 2.0 - 1.0;
          uv.x *= uResolution.x / uResolution.y;

          vec2 p = uv * 0.8;
          p *= rot(uTime * 0.09);
          float n = noise(p * 3.0 + vec2(uTime * 0.08));
          float n2 = noise(p * 7.0 - vec2(uTime * 0.05));
          float pulse = 0.5 + 0.5 * sin(uTime * 0.35 + length(uv) * 8.0);

          vec3 base = mix(vec3(0.03, 0.08, 0.18), vec3(0.02, 0.15, 0.30), n);
          vec3 accent = vec3(0.10, 0.55, 1.0) * (0.35 + 0.65 * pulse);
          vec3 glow = vec3(0.35, 0.85, 1.0) * pow(0.25 + 0.75 * n2, 3.0);

          vec3 color = base + accent * 0.35 + glow * 0.55;
          color *= 0.95 + 0.15 * sin(uTime * 0.15 + n2 * 6.0);

          gl_FragColor = vec4(color, 1.0);
        }
      `,
      transparent: true,
    })

    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    const resize = () => {
      const width = mount.clientWidth || 1
      const height = mount.clientHeight || 1

      renderer.setSize(width, height, false)
      renderer.domElement.style.width = '100%'
      renderer.domElement.style.height = '100%'
      material.uniforms.uResolution.value.set(width, height)
      camera.updateProjectionMatrix()
    }

    let animationFrame = 0
    const render = () => {
      animationFrame = window.requestAnimationFrame(render)
      material.uniforms.uTime.value += 0.016
      renderer.render(scene, camera)
    }

    resize()
    render()

    const hydrationTimer = window.setTimeout(() => {
      resize()
    }, 180)

    window.addEventListener('resize', resize)

    return () => {
      window.clearTimeout(hydrationTimer)
      window.cancelAnimationFrame(animationFrame)
      window.removeEventListener('resize', resize)
      renderer.dispose()
      geometry.dispose()
      material.dispose()
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    />
  )
}
