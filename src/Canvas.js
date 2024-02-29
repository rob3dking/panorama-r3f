import * as THREE from 'three';
import { Canvas } from '@react-three/fiber'
import { Environment, OrbitControls, useTexture } from '@react-three/drei'

export const App = ({ position = [0, 1, 2.5], fov = 25 }) => (
  <Canvas shadows camera={{ position, fov }} gl={{ preserveDrawingBuffer: true }} eventSource={document.getElementById('root')} eventPrefix="client">
    <ambientLight intensity={0.5} />
    <Environment preset='city' />
    <PanoRoom />
    <OrbitControls enableZoom={false} enablePan={false} enableDamping dampingFactor={0.2}/>
  </Canvas>
)

const PanoRoom = () => {
  const texture = useTexture('./image.jpg');
  texture.mapping = THREE.EquirectangularReflectionMapping;
  texture.flipY = -1;
  return (
    <mesh>
      <sphereGeometry args={[800, 60, 40]} />
      <meshBasicMaterial envMap={texture} side={THREE.BackSide} />
    </mesh>
  )
}


