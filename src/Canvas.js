import { Canvas } from '@react-three/fiber'
import { Environment, Stats, useTexture } from '@react-three/drei'
import { Controls } from './CameraControls';
import { PanoRoom } from './Room';

export const App = () => {
  let roomRadius = 500;

  return (
    <Canvas shadows eventSource={document.getElementById('root')} eventPrefix="client">
      <ambientLight intensity={0.5} />
      <Environment preset='city' />
      <Controls roomRadius={roomRadius}> 
        <PanoRoom roomRadius={roomRadius}/>
      </Controls>
      <Stats />
    </Canvas>
  ) 
}

useTexture.preload('./mark.png');
useTexture.preload('./mark-ao.png');