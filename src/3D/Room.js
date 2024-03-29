import * as THREE from 'three';
import { useRef, useState } from 'react';
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { store } from '../store';
import {FaceBlur} from './FaceBlur';
import { PanoText } from './PanoText';
import { useSnapshot } from 'valtio';

export const PanoRoom = (props) => {
    const snap = useSnapshot(store);
    const [roomIndex, setRoomIndex] = useState(0);
    const [triggerTranslate, setTriggerTranslate] = useState(false);
    const [targetPosition, setTargetPosition] = useState(new THREE.Vector3());
    const [hoveredPlane, setHoveredPlane] = useState(false);
    const [mousePos, setMousePos] = useState([0, 0]);

    const {scene, gl, camera, raycaster} = useThree();

    const [texture1, texture2] = useLoader( THREE.TextureLoader, ['./pano/1.jpg', './pano/2.jpg']);
    
    if (texture1) {
        texture1.flipY = -1;
        texture1.mapping = THREE.EquirectangularReflectionMapping;
    }

    if (texture2) {
        texture2.flipY = -1;
        texture2.mapping = THREE.EquirectangularReflectionMapping;
    }

    const roomRef = useRef();
    const planeRef = useRef();
    const markRef = useRef();

    const pointerDownPlane = (e) => {
        if ((e.button === 0) && !snap.hoverButton) {
            raycaster.setFromCamera(
                {
                    x: (e.clientX / gl.domElement.clientWidth) * 2 - 1,
                    y: -(e.clientY / gl.domElement.clientHeight) * 2 + 1,
                },
                camera
            );
            
            let intersections = raycaster.intersectObject(scene, true);
            

            if (intersections.length > 0) {
                intersections.sort((a, b) => {
                    return a.distance - b.distance;
                })
                setTargetPosition(new THREE.Vector3(-intersections[0].point.x, 0, -intersections[0].point.z));
                setMousePos([e.clientX, e.clientY]);
            }

            if (markRef.current) {
                markRef.current.scale.copy(new THREE.Vector3(1.3, 1.3, 1.3));
            }
        }
    }

    const pointerUpPlane = (e) => {
        if (!snap.hoverButton) {
            if (markRef.current) markRef.current.scale.copy(new THREE.Vector3(1, 1, 1));
            if ((e.clientX === mousePos[0]) && (e.clientY === mousePos[1])) setTriggerTranslate(true);
        }
    }

    const pointerHoverPlane = (value) => {
        setHoveredPlane(value);
    }

    const pointerDownPano = (e) => {
        if ((e.button === 0) && (snap.setPanoText || snap.setBlurEffect)) {
            raycaster.setFromCamera(
                {
                    x: (e.clientX / gl.domElement.clientWidth) * 2 - 1,
                    y: -(e.clientY / gl.domElement.clientHeight) * 2 + 1,
                },
                camera
            );
            
            let intersections = raycaster.intersectObject(scene, true);

            if (intersections.length > 0) {
                if ((intersections[0].object.userData && intersections[0].object.userData === 'pano')) {
                    if (snap.setPanoText) {
                        store.panoTextPosition.push([intersections[0].point.x, intersections[0].point.y, intersections[0].point.z]);
                        store.setPanoText = false;
                        store.currentState = 'edit';
                    }
                    
                    if (snap.setBlurEffect && !snap.hoverButton) {
                        store.blurPositions.push([intersections[0].point.x, intersections[0].point.y, intersections[0].point.z]);
                        store.setBlurEffect = false;
                    }
                }
            }
        }
    }

    useFrame((state) => {
        if (hoveredPlane && markRef.current) {
            raycaster.setFromCamera(
                state.pointer,
                camera
            );
            let intersections = raycaster.intersectObjects([planeRef.current], true);
            if (intersections[0]) {
                markRef.current.position.copy(intersections[0].point);

                // Calculate angle
                let angle = new THREE.Vector3(0, 0, 1).angleTo(new THREE.Vector3(intersections[0].point.x, 0, intersections[0].point.z).normalize());
                markRef.current.rotation.y = -angle + Math.PI / 2;
            }
        }

        if (triggerTranslate && !snap.hoverButton) {
            if (roomRef.current.position.distanceTo(targetPosition) >= 120) {
                roomRef.current.position.lerp(targetPosition, 0.04);
                store.onBlur = true;
            }
            else {
                setMousePos([0, 0]);
                setTriggerTranslate(false);
                setRoomIndex( (roomIndex + 1) % 2 );
                roomRef.current.position.copy(new THREE.Vector3(0, 0, 0));
                store.onBlur = false;
            }
            
        }
    })
    
    const markTexture = useLoader(THREE.TextureLoader, './mark.png');
    const markAOTexture = useLoader(THREE.TextureLoader, './mark-ao.png');
    
    return (
        <group>
            <mesh ref={roomRef} 
                onPointerDown={pointerDownPano} 
                userData={'pano'}
            >
                <sphereGeometry args={[props.roomRadius, 60, 40]} />
                <meshBasicMaterial envMap={(roomIndex === 0)? texture1: texture2} side={THREE.BackSide} />

                {/* Face Blur Effect */}
                <FaceBlur />
            </mesh>

            {/* hidden plane */}
            <mesh 
                ref={planeRef}
                position={[-300, -160, 0]} 
                rotation={[Math.PI / 2, 0, 0]} 
                visible={false} 
                onPointerDown={pointerDownPlane}
                onPointerUp={pointerUpPlane}
                onPointerEnter={() => pointerHoverPlane(true)}
                onPointerLeave={() => pointerHoverPlane(false)}
                userData={'plane'}
            >
                <planeGeometry args={[800, 800]} />
                <meshBasicMaterial color={'red'} side={THREE.DoubleSide} />
            </mesh>

            {/*Target mark*/}
            {
                hoveredPlane && 
                <group ref={markRef}>
                    <mesh
                        rotation={[Math.PI / 2, Math.PI, 0]}
                        geometry={new THREE.PlaneGeometry(60, 60, 60)}
                        material={new THREE.MeshBasicMaterial({
                            map: markTexture,
                            alphaMap: markAOTexture,
                            transparent: true,
                        })}
                    />
                </group>
            }

            {/* Pano Text */}
            <PanoText />
        </group>
    )
}