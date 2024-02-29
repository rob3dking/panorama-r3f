import * as THREE from 'three';
import { Canvas } from '@react-three/fiber'
import { Environment, OrbitControls } from '@react-three/drei'

export const App = ({ position = [0, 1, 2.5], fov = 25 }) => (
  <Canvas shadows camera={{ position, fov }} gl={{ preserveDrawingBuffer: true }} eventSource={document.getElementById('root')} eventPrefix="client">
    <ambientLight intensity={0.5} />
    <Environment preset='city' />
    <Model />
    <OrbitControls />
  </Canvas>
)

const Model = () => {
  return (
    <mesh
      geometry={new THREE.BoxGeometry(1, 1, 1)}
      material={new THREE.MeshStandardMaterial({ color: 'red' })}
    />
  )
}


