import * as THREE from 'three';
import { useEffect, useRef, useState } from 'react';
import { useFrame, useLoader, useThree } from "@react-three/fiber";

export const PanoRoom = (props) => {
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
    


    console.log(THREE.EquirectangularReflectionMapping);

    const roomRef = useRef();
    const planeRef = useRef();
    const markRef = useRef();

    const pointerDownPlane = (e) => {
        if (e.button === 0) {
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
        markRef.current.scale.copy(new THREE.Vector3(1, 1, 1));
        if ((e.clientX === mousePos[0]) && (e.clientY === mousePos[1])) setTriggerTranslate(true);
    }

    const pointerHoverPlane = (e) => {
        setHoveredPlane(!hoveredPlane);
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

        if (triggerTranslate) {
            if (roomRef.current.position.distanceTo(targetPosition) >= 80) {
                roomRef.current.position.lerp(targetPosition, 0.04);
            }
            else {
                setMousePos([0, 0]);
                setTriggerTranslate(false);
                setRoomIndex( (roomIndex + 1) % 2 );
                roomRef.current.position.copy(new THREE.Vector3(0, 0, 0));
            }
            
        }
    })
    
    const markTexture = useLoader(THREE.TextureLoader, './mark.png');
    const markAOTexture = useLoader(THREE.TextureLoader, './mark-ao.png');
    
    return (
        <group>
            <mesh ref={roomRef}>
                <sphereGeometry args={[props.roomRadius, 60, 40]} />
                <meshBasicMaterial envMap={(roomIndex === 0)? texture1: texture2} side={THREE.BackSide} />
            </mesh>

            {/* hidden plane */}
            <mesh 
                ref={planeRef}
                position={[-300, -160, 0]} 
                rotation={[Math.PI / 2, 0, 0]} 
                visible={false} 
                onPointerDown={pointerDownPlane}
                onPointerUp={pointerUpPlane}
                onPointerEnter={pointerHoverPlane}
                onPointerLeave={pointerHoverPlane}
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
        </group>
    )
}