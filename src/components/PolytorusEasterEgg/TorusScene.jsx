import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows, Float } from '@react-three/drei'
import * as THREE from 'three'

/**
 * Custom geometry generator for twisted torus
 */
const createTwistedTorus = ({ radius, tube, radialSegments, tubularSegments, arc, twist }) => {
  const vertices = []
  const indices = []
  const uvs = []
  const vertex = new THREE.Vector3()

  for (let j = 0; j <= tubularSegments; j++) {
    const u = (j / tubularSegments) * arc
    const currentTwist = u * twist

    for (let i = 0; i <= radialSegments; i++) {
      const v = (i / radialSegments) * Math.PI * 2
      const effectiveV = v + currentTwist
      const cx = radius + tube * Math.cos(effectiveV)

      vertex.x = cx * Math.cos(u)
      vertex.y = cx * Math.sin(u)
      vertex.z = tube * Math.sin(effectiveV)

      vertices.push(vertex.x, vertex.y, vertex.z)
      uvs.push(j / tubularSegments)
      uvs.push(i / radialSegments)
    }
  }

  for (let j = 1; j <= tubularSegments; j++) {
    for (let i = 1; i <= radialSegments; i++) {
      const a = (radialSegments + 1) * j + i - 1
      const b = (radialSegments + 1) * (j - 1) + i - 1
      const c = (radialSegments + 1) * (j - 1) + i
      const d = (radialSegments + 1) * j + i

      indices.push(a, b, d)
      indices.push(b, c, d)
    }
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setIndex(indices)
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  geometry.computeVertexNormals()

  return geometry
}

/**
 * Animated polyhedron component
 */
function Polyhedron({ theme, geometry }) {
  const meshRef = useRef(null)
  const wireframeRef = useRef(null)

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2 * theme.animationSpeed
      meshRef.current.rotation.y += delta * 0.3 * theme.animationSpeed
    }
    if (wireframeRef.current && meshRef.current) {
      wireframeRef.current.rotation.x = meshRef.current.rotation.x
      wireframeRef.current.rotation.y = meshRef.current.rotation.y
    }
  })

  const twistedGeometry = useMemo(() => createTwistedTorus(geometry), [geometry])

  return (
    <group>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        {/* Main solid mesh */}
        <mesh ref={meshRef} geometry={twistedGeometry}>
          <meshStandardMaterial
            color={theme.meshColor}
            roughness={theme.roughness}
            metalness={theme.metalness}
            emissive={theme.emissive}
            emissiveIntensity={0.2}
            flatShading={true}
          />
        </mesh>

        {/* Wireframe overlay */}
        <mesh ref={wireframeRef} geometry={twistedGeometry} scale={[1.001, 1.001, 1.001]}>
          <meshBasicMaterial
            color={theme.wireframeColor}
            wireframe={true}
            transparent={true}
            opacity={0.3}
          />
        </mesh>
      </Float>
    </group>
  )
}

/**
 * Main scene component
 */
function TorusScene({ theme, geometry }) {
  return (
    <Canvas>
      <PerspectiveCamera makeDefault position={[0, 0, 35]} fov={50} />
      <color attach="background" args={[theme.backgroundColor]} />

      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[20, 20, 20]} intensity={1} color="#ffffff" />
      <pointLight position={[-20, -10, -10]} intensity={0.5} color={theme.meshColor} />
      <spotLight
        position={[0, 50, 0]}
        angle={0.3}
        penumbra={1}
        intensity={2}
        castShadow
      />

      {/* Environment for reflections */}
      <Environment preset="city" />

      {/* The polyhedron */}
      <Polyhedron theme={theme} geometry={geometry} />

      {/* Controls & shadows */}
      <OrbitControls enablePan={false} maxDistance={100} minDistance={10} />
      <ContactShadows
        position={[0, -15, 0]}
        opacity={0.6}
        scale={40}
        blur={2}
        far={10}
        resolution={256}
        color="#000000"
      />
    </Canvas>
  )
}

export default TorusScene
