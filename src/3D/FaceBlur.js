import { Decal, MeshTransmissionMaterial } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { useSnapshot } from 'valtio';
import { store } from '../store';

export const FaceBlur = () => {
    const snap = useSnapshot(store);
    console.log(snap.blurPositions);
    const texture = useLoader( THREE.TextureLoader, './decal.png')
    return <>
        {
            snap.blurPositions.length > 0 &&
            snap.blurPositions.map((position, index) => {
                return <Decal
                    // debug
                    key={'positions' + index + Date.now()}
                    position={[position[0], position[1], position[2]]}
                    rotation={[Math.PI / 2, 0, 0]}
                    scale={snap.blurSize[index]}
                >
                    <MeshTransmissionMaterial 
                        map={texture}
                        csamples={16} 
                        resolution={128} 
                        anisotropicBlur={snap.blurDensity[index]} 
                        thickness={snap.blurThickness[index]} 
                        roughness={snap.blurRoughness[index]} 
                        toneMapped={true} 
                        side={THREE.DoubleSide} 
                        polygonOffset={true} 
                        polygonOffsetFactor={-1}
                    />
                </Decal>
            })
        }
    </>
}