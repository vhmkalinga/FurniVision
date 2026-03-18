import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useRef, Suspense, useMemo, useState, useEffect } from 'react';
import { getRoomPolygon, applyPositionConstraints } from '../../utils/roomGeometry';

// Component to load and display a GLB model
function GLBModel({ url, scale, color }) {
    const { scene } = useGLTF(url);
    const clonedScene = useMemo(() => scene.clone(), [scene]);

    // Apply specific color overrides and enable shadows
    useMemo(() => {
        clonedScene.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                
                // If a user selected color is provided, clone the material and colorize it
                if (color) {
                    if (Array.isArray(child.material)) {
                        child.material = child.material.map(mat => {
                            const newMat = mat.clone();
                            newMat.color.set(color);
                            return newMat;
                        });
                    } else if (child.material) {
                        child.material = child.material.clone();
                        child.material.color.set(color);
                    }
                }
            }
        });
    }, [clonedScene, color]);

    // Calculate stable scale and position offset
    const { modelScale, positionOffset } = useMemo(() => {
        const box = new THREE.Box3().setFromObject(scene);
        const originalSize = box.getSize(new THREE.Vector3());
        const originalCenter = box.getCenter(new THREE.Vector3());
        
        const maxDim = Math.max(originalSize.x, originalSize.y, originalSize.z);
        let s = 1;
        if (maxDim > 0) {
            const targetSize = Math.max(scale[0], scale[1], scale[2]);
            s = targetSize / maxDim;
        }

        // Offset to center the bounding box exactly inside the procedural wireframe
        const offsetX = -originalCenter.x * s;
        const offsetZ = -originalCenter.z * s;
        // Anchor the bottom of the raw model geometry perfectly to -h/2
        const originalBottom = originalCenter.y - originalSize.y / 2;
        const offsetY = -originalBottom * s - scale[1] / 2;

        return { modelScale: s, positionOffset: [offsetX, offsetY, offsetZ] };
    }, [scene, scale[0], scale[1], scale[2]]);

    return (
        <group position={positionOffset} scale={modelScale}>
            <primitive object={clonedScene} />
        </group>
    );
}

function FurnitureModel({ item, index, isSelected, activeDragItem, setActiveDragItem, onUpdateFurniture, onSelectFurniture, roomConfig, hiddenWall }) {
    const { modelType, dimensions, position, rotation, scale, color, model } = item;
    const w = dimensions.width * scale.x;
    const h = dimensions.height * scale.y;
    const d = dimensions.depth * scale.z;

    const groupRef = useRef();
    const isDragging = activeDragItem === index;

    const elevation = (modelType === 'window') ? 1.0 : 0;

    // All hooks must run before any conditional return
    const planeRef = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), h/2 + elevation));
    const intersectPoint = useRef(new THREE.Vector3());
    const lastMoveTime = useRef(0);

    useEffect(() => {
        planeRef.current.constant = h/2 + elevation;
    }, [h, elevation]);

    // Calculate whether this door/window sits on the hidden wall
    const isOnHiddenWall = useMemo(() => {
        if (!hiddenWall || (modelType !== 'door' && modelType !== 'window')) return false;
        const { p1, p2 } = hiddenWall;
        const cx = position.x + w / 2;
        const cz = position.z + d / 2;
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const lenSq = dx * dx + dy * dy;
        if (lenSq === 0) return false;
        const dist = Math.abs(dy * cx - dx * cz + p2.x * p1.y - p2.y * p1.x) / Math.sqrt(lenSq);
        return dist < 0.2;
    }, [hiddenWall, modelType, position.x, position.z, w, d]);

    // Initial static position
    const pos = [position.x + w / 2, h / 2 + elevation, position.z + d / 2];
    const rot = [0, (rotation * Math.PI) / 180, 0];

    const handlePointerDown = (e) => {
        e.stopPropagation();
        e.target.setPointerCapture(e.pointerId);
        onSelectFurniture(index);
        setActiveDragItem(index);
    };

    const handlePointerMove = (e) => {
        if (!isDragging || !groupRef.current) return;
        e.stopPropagation();
        const now = performance.now();
        if (now - lastMoveTime.current < 12) return;
        lastMoveTime.current = now;
        if (e.ray.intersectPlane(planeRef.current, intersectPoint.current)) {
            const constrained = applyPositionConstraints(intersectPoint.current.x - w / 2, intersectPoint.current.z - d / 2, item, roomConfig);
            groupRef.current.position.set(constrained.x + w/2, h/2 + elevation, constrained.z + d/2);
            if (constrained.rotation !== undefined) {
                groupRef.current.rotation.set(0, (constrained.rotation * Math.PI) / 180, 0);
            }
        }
    };

    const handlePointerUp = (e) => {
        e.stopPropagation();
        if (e.target.hasPointerCapture(e.pointerId)) e.target.releasePointerCapture(e.pointerId);
        if (isDragging) {
            setActiveDragItem(null);
            if (groupRef.current) {
                const finalX = groupRef.current.position.x - w/2;
                const finalZ = groupRef.current.position.z - d/2;
                const finalRot = groupRef.current.rotation.y * (180 / Math.PI);
                const movedX = Math.abs(finalX - position.x);
                const movedZ = Math.abs(finalZ - position.z);
                if (movedX > 0.01 || movedZ > 0.01 || Math.abs(finalRot - rotation) > 0.1) {
                    onUpdateFurniture(index, { position: { x: finalX, y: 0, z: finalZ }, rotation: finalRot }, true);
                }
            }
        }
    };

    // Conditional render AFTER all hooks
    if (isOnHiddenWall) return null;

    return (
        <group ref={groupRef} position={pos} rotation={rot} 
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
        >
            {model ? (
                <Suspense fallback={
                    <mesh castShadow>
                        <boxGeometry args={[w, h, d]} />
                        <meshStandardMaterial color={color} roughness={0.6} transparent opacity={0.3} />
                    </mesh>
                }>
                    <GLBModel url={model} scale={[w, h, d]} color={color} />
                </Suspense>
            ) : (
                renderProceduralModel(modelType, w, h, d, color)
            )}
            {isSelected && !isDragging && (
                <mesh>
                    <boxGeometry args={[w + 0.05, h + 0.05, d + 0.05]} />
                    <meshBasicMaterial color="#6366F1" wireframe transparent opacity={0.4} />
                </mesh>
            )}
        </group>
    );
}

function renderProceduralModel(modelType, w, h, d, color) {
    switch (modelType) {
        case 'sofa':
            return (
                <group>
                    <mesh position={[0, -h * 0.15, 0]} castShadow>
                        <boxGeometry args={[w, h * 0.4, d]} />
                        <meshStandardMaterial color={color} roughness={0.8} />
                    </mesh>
                    <mesh position={[0, h * 0.15, -d * 0.35]} castShadow>
                        <boxGeometry args={[w, h * 0.6, d * 0.25]} />
                        <meshStandardMaterial color={color} roughness={0.8} />
                    </mesh>
                    <mesh position={[-w * 0.45, -h * 0.05, 0]} castShadow>
                        <boxGeometry args={[w * 0.08, h * 0.5, d * 0.85]} />
                        <meshStandardMaterial color={color} roughness={0.8} />
                    </mesh>
                    <mesh position={[w * 0.45, -h * 0.05, 0]} castShadow>
                        <boxGeometry args={[w * 0.08, h * 0.5, d * 0.85]} />
                        <meshStandardMaterial color={color} roughness={0.8} />
                    </mesh>
                </group>
            );

        case 'table':
            return (
                <group>
                    <mesh position={[0, h * 0.45, 0]} castShadow>
                        <boxGeometry args={[w, h * 0.06, d]} />
                        <meshStandardMaterial color={color} roughness={0.5} />
                    </mesh>
                    {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([lx, lz], i) => (
                        <mesh key={i} position={[lx * (w * 0.42), h * 0.2, lz * (d * 0.42)]} castShadow>
                            <cylinderGeometry args={[0.025, 0.025, h * 0.88, 8]} />
                            <meshStandardMaterial color={color} roughness={0.4} />
                        </mesh>
                    ))}
                </group>
            );

        case 'chair':
            return (
                <group>
                    <mesh position={[0, h * 0.2, 0]} castShadow>
                        <boxGeometry args={[w * 0.9, h * 0.06, d * 0.85]} />
                        <meshStandardMaterial color={color} roughness={0.6} />
                    </mesh>
                    <mesh position={[0, h * 0.55, -d * 0.38]} castShadow>
                        <boxGeometry args={[w * 0.85, h * 0.55, d * 0.06]} />
                        <meshStandardMaterial color={color} roughness={0.6} />
                    </mesh>
                    {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([lx, lz], i) => (
                        <mesh key={i} position={[lx * (w * 0.35), h * 0.08, lz * (d * 0.35)]} castShadow>
                            <cylinderGeometry args={[0.02, 0.02, h * 0.4, 8]} />
                            <meshStandardMaterial color={color} roughness={0.3} metalness={0.5} />
                        </mesh>
                    ))}
                </group>
            );

        case 'bed':
            return (
                <group>
                    <mesh position={[0, h * 0.15, 0]} castShadow>
                        <boxGeometry args={[w, h * 0.3, d]} />
                        <meshStandardMaterial color="#E8E0D8" roughness={0.9} />
                    </mesh>
                    <mesh position={[0, -h * 0.1, 0]} castShadow>
                        <boxGeometry args={[w * 1.05, h * 0.2, d * 1.02]} />
                        <meshStandardMaterial color={color} roughness={0.6} />
                    </mesh>
                    <mesh position={[0, h * 0.45, -d * 0.48]} castShadow>
                        <boxGeometry args={[w * 1.05, h * 0.8, d * 0.05]} />
                        <meshStandardMaterial color={color} roughness={0.6} />
                    </mesh>
                </group>
            );

        case 'bookshelf':
            return (
                <group>
                    <mesh position={[0, 0, 0]} castShadow>
                        <boxGeometry args={[w, h, d]} />
                        <meshStandardMaterial color={color} roughness={0.6} />
                    </mesh>
                    {[0.3, 0, -0.3].map((yOff, i) => (
                        <mesh key={i} position={[0, h * yOff, d * 0.02]} castShadow>
                            <boxGeometry args={[w * 0.9, h * 0.02, d * 0.95]} />
                            <meshStandardMaterial color={color} roughness={0.5} />
                        </mesh>
                    ))}
                </group>
            );

        case 'lamp':
            return (
                <group>
                    <mesh position={[0, -h * 0.45, 0]} castShadow>
                        <cylinderGeometry args={[w * 0.4, w * 0.5, h * 0.05, 16]} />
                        <meshStandardMaterial color={color} roughness={0.3} metalness={0.7} />
                    </mesh>
                    <mesh position={[0, 0, 0]} castShadow>
                        <cylinderGeometry args={[0.015, 0.015, h * 0.85, 8]} />
                        <meshStandardMaterial color={color} roughness={0.3} metalness={0.7} />
                    </mesh>
                    <mesh position={[0, h * 0.38, 0]}>
                        <cylinderGeometry args={[w * 0.15, w * 0.4, h * 0.2, 16, 1, true]} />
                        <meshStandardMaterial color="#FFF8E7" roughness={0.9} side={THREE.DoubleSide} />
                    </mesh>
                    <pointLight position={[0, h * 0.35, 0]} intensity={0.5} color="#FFF3CD" distance={3} />
                </group>
            );

        case 'desk':
            return (
                <group>
                    <mesh position={[0, h * 0.45, 0]} castShadow>
                        <boxGeometry args={[w, h * 0.05, d]} />
                        <meshStandardMaterial color={color} roughness={0.5} />
                    </mesh>
                    <mesh position={[-w * 0.45, h * 0.05, 0]} castShadow>
                        <boxGeometry args={[w * 0.04, h * 0.85, d * 0.9]} />
                        <meshStandardMaterial color={color} roughness={0.5} />
                    </mesh>
                    <mesh position={[w * 0.45, h * 0.05, 0]} castShadow>
                        <boxGeometry args={[w * 0.04, h * 0.85, d * 0.9]} />
                        <meshStandardMaterial color={color} roughness={0.5} />
                    </mesh>
                </group>
            );

        default:
            return (
                <mesh castShadow>
                    <boxGeometry args={[w, h, d]} />
                    <meshStandardMaterial color={color} roughness={0.6} />
                </mesh>
            );
    }
}

function Room({ config, onHiddenWall }) {
    const { width, length, height, shape, wallColor, floorColor } = config;
    const polygon = useMemo(() => getRoomPolygon(shape || 'rectangular', width, length), [shape, width, length]);
    const { camera } = useThree();

    // Create Floor Shape
    const floorShape = useMemo(() => {
        const s = new THREE.Shape();
        const reversed = [...polygon].reverse();
        reversed.forEach((pt, idx) => {
            if (idx === 0) s.moveTo(pt.x, -pt.y);
            else s.lineTo(pt.x, -pt.y);
        });
        s.closePath();
        return s;
    }, [polygon]);

    // Generate Wall Segments with outward normals
    const walls = useMemo(() => {
        const segments = [];
        for (let i = 0; i < polygon.length; i++) {
            const p1 = polygon[i];
            const p2 = polygon[(i + 1) % polygon.length];
            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const mx = (p1.x + p2.x) / 2;
            const my = (p1.y + p2.y) / 2;
            const angle = Math.atan2(dy, dx);
            // Outward normal for a clockwise polygon: (dy, -dx) normalised
            const nx = dy / dist;
            const nz = -dx / dist;
            segments.push({ width: dist, x: mx, z: my, rotation: angle, nx, nz, p1, p2 });
        }
        return segments;
    }, [polygon]);

    // Track which wall index is currently hidden
    const hiddenIdxRef = useRef(-1);
    const [hiddenIdx, setHiddenIdx] = useState(-1);
    // Pending wall ref — written by useFrame, flushed to React state by useEffect
    const pendingWallRef = useRef(null);

    // Every frame, find the wall whose outward normal most faces the camera
    useFrame(() => {
        const cx = width / 2;
        const cz = length / 2;
        let maxDot = -Infinity;
        let bestIdx = -1;
        for (let i = 0; i < walls.length; i++) {
            const wall = walls[i];
            const dot = wall.nx * (camera.position.x - cx) + wall.nz * (camera.position.z - cz);
            if (dot > maxDot) { maxDot = dot; bestIdx = i; }
        }
        if (bestIdx !== hiddenIdxRef.current) {
            hiddenIdxRef.current = bestIdx;
            pendingWallRef.current = bestIdx >= 0 ? walls[bestIdx] : null;
        }
    });

    // Flush pending wall changes to React state outside the Three.js render tick
    useEffect(() => {
        const id = setInterval(() => {
            if (pendingWallRef.current !== undefined) {
                const w = pendingWallRef.current;
                pendingWallRef.current = undefined;
                setHiddenIdx(hiddenIdxRef.current);
                onHiddenWall(w ?? null);
            }
        }, 80);
        return () => clearInterval(id);
    }, [onHiddenWall]);


    return (
        <group>
            {/* Floor */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <shapeGeometry args={[floorShape]} />
                <meshStandardMaterial color={floorColor} roughness={0.8} />
            </mesh>

            {/* Walls — dynamically skip the one most facing the camera */}
            {walls.map((wall, i) => {
                if (i === hiddenIdx) return null;
                return (
                    <group key={i} position={[wall.x, height / 2, wall.z]} rotation={[0, -wall.rotation, 0]}>
                        <mesh receiveShadow>
                            <planeGeometry args={[wall.width, height]} />
                            <meshStandardMaterial color={wallColor} roughness={0.9} side={THREE.FrontSide} />
                        </mesh>
                        {/* Baseboard */}
                        <mesh position={[0, -height / 2 + 0.04, 0.01]}>
                            <boxGeometry args={[wall.width, 0.08, 0.02]} />
                            <meshStandardMaterial color="#E5E7EB" roughness={0.5} />
                        </mesh>
                    </group>
                );
            })}
        </group>
    );
}

export default function Viewer3D({ roomConfig, furniture, selectedFurniture, onSelectFurniture, onUpdateFurniture }) {
    const [activeDragItem, setActiveDragItem] = useState(null);
    const [hiddenWall, setHiddenWall] = useState(null);

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <Canvas
                shadows={{ type: THREE.PCFShadowMap }}
                camera={{ position: [roomConfig.width * 1.2, roomConfig.height * 1.5, roomConfig.length * 1.5], fov: 50 }}
                gl={{ antialias: false, powerPreference: 'high-performance' }}
            >
                <ambientLight intensity={0.4} />
                <directionalLight
                    position={[roomConfig.width, roomConfig.height * 2, roomConfig.length]}
                    intensity={1}
                    castShadow={activeDragItem === null}
                    shadow-mapSize-width={1024}
                    shadow-mapSize-height={1024}
                    shadow-camera-far={40}
                    shadow-camera-left={-10}
                    shadow-camera-right={10}
                    shadow-camera-top={10}
                    shadow-camera-bottom={-10}
                />
                <directionalLight position={[-3, 5, -3]} intensity={0.3} />

                <Room config={roomConfig} onHiddenWall={setHiddenWall} />

                <Suspense fallback={null}>
                    {furniture.map((item, index) => (
                        <FurnitureModel
                            key={item.id || index}
                            item={item}
                            index={index}
                            isSelected={selectedFurniture === index}
                            activeDragItem={activeDragItem}
                            setActiveDragItem={setActiveDragItem}
                            onSelectFurniture={onSelectFurniture}
                            onUpdateFurniture={onUpdateFurniture}
                            roomConfig={roomConfig}
                            hiddenWall={hiddenWall}
                        />
                    ))}
                </Suspense>

                <OrbitControls
                    makeDefault
                    enabled={activeDragItem === null}
                    target={[roomConfig.width / 2, roomConfig.height * 0.3, roomConfig.length / 2]}
                    maxPolarAngle={Math.PI / 2}
                    minDistance={2}
                    maxDistance={20}
                />

                <color attach="background" args={['#E8ECF0']} />
            </Canvas>
        </div>
    );
}
