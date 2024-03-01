import * as THREE from 'three';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { Environment, Stats } from '@react-three/drei'
import { useEffect } from 'react';

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

const PanoRoom = (props) => {
  const texture = useLoader( THREE.TextureLoader, './image.jpg');
  texture.flipY = -1;
  texture.mapping = THREE.EquirectangularReflectionMapping;
  return <mesh>
      <sphereGeometry args={[props.roomRadius, 60, 40]} />
      <meshBasicMaterial envMap={texture} side={THREE.BackSide} />
    </mesh>
}

const Controls = (props) => {
  // Flags
  let wheelSpeed = 0.02;
  let interacting = false;
  let donwX = 0; 
  let downY = 0;
  let downlon = 0;
  let downlat = 0;
  let lon = 0, lat = 0,  angleX = 0, angleY = 0;
  
  const { camera } = useThree();

  // Pointer Down
  const onPointerDown = ( e ) => {
    if ( e.isPrimary === false ) return;
    interacting = true;
    donwX = e.clientX;
    downY = e.clientY;
    downlon = lon;
    downlat = lat;
    window.addEventListener( 'pointermove', onPointerMove );
    window.addEventListener( 'pointerup', onPointerUp );
  }

  // Pointer Move
  const onPointerMove = ( e ) => {
    if ( e.isPrimary === false ) return;
    lon = ( donwX - e.clientX ) * 0.1 + downlon;
    lat = ( e.clientY - downY ) * 0.1 + downlat;
  }

  // Pointer Up
  const onPointerUp = (e) => {
    if ( e.isPrimary === false ) return;
    interacting = false;
    window.removeEventListener( 'pointermove', onPointerMove );
    window.removeEventListener( 'pointerup', onPointerUp );
  }

  // PointerWheel
  const PointerWheel = ( e ) => {
    const fov = camera.fov + e.deltaY * wheelSpeed;
    camera.fov = THREE.MathUtils.clamp( fov, 5, 75 );
    camera.updateProjectionMatrix();
  }

  useEffect(() => {
    window.addEventListener( 'pointerdown', onPointerDown );
    window.addEventListener( 'wheel', PointerWheel );

    return () => {
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('wheel', PointerWheel);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    } 
  }, [])

  useFrame((state) => {
    lat = Math.max( - 85, Math.min( 85, lat ) );
    angleX = THREE.MathUtils.degToRad( 90 - lat );
    angleY = THREE.MathUtils.degToRad( lon );
    const x = props.roomRadius * Math.sin( angleX ) * Math.cos( angleY );
    const y = props.roomRadius * Math.cos( angleX );
    const z = props.roomRadius * Math.sin( angleX ) * Math.sin( angleY );
    state.camera.lookAt( x, y, z );
  })

  return <group>
    {props.children}
  </group>
}
