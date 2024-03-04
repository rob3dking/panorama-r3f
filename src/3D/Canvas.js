import { Canvas } from '@react-three/fiber'
import { Environment, Stats, useTexture } from '@react-three/drei'
import { Controls } from './CameraControls';
import { PanoRoom } from './Room';
import { PostProcessing } from './PostProcessing';

export const App = () => {
  let roomRadius = 500;

  return (
    <Canvas shadows eventSource={document.getElementById('root')} eventPrefix="client">
      <ambientLight intensity={0.2} />
      <Environment preset='city' />
      <Controls roomRadius={roomRadius}> 
        <PanoRoom roomRadius={roomRadius}/>
      </Controls>
      <PostProcessing />
      <Stats />
    </Canvas>
  ) 
}

useTexture.preload('./mark.png');
useTexture.preload('./mark-ao.png');
useTexture.preload('./pano/1.jpg');
useTexture.preload('./pano/2.jpg');