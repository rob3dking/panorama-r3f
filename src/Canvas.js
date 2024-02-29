import * as THREE from 'three';
import { Canvas, useLoader } from '@react-three/fiber'
import { Environment, OrbitControls } from '@react-three/drei'

export const App = () => (
  
  <Canvas frameloop="demand" shadows eventSource={document.getElementById('root')} eventPrefix="client">
    <ambientLight intensity={0.5} />
    <Environment preset='city' />
    <PanoRoom />
    <OrbitControls enableZoom={false} enablePan={false} enableDamping dampingFactor={0.2}/>
  </Canvas>
)

const PanoRoom = () => {
  const texture = useLoader( THREE.TextureLoader, './image.jpg');
  texture.flipY = -1;
  texture.mapping = THREE.EquirectangularReflectionMapping;
  return (
    <mesh>
      <sphereGeometry args={[500, 60, 40]} />
      <meshBasicMaterial envMap={texture} side={THREE.BackSide} />
    </mesh>
  )
}
