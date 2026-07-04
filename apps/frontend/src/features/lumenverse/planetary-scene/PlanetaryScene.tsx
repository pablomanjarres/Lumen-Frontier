import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import '@/styles/lumenverse.css'

interface PlanetConfig {
  name: string
  link: string
  color: number
  emissive: number
  radius: number
  x: number
  y: number
  z: number
}

// ── Inline line icons (retire emoji-as-icons) ──
type IconProps = { className?: string }

const LinkIcon = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 17H7A5 5 0 0 1 7 7h2" />
    <path d="M15 7h2a5 5 0 0 1 0 10h-2" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
)

const TargetIcon = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="3" />
    <line x1="12" y1="2" x2="12" y2="5" />
    <line x1="12" y1="19" x2="12" y2="22" />
    <line x1="2" y1="12" x2="5" y2="12" />
    <line x1="19" y1="12" x2="22" y2="12" />
  </svg>
)

const ImmersiveIcon = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 8V6a2 2 0 0 1 2-2h2" />
    <path d="M16 4h2a2 2 0 0 1 2 2v2" />
    <path d="M20 16v2a2 2 0 0 1-2 2h-2" />
    <path d="M8 20H6a2 2 0 0 1-2-2v-2" />
  </svg>
)

const MaximizeIcon = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 9V5a1 1 0 0 1 1-1h4" />
    <path d="M20 9V5a1 1 0 0 0-1-1h-4" />
    <path d="M4 15v4a1 1 0 0 0 1 1h4" />
    <path d="M20 15v4a1 1 0 0 1-1 1h-4" />
  </svg>
)

const MinimizeIcon = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 5v3a1 1 0 0 1-1 1H5" />
    <path d="M15 5v3a1 1 0 0 0 1 1h3" />
    <path d="M9 19v-3a1 1 0 0 0-1-1H5" />
    <path d="M15 19v-3a1 1 0 0 1 1-1h3" />
  </svg>
)

const CONTROL_KEYS: { k: string; label: string }[] = [
  { k: 'WASD', label: 'Move' },
  { k: 'Mouse', label: 'Look' },
  { k: 'Space', label: 'Ascend' },
  { k: 'Shift', label: 'Descend' },
  { k: 'Esc', label: 'Exit' },
]

export default function PlanetaryScene() {
  const mountRef = useRef<HTMLDivElement>(null)
  const [targetPlanet, setTargetPlanet] = useState<string | null>(null)
  const [isFlying, setIsFlying] = useState(false)
  const [isImmersiveMode, setIsImmersiveMode] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!mountRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x1a1413)

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    )
    camera.position.set(0, 5, 35)

    // Renderer with optimized settings
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      powerPreference: 'high-performance',
      stencil: false,
      depth: true
    })
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)) // Limit pixel ratio for performance
    mountRef.current.appendChild(renderer.domElement)

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(10, 10, 10)
    scene.add(directionalLight)

    // Create spaceship with tether cable
    const spaceshipGroup = new THREE.Group()
    
    // Main spaceship body
    const shipBodyGeometry = new THREE.CylinderGeometry(2, 2.5, 8, 8)
    const shipBodyMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xcccccc, 
      metalness: 0.9, 
      roughness: 0.2 
    })
    const shipBody = new THREE.Mesh(shipBodyGeometry, shipBodyMaterial)
    shipBody.rotation.x = Math.PI / 2
    spaceshipGroup.add(shipBody)
    
    // Spaceship cockpit
    const cockpitGeometry = new THREE.SphereGeometry(1.5, 16, 16)
    const cockpitMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x4488ff, 
      metalness: 0.8, 
      roughness: 0.1,
      transparent: true,
      opacity: 0.7
    })
    const cockpit = new THREE.Mesh(cockpitGeometry, cockpitMaterial)
    cockpit.position.z = 3
    spaceshipGroup.add(cockpit)
    
    // Engine thrusters (glowing)
    for (let i = 0; i < 4; i++) {
      const thrusterGeometry = new THREE.CylinderGeometry(0.4, 0.6, 1.5, 8)
      const thrusterMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x333333, 
        emissive: 0xff6600,
        emissiveIntensity: 0.5
      })
      const thruster = new THREE.Mesh(thrusterGeometry, thrusterMaterial)
      thruster.rotation.x = Math.PI / 2
      const angle = (i * Math.PI * 2) / 4
      thruster.position.x = Math.cos(angle) * 1.5
      thruster.position.y = Math.sin(angle) * 1.5
      thruster.position.z = -4
      spaceshipGroup.add(thruster)
      
      // Engine glow
      const glowGeometry = new THREE.SphereGeometry(0.5, 16, 16)
      const glowMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xff6600, 
        transparent: true, 
        opacity: 0.6 
      })
      const glow = new THREE.Mesh(glowGeometry, glowMaterial)
      glow.position.copy(thruster.position)
      glow.position.z -= 0.5
      spaceshipGroup.add(glow)
    }
    
    // Solar panels
    const panelGeometry = new THREE.BoxGeometry(6, 0.1, 2)
    const panelMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x1a1a3e, 
      metalness: 0.5, 
      roughness: 0.3 
    })
    const leftPanel = new THREE.Mesh(panelGeometry, panelMaterial)
    leftPanel.position.set(-4, 0, 0)
    spaceshipGroup.add(leftPanel)
    
    const rightPanel = new THREE.Mesh(panelGeometry, panelMaterial)
    rightPanel.position.set(4, 0, 0)
    spaceshipGroup.add(rightPanel)
    
    // Position spaceship behind and to the side of camera
    spaceshipGroup.position.set(-8, 3, 25)
    spaceshipGroup.rotation.y = Math.PI / 6
    scene.add(spaceshipGroup)
    
    // Create tether cable connecting astronaut to ship
    const tetherPoints: THREE.Vector3[] = []
    const tetherSegments = 50
    for (let i = 0; i <= tetherSegments; i++) {
      const t = i / tetherSegments
      // Create a curve from camera to ship
      const x = THREE.MathUtils.lerp(0, spaceshipGroup.position.x, t)
      const y = THREE.MathUtils.lerp(5, spaceshipGroup.position.y, t) + Math.sin(t * Math.PI) * 2
      const z = THREE.MathUtils.lerp(35, spaceshipGroup.position.z, t)
      tetherPoints.push(new THREE.Vector3(x, y, z))
    }
    
    const tetherGeometry = new THREE.BufferGeometry().setFromPoints(tetherPoints)
    const tetherMaterial = new THREE.LineBasicMaterial({ 
      color: 0xffaa00, 
      linewidth: 2 
    })
    const tetherCable = new THREE.Line(tetherGeometry, tetherMaterial)
    scene.add(tetherCable)
    
    // Create astronaut hands/arms visible in first person
    const astronautGroup = new THREE.Group()
    
    // Left glove
    const leftGloveGeometry = new THREE.SphereGeometry(0.15, 16, 16)
    const gloveMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xffffff, 
      metalness: 0.3, 
      roughness: 0.7 
    })
    const leftGlove = new THREE.Mesh(leftGloveGeometry, gloveMaterial)
    leftGlove.position.set(-0.8, -1.2, -1.5)
    leftGlove.scale.set(1.2, 1, 1.5)
    astronautGroup.add(leftGlove)
    
    // Left arm
    const leftArmGeometry = new THREE.CylinderGeometry(0.08, 0.12, 0.8, 8)
    const armMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xe0e0e0, 
      metalness: 0.2, 
      roughness: 0.8 
    })
    const leftArm = new THREE.Mesh(leftArmGeometry, armMaterial)
    leftArm.position.set(-0.7, -0.6, -1.3)
    leftArm.rotation.z = -0.3
    astronautGroup.add(leftArm)
    
    // Right glove
    const rightGlove = new THREE.Mesh(leftGloveGeometry, gloveMaterial)
    rightGlove.position.set(0.8, -1.2, -1.5)
    rightGlove.scale.set(1.2, 1, 1.5)
    astronautGroup.add(rightGlove)
    
    // Right arm
    const rightArm = new THREE.Mesh(leftArmGeometry, armMaterial)
    rightArm.position.set(0.7, -0.6, -1.3)
    rightArm.rotation.z = 0.3
    astronautGroup.add(rightArm)
    
    // Helmet visor edge (partially visible at screen edges)
    const visorGeometry = new THREE.TorusGeometry(1.2, 0.08, 8, 32, Math.PI * 1.8)
    const visorMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x333333, 
      metalness: 0.8, 
      roughness: 0.2 
    })
    const visorEdge = new THREE.Mesh(visorGeometry, visorMaterial)
    visorEdge.position.set(0, -0.3, -1)
    visorEdge.rotation.x = -0.3
    astronautGroup.add(visorEdge)
    
    // Helmet HUD elements (thin lines at screen edges)
    const hudMaterial = new THREE.LineBasicMaterial({ 
      color: 0x00ffff, 
      transparent: true, 
      opacity: 0.3 
    })
    
    // Top HUD line
    const topHudPoints = [
      new THREE.Vector3(-1, 0.8, -1.2),
      new THREE.Vector3(1, 0.8, -1.2)
    ]
    const topHudGeometry = new THREE.BufferGeometry().setFromPoints(topHudPoints)
    const topHud = new THREE.Line(topHudGeometry, hudMaterial)
    astronautGroup.add(topHud)
    
    // Bottom HUD line
    const bottomHudPoints = [
      new THREE.Vector3(-1, -1.5, -1.2),
      new THREE.Vector3(1, -1.5, -1.2)
    ]
    const bottomHudGeometry = new THREE.BufferGeometry().setFromPoints(bottomHudPoints)
    const bottomHud = new THREE.Line(bottomHudGeometry, hudMaterial)
    astronautGroup.add(bottomHud)
    
    // Attach astronaut group to camera
    camera.add(astronautGroup)
    scene.add(camera)

    // Stars - reduced count for better performance
    const starsGeometry = new THREE.BufferGeometry()
    const starPositions = []
    const starCount = 1000 // Reduced from 2000
    for (let i = 0; i < starCount; i++) {
      starPositions.push(
        (Math.random() - 0.5) * 300,
        (Math.random() - 0.5) * 300,
        (Math.random() - 0.5) * 300
      )
    }
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3))
    const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.15 })
    const stars = new THREE.Points(starsGeometry, starsMaterial)
    scene.add(stars)

    // Planet configurations
    const planetConfigs: PlanetConfig[] = [
      { name: 'Mathematics', link: '/topics/math', color: 0x3b82f6, emissive: 0x60a5fa, radius: 1.8, x: -15, y: 5, z: -10 },
      { name: 'Physics', link: '/topics/physics', color: 0x8b5cf6, emissive: 0xa78bfa, radius: 1.5, x: 10, y: -3, z: -15 },
      { name: 'Chemistry', link: '/topics/chemistry', color: 0xec4899, emissive: 0xf472b6, radius: 2.0, x: -8, y: -5, z: 5 },
      { name: 'Biology', link: '/topics/biology', color: 0x10b981, emissive: 0x34d399, radius: 1.3, x: 18, y: 3, z: -5 },
      { name: 'History', link: '/topics/history', color: 0xf59e0b, emissive: 0xfbbf24, radius: 1.6, x: -12, y: 8, z: 8 },
      { name: 'Literature', link: '/topics/literature', color: 0xef4444, emissive: 0xf87171, radius: 1.4, x: 5, y: -8, z: 12 },
      { name: 'Computer Science', link: '/topics/cs', color: 0x06b6d4, emissive: 0x22d3ee, radius: 1.7, x: -20, y: -2, z: -8 },
      { name: 'Philosophy', link: '/topics/philosophy', color: 0x84cc16, emissive: 0xa3e635, radius: 1.2, x: 15, y: 7, z: 10 },
      { name: 'Psychology', link: '/topics/psychology', color: 0x6366f1, emissive: 0x818cf8, radius: 1.5, x: -5, y: 2, z: -20 },
      { name: 'Economics', link: '/topics/economics', color: 0xf97316, emissive: 0xfb923c, radius: 1.9, x: 8, y: -6, z: -12 },
      { name: 'Art', link: '/topics/art', color: 0xd946ef, emissive: 0xe879f9, radius: 1.3, x: -18, y: -4, z: 15 },
      { name: 'Engineering', link: '/topics/engineering', color: 0x14b8a6, emissive: 0x2dd4bf, radius: 1.6, x: 12, y: 5, z: 8 },
      { name: 'Music', link: '/topics/music', color: 0xfbbf24, emissive: 0xfcd34d, radius: 1.1, x: -10, y: -7, z: -18 },
      { name: 'Astronomy', link: '/topics/astronomy', color: 0xa855f7, emissive: 0xc084fc, radius: 1.8, x: 20, y: 0, z: 5 },
      { name: 'Geography', link: '/topics/geography', color: 0x0ea5e9, emissive: 0x38bdf8, radius: 1.4, x: -15, y: 6, z: -15 },
      { name: 'Language', link: '/topics/language', color: 0xfb7185, emissive: 0xfda4af, radius: 1.5, x: 6, y: 8, z: -8 },
      { name: 'Sociology', link: '/topics/sociology', color: 0x22c55e, emissive: 0x4ade80, radius: 1.2, x: -8, y: -9, z: 18 },
      { name: 'Anthropology', link: '/topics/anthropology', color: 0xeab308, emissive: 0xfacc15, radius: 1.7, x: 16, y: -5, z: 15 },
    ]

    // Create realistic planets with detailed textures
    const planets: Array<{
      mesh: THREE.Mesh
      atmosphere?: THREE.Mesh
      glow?: THREE.Mesh
      data: PlanetConfig
      baseY: number
      floatSpeed: number
      floatOffset: number
      rotationSpeed: THREE.Vector3
    }> = []

    planetConfigs.forEach((config) => {
      // Main planet with simplified geometry for performance
      const geometry = new THREE.SphereGeometry(config.radius, 32, 32) // Reduced from 64,64
      
      // Simplified material - skip expensive canvas texture generation
      const material = new THREE.MeshStandardMaterial({
        color: config.color,
        emissive: config.emissive,
        emissiveIntensity: 0.3,
        metalness: 0.2,
        roughness: 0.8,
      })
      
      const mesh = new THREE.Mesh(geometry, material)
      mesh.position.set(config.x, config.y, config.z)
      mesh.userData = { name: config.name, link: config.link }
      mesh.castShadow = false // Disable shadows for performance
      mesh.receiveShadow = false
      scene.add(mesh)

      // Atmospheric glow
      const glowGeometry = new THREE.SphereGeometry(config.radius * 1.15, 32, 32)
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: config.emissive,
        transparent: true,
        opacity: 0.15,
        side: THREE.BackSide,
      })
      const glow = new THREE.Mesh(glowGeometry, glowMaterial)
      glow.position.copy(mesh.position)
      scene.add(glow)

      // Outer atmosphere
      const atmosphereGeometry = new THREE.SphereGeometry(config.radius * 1.08, 32, 32)
      const atmosphereMaterial = new THREE.MeshPhongMaterial({
        color: config.emissive,
        transparent: true,
        opacity: 0.2,
        shininess: 100,
      })
      const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial)
      atmosphere.position.copy(mesh.position)
      scene.add(atmosphere)

      planets.push({
        mesh,
        atmosphere,
        glow,
        data: config,
        baseY: config.y,
        floatSpeed: 0.0005 + Math.random() * 0.001,
        floatOffset: Math.random() * Math.PI * 2,
        rotationSpeed: new THREE.Vector3(
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.01
        ),
      })
    })

    // Flight controls
    const keys = new Set<string>()
    let mouseX = 0
    let mouseY = 0
    let pitch = 0
    let yaw = 0
    let isPointerLocked = false
    let rocketMesh: THREE.Group | null = null
    let isRocketFlying = false
    let rocketStart = new THREE.Vector3()
    let rocketEnd = new THREE.Vector3()
    let rocketProgress = 0

    // Create rocket
    const createRocket = () => {
      const rocket = new THREE.Group()
      
      // Rocket body (cone)
      const bodyGeometry = new THREE.ConeGeometry(0.3, 1.5, 8)
      const bodyMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffffff, 
        metalness: 0.8, 
        roughness: 0.2 
      })
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
      body.rotation.x = Math.PI
      rocket.add(body)
      
      // Rocket nose (smaller cone)
      const noseGeometry = new THREE.ConeGeometry(0.3, 0.5, 8)
      const noseMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xff4444, 
        metalness: 0.6, 
        roughness: 0.3 
      })
      const nose = new THREE.Mesh(noseGeometry, noseMaterial)
      nose.position.y = 0.75
      nose.rotation.x = Math.PI
      rocket.add(nose)
      
      // Fins
      const finGeometry = new THREE.BoxGeometry(0.1, 0.5, 0.6)
      const finMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x4444ff, 
        metalness: 0.7, 
        roughness: 0.2 
      })
      
      for (let i = 0; i < 3; i++) {
        const fin = new THREE.Mesh(finGeometry, finMaterial)
        fin.position.y = -0.5
        fin.rotation.y = (i * Math.PI * 2) / 3
        fin.position.x = Math.cos((i * Math.PI * 2) / 3) * 0.3
        fin.position.z = Math.sin((i * Math.PI * 2) / 3) * 0.3
        rocket.add(fin)
      }
      
      // Engine glow
      const glowGeometry = new THREE.SphereGeometry(0.25, 16, 16)
      const glowMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xff8800, 
        transparent: true, 
        opacity: 0.8 
      })
      const glow = new THREE.Mesh(glowGeometry, glowMaterial)
      glow.position.y = -0.9
      rocket.add(glow)
      
      // Flame particles
      const flameGeometry = new THREE.ConeGeometry(0.2, 0.8, 8)
      const flameMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xff6600, 
        transparent: true, 
        opacity: 0.7 
      })
      const flame = new THREE.Mesh(flameGeometry, flameMaterial)
      flame.position.y = -1.3
      rocket.add(flame)
      
      rocket.scale.set(0.8, 0.8, 0.8)
      return rocket
    }

    const onKeyDown = (e: KeyboardEvent) => keys.add(e.key.toLowerCase())
    const onKeyUp = (e: KeyboardEvent) => keys.delete(e.key.toLowerCase())

    const onKeyDownImmersive = (e: KeyboardEvent) => {
      // Prevent default browser behavior for movement keys in immersive mode
      if (isPointerLocked && isImmersiveMode) {
        const key = e.key.toLowerCase()
        if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' ', 'shift'].includes(key)) {
          e.preventDefault()
          e.stopPropagation()
        }
      }
      keys.add(e.key.toLowerCase())
    }

    const onKeyUpImmersive = (e: KeyboardEvent) => {
      if (isPointerLocked && isImmersiveMode) {
        const key = e.key.toLowerCase()
        if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' ', 'shift'].includes(key)) {
          e.preventDefault()
          e.stopPropagation()
        }
      }
      keys.delete(e.key.toLowerCase())
    }

    const onMouseMove = (e: MouseEvent) => {
      if (isPointerLocked) {
        mouseX = e.movementX || 0
        mouseY = e.movementY || 0
      }
    }

    const onClick = () => {
      if (!isPointerLocked) {
        renderer.domElement.requestPointerLock()
      } else {
        // Check if clicking on a planet - use longer ray distance for close-range detection
        const raycaster = new THREE.Raycaster()
        raycaster.far = 100 // Extend ray distance
        raycaster.setFromCamera(new THREE.Vector2(0, 0), camera)
        const intersects = raycaster.intersectObjects(planets.map((p) => p.mesh))
        if (intersects.length > 0 && !isRocketFlying) {
          const planet = intersects[0].object as THREE.Mesh
          const targetLink = planet.userData.link
          const distance = camera.position.distanceTo(planet.position)
          
          // If very close to planet, navigate immediately
          if (distance < 5) {
            window.location.href = targetLink
            return
          }
          
          // Launch rocket animation for distant planets
          isRocketFlying = true
          rocketProgress = 0
          rocketStart.copy(camera.position)
          rocketEnd.copy(planet.position)
          
          if (!rocketMesh) {
            rocketMesh = createRocket()
            scene.add(rocketMesh)
          }
          
          rocketMesh.position.copy(rocketStart)
          rocketMesh.visible = true
          
          // Point rocket toward target
          rocketMesh.lookAt(rocketEnd)
          
          // Navigate after animation
          setTimeout(() => {
            window.location.href = targetLink
          }, 2000)
        }
      }
    }

    const onPointerLockChange = () => {
      const wasLocked = isPointerLocked
      isPointerLocked = document.pointerLockElement === renderer.domElement
      setIsFlying(isPointerLocked)
      setIsImmersiveMode(isPointerLocked)
      
      console.log('Pointer lock changed:', isPointerLocked ? 'LOCKED' : 'UNLOCKED')
    }
    
    const onFullscreenChange = () => {
      const isCurrentlyFullscreen = !!document.fullscreenElement
      setIsFullscreen(isCurrentlyFullscreen)
      console.log('Fullscreen changed:', isCurrentlyFullscreen ? 'ON' : 'OFF')
    }

    document.addEventListener('keydown', onKeyDownImmersive, true)
    document.addEventListener('keyup', onKeyUpImmersive, true)
    document.addEventListener('mousemove', onMouseMove)
    renderer.domElement.addEventListener('click', onClick)
    document.addEventListener('pointerlockchange', onPointerLockChange)
    document.addEventListener('fullscreenchange', onFullscreenChange)

    // Animation with performance optimizations
    let time = 0
    const clock = new THREE.Clock()
    const moveSpeed = 0.3
    let frameCount = 0

    const raycaster = new THREE.Raycaster()
    const animate = () => {
      requestAnimationFrame(animate)
      const delta = clock.getDelta()
      time += delta
      frameCount++

      // Skip expensive operations on some frames for better FPS
      const shouldUpdateExpensive = frameCount % 2 === 0

      // Rotate stars less frequently
      if (shouldUpdateExpensive) {
        stars.rotation.y += 0.0002
        stars.rotation.x += 0.0001
      }
      
      // Update tether cable to follow camera
      const newTetherPoints: THREE.Vector3[] = []
      for (let i = 0; i <= tetherSegments; i++) {
        const t = i / tetherSegments
        const x = THREE.MathUtils.lerp(camera.position.x, spaceshipGroup.position.x, t)
        const y = THREE.MathUtils.lerp(camera.position.y, spaceshipGroup.position.y, t) + Math.sin(t * Math.PI + time) * 1.5
        const z = THREE.MathUtils.lerp(camera.position.z, spaceshipGroup.position.z, t)
        newTetherPoints.push(new THREE.Vector3(x, y, z))
      }
      tetherCable.geometry.setFromPoints(newTetherPoints)
      
      // Animate spaceship gently
      spaceshipGroup.rotation.x = Math.sin(time * 0.3) * 0.05
      spaceshipGroup.rotation.y = Math.PI / 6 + Math.cos(time * 0.2) * 0.1

      // Update planets
      planets.forEach((planet) => {
        planet.mesh.position.y = planet.baseY + Math.sin(time * planet.floatSpeed + planet.floatOffset) * 0.5
        planet.mesh.rotation.x += planet.rotationSpeed.x
        planet.mesh.rotation.y += planet.rotationSpeed.y
        planet.mesh.rotation.z += planet.rotationSpeed.z
        
        // Update atmosphere and glow positions
        if (planet.atmosphere) {
          planet.atmosphere.position.copy(planet.mesh.position)
          planet.atmosphere.rotation.y += 0.001
        }
        if (planet.glow) {
          planet.glow.position.copy(planet.mesh.position)
        }
      })

      // Rocket animation
      if (isRocketFlying && rocketMesh) {
        rocketProgress += 0.015
        
        if (rocketProgress >= 1) {
          rocketProgress = 1
          rocketMesh.visible = false
          isRocketFlying = false
        } else {
          // Smooth movement with easing
          const easeProgress = 1 - Math.pow(1 - rocketProgress, 3)
          rocketMesh.position.lerpVectors(rocketStart, rocketEnd, easeProgress)
          rocketMesh.lookAt(rocketEnd)
          
          // Add wobble/rotation for realism
          rocketMesh.rotation.z = Math.sin(time * 20) * 0.1
          
          // Scale up slightly as it flies
          const scale = 0.8 + easeProgress * 0.4
          rocketMesh.scale.set(scale, scale, scale)
          
          // Particle trail effect
          if (Math.random() > 0.7) {
            const trailGeometry = new THREE.SphereGeometry(0.1, 8, 8)
            const trailMaterial = new THREE.MeshBasicMaterial({ 
              color: 0xff6600, 
              transparent: true, 
              opacity: 0.6 
            })
            const trail = new THREE.Mesh(trailGeometry, trailMaterial)
            trail.position.copy(rocketMesh.position)
            scene.add(trail)
            
            // Remove trail after a short time
            setTimeout(() => {
              scene.remove(trail)
              trailGeometry.dispose()
              trailMaterial.dispose()
            }, 500)
          }
        }
      }

      // Flight controls
      if (isPointerLocked) {
        // Mouse look
        yaw -= mouseX * 0.002
        pitch -= mouseY * 0.002
        pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch))
        mouseX = 0
        mouseY = 0

        // Apply rotation
        camera.rotation.order = 'YXZ'
        camera.rotation.y = yaw
        camera.rotation.x = pitch

        // Movement
        const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion)
        const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion)
        const up = new THREE.Vector3(0, 1, 0)

        if (keys.has('w') || keys.has('arrowup')) camera.position.add(forward.multiplyScalar(moveSpeed))
        if (keys.has('s') || keys.has('arrowdown')) camera.position.add(forward.multiplyScalar(-moveSpeed))
        if (keys.has('a') || keys.has('arrowleft')) camera.position.add(right.multiplyScalar(-moveSpeed))
        if (keys.has('d') || keys.has('arrowright')) camera.position.add(right.multiplyScalar(moveSpeed))
        if (keys.has(' ')) camera.position.add(up.multiplyScalar(moveSpeed))
        if (keys.has('shift')) camera.position.add(up.multiplyScalar(-moveSpeed))

        // Check planet targeting
        raycaster.setFromCamera(new THREE.Vector2(0, 0), camera)
        const intersects = raycaster.intersectObjects(planets.map((p) => p.mesh))
        if (intersects.length > 0) {
          const planet = intersects[0].object as THREE.Mesh
          setTargetPlanet(planet.userData.name)
          const material = planet.material as THREE.MeshStandardMaterial
          material.emissiveIntensity = 0.8
          
          // Enhanced glow effect on targeted planet
          planets.forEach((p) => {
            if (p.mesh === planet) {
              const scale = 1 + Math.sin(time * 3) * 0.05
              p.mesh.scale.set(scale, scale, scale)
              if (p.glow) {
                const glowMat = p.glow.material as THREE.MeshBasicMaterial
                glowMat.opacity = 0.3 + Math.sin(time * 3) * 0.1
                p.glow.scale.set(scale * 1.2, scale * 1.2, scale * 1.2)
              }
            } else {
              p.mesh.scale.set(1, 1, 1)
              const mat = p.mesh.material as THREE.MeshStandardMaterial
              mat.emissiveIntensity = 0.3
              if (p.glow) {
                const glowMat = p.glow.material as THREE.MeshBasicMaterial
                glowMat.opacity = 0.15
                p.glow.scale.set(1, 1, 1)
              }
            }
          })
        } else {
          setTargetPlanet(null)
          planets.forEach((p) => {
            p.mesh.scale.set(1, 1, 1)
            const material = p.mesh.material as THREE.MeshStandardMaterial
            material.emissiveIntensity = 0.3
            if (p.glow) {
              const glowMat = p.glow.material as THREE.MeshBasicMaterial
              glowMat.opacity = 0.15
              p.glow.scale.set(1, 1, 1)
            }
          })
        }
      } else {
        // Orbit camera when not flying
        const orbitRadius = 40
        const orbitSpeed = 0.1
        camera.position.x = Math.sin(time * orbitSpeed) * orbitRadius
        camera.position.z = Math.cos(time * orbitSpeed) * orbitRadius
        camera.position.y = 5 + Math.sin(time * 0.15) * 2
        camera.lookAt(0, 0, 0)
      }

      renderer.render(scene, camera)
    }

    // Start animation and remove loading state
    animate()
    setIsLoading(false)

    // Handle resize
    const onResize = () => {
      if (!mountRef.current) return
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight)
    }
    window.addEventListener('resize', onResize)

    // Cleanup
    return () => {
      document.removeEventListener('keydown', onKeyDownImmersive, true)
      document.removeEventListener('keyup', onKeyUpImmersive, true)
      document.removeEventListener('mousemove', onMouseMove)
      renderer.domElement.removeEventListener('click', onClick)
      document.removeEventListener('pointerlockchange', onPointerLockChange)
      document.removeEventListener('fullscreenchange', onFullscreenChange)
      window.removeEventListener('resize', onResize)
      if (document.pointerLockElement === renderer.domElement) {
        document.exitPointerLock()
      }
      if (document.fullscreenElement) {
        document.exitFullscreen()
      }
      renderer.dispose()
      mountRef.current?.removeChild(renderer.domElement)
    }
  }, [])

  // Fullscreen toggle handler
  const toggleFullscreen = async () => {
    if (!mountRef.current) return
    
    try {
      if (!document.fullscreenElement) {
        await mountRef.current.requestFullscreen()
        console.log('Entering fullscreen')
      } else {
        await document.exitFullscreen()
        console.log('Exiting fullscreen')
      }
    } catch (err) {
      console.error('Fullscreen error:', err)
    }
  }

  return (
    <section className="relative w-full h-full overflow-hidden bg-surface-base">
      {/* 3D scene canvas mount */}
      <div ref={mountRef} className="absolute inset-0 planetary-scene-bg" />

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-surface-base/90 backdrop-blur-sm">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full border border-brass-500/25 border-t-brass-500 motion-safe:animate-spin" />
            <p className="font-serif text-2xl text-primary">Charting the Lumenverse</p>
            <p className="mt-2 text-sm text-tertiary">Preparing your passage through knowledge</p>
          </div>
        </div>
      )}

      {/* Fullscreen toggle */}
      <button
        onClick={toggleFullscreen}
        className="group absolute right-4 top-4 z-30 inline-flex items-center gap-2 rounded-control border border-hairline bg-surface-overlay/80 px-4 py-2 shadow-soft-sm backdrop-blur-sm transition-colors hover:border-brass-700/60 hover:bg-surface-overlay focus-visible:shadow-focus focus-visible:outline-none"
        title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
      >
        {isFullscreen ? (
          <MinimizeIcon className="h-4 w-4 text-secondary transition-colors group-hover:text-primary" />
        ) : (
          <MaximizeIcon className="h-4 w-4 text-secondary transition-colors group-hover:text-primary" />
        )}
        <span className="text-sm font-medium text-secondary transition-colors group-hover:text-primary">
          {isFullscreen ? 'Exit' : 'Fullscreen'}
        </span>
      </button>

      {/* Flight-mode HUD */}
      {isFlying && (
        <>
          {/* Crosshair reticle */}
          <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
            <div className="relative">
              <div className="h-8 w-8 rounded-full border border-brass-400/60" />
              <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brass-400" />
              <div className="absolute left-0 top-1/2 h-px w-3 -translate-x-full -translate-y-1/2 bg-ivory-100/40" />
              <div className="absolute right-0 top-1/2 h-px w-3 -translate-y-1/2 translate-x-full bg-ivory-100/40" />
              <div className="absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 -translate-y-full bg-ivory-100/40" />
              <div className="absolute bottom-0 left-1/2 h-3 w-px -translate-x-1/2 translate-y-full bg-ivory-100/40" />
            </div>
          </div>

          {/* Flight status */}
          <div className="pointer-events-none absolute left-4 top-20 z-20">
            <div className="space-y-2 rounded-card border border-hairline bg-surface-overlay/85 px-4 py-3 shadow-soft backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brass-400 motion-safe:animate-pulse" />
                <span className="text-xs font-medium uppercase tracking-wider text-primary">Flight mode</span>
              </div>
              {isImmersiveMode && (
                <div className="flex items-center gap-2 text-secondary">
                  <ImmersiveIcon className="h-4 w-4" />
                  <span className="text-xs tracking-wide">Immersive</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-tertiary">
                <LinkIcon className="h-4 w-4" />
                <span className="text-xs tracking-wide">Tethered to ship</span>
              </div>
            </div>
          </div>

          {/* Target readout */}
          {targetPlanet && (
            <div className="pointer-events-none absolute right-4 top-20 z-20">
              <div className="inline-flex items-center gap-2 rounded-card border border-brass-500/30 bg-surface-overlay/85 px-4 py-2 shadow-soft backdrop-blur-sm">
                <TargetIcon className="h-4 w-4 text-brass-400" />
                <span className="text-sm tracking-wide text-brass-300">{targetPlanet}</span>
              </div>
            </div>
          )}
        </>
      )}

      {/* Controls reference — in-scene, always reachable */}
      <div className="pointer-events-none absolute inset-x-4 bottom-8 z-20 flex justify-center">
        <div className="w-full max-w-xl rounded-card border border-hairline bg-surface-overlay/80 px-6 py-4 text-center shadow-soft backdrop-blur-md">
          <p className="mb-3 text-sm text-secondary">
            <span className="font-medium text-primary">Click the scene</span> to enter flight, then aim at a planet to travel.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            {CONTROL_KEYS.map(({ k, label }) => (
              <span key={k} className="inline-flex items-center gap-2">
                <kbd className="rounded-control border border-hairline bg-surface-sunken px-2 py-1 font-mono text-xs text-secondary">
                  {k}
                </kbd>
                <span className="text-xs text-tertiary">{label}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

