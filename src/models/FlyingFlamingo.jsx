import { Canvas } from '@react-three/fiber'
import { Flamingo } from '../models'
import { Suspense } from 'react'

export default function FlyingFlamingo() {
  return (
    <Canvas camera={{ position: [2, 1, 3], fov: 35 }} gl={{ antialias: true }} style={{ width: 150, height: 150 }}>
      <ambientLight intensity={1.2} />
      <directionalLight intensity={1} position={[2, 3, 2]} />

      <Suspense fallback={null}>
        <group scale={0.015} position={[0, -1, 0]}>
          <Flamingo />
        </group>
      </Suspense>
    </Canvas>
  )
}
