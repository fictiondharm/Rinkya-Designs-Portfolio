import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Sky, Stars, Text, Billboard,
  Sparkles, Float
} from "@react-three/drei";
import * as THREE from "three";
import MusicPlayer from "./MusicPlayer";
import WorksPanel from "../components/WorksPanel";
import BookingCalendar from "../components/BookingCalendar";

/* ─────────────────────────────────────────────
   ZONES — SOFT ROSE CLAY PALETTE (Feminine)
   IDs now match signboard labels exactly.
───────────────────────────────────────────── */
const ZONES = [
  { id:"illustrations",   label:"Illustrations",    emoji:"🎨", accent:"#D4829A",
    x:-30, z:-24, roofHex:0xD4829A, wallHex:0xFAEEF2,
    service:"Hand-drawn Art · Character Design · Digital Illustration" },
  { id:"branding",        label:"Branding & Logos",  emoji:"✨", accent:"#E4B5BA",
    x:-30, z:24,  roofHex:0xE8B4A0, wallHex:0xFDF5F0,
    service:"Brand Identity · Logo Design · Sticker Design" },
  { id:"3d-spatial",      label:"3D & Spatial",      emoji:"🌸", accent:"#C9A0C8",
    x:30,  z:-24, roofHex:0xC9A0C8, wallHex:0xF5EDF8,
    service:"3D Modeling · Product Rendering · Concept Art" },
  { id:"motion-design",   label:"Motion Design",     emoji:"🎬", accent:"#E8A87C",
    x:40,  z:0,  roofHex:0xE8A87C, wallHex:0xFDF3EC,
    service:"Video Editing · Motion Graphics · Animation" },
  { id:"poster-design",   label:"Poster Design",     emoji:"🖨️", accent:"#9BB08F",
    x:0,   z:-36, roofHex:0x9BB08F, wallHex:0xEDF3EA,
    service:"Poster Design · Print Design · Surface Design" },
  { id:"toolkit",         label:"Toolkit",           emoji:"⚙️", accent:"#C7AFA0",
    x:0,   z:36,  roofHex:0xC4A882, wallHex:0xF5EFE6,
    service:"Adobe Suite · Maya · Blender · Figma · Procreate" },
  { id:"contact",         label:"Contact Me",        emoji:"✉️", accent:"#C98B8B",
    x:30,  z:24,  roofHex:0xC98B8B, wallHex:0xF8EEEE,
    service:"Book a Discovery Call · Collaborate · Get in Touch" },
];

/* ─────────────────────────────────────────────
   INPUT MANAGER
───────────────────────────────────────────── */
const keys = {};
window.addEventListener("keydown", e => { keys[e.key] = true; });
window.addEventListener("keyup",   e => { keys[e.key] = false; });

/* ─────────────────────────────────────────────
   CAMERA CONTROLLER
───────────────────────────────────────────── */
function CameraController({ onIntroEnd }) {
  const { camera, size } = useThree();

  useEffect(() => {
    const aspect = size.width / size.height;
    let targetZ = 42;
    if (aspect < 1.2) {
      targetZ = 42 + ((1.2 - aspect) * 35);
    }
    camera.position.set(0, 22, targetZ);
    camera.lookAt(0, 0, 4);
    camera.updateProjectionMatrix();
    onIntroEnd();
  }, [camera, size.width, size.height, onIntroEnd]);

  return null;
}

function MovementSystem() {
  return null;
}

/* ─────────────────────────────────────────────
   CHARACTER
───────────────────────────────────────────── */
function Character({ charRef }) {
  const upperBodyRef = useRef();
  const headRef = useRef();
  const armLRef = useRef();
  const armRRef = useRef();

  useFrame(({ clock, pointer }) => {
    const t = clock.getElapsedTime();
    if (upperBodyRef.current) {
      upperBodyRef.current.position.y = Math.sin(t * 1.5) * 0.02;
      upperBodyRef.current.rotation.x = Math.sin(t * 1.5) * 0.01;
      const targetTorsoY = pointer.x * 0.25;
      upperBodyRef.current.rotation.y += (targetTorsoY - upperBodyRef.current.rotation.y) * 0.05;
    }
    if (headRef.current) {
      const targetRotX = pointer.y * -0.4;
      const targetRotY = pointer.x * 0.6;
      const targetRotZ = pointer.x * -0.15;
      headRef.current.rotation.x += (targetRotX - headRef.current.rotation.x) * 0.1;
      headRef.current.rotation.y += (targetRotY - headRef.current.rotation.y) * 0.1;
      headRef.current.rotation.z += (targetRotZ - headRef.current.rotation.z) * 0.1;
    }
    if (armLRef.current) armLRef.current.rotation.z = Math.sin(t * 1.2) * 0.02 + 0.1;
    if (armRRef.current) armRRef.current.rotation.z = Math.cos(t * 1.2) * 0.02 - 0.1;
  });

  const S = 2.5;

  return (
    <group ref={charRef} position={[-8, 0.8, 7]} rotation={[0, -0.15, 0]} scale={S}>
      {/* Legs */}
      <group position={[-0.22, 0.92, 0]}>
        <mesh position={[0, -0.46, 0]} castShadow><boxGeometry args={[0.34, 0.92, 0.34]} /><meshStandardMaterial color="#8B3A6A" roughness={0.8} /></mesh>
        <mesh position={[0, -0.89, 0.06]}><boxGeometry args={[0.36, 0.2, 0.46]} /><meshStandardMaterial color="#241008" roughness={0.9} /></mesh>
      </group>
      <group position={[0.22, 0.92, 0]}>
        <mesh position={[0, -0.46, 0]} castShadow><boxGeometry args={[0.34, 0.92, 0.34]} /><meshStandardMaterial color="#8B3A6A" roughness={0.8} /></mesh>
        <mesh position={[0, -0.89, 0.06]}><boxGeometry args={[0.36, 0.2, 0.46]} /><meshStandardMaterial color="#241008" roughness={0.9} /></mesh>
      </group>
      {/* Skirt */}
      <mesh position={[0, 1.07, 0]} castShadow>
        <cylinderGeometry args={[0.58, 0.72, 0.62, 12]} />
        <meshStandardMaterial color="#F093B2" roughness={0.8} />
      </mesh>
      {/* Upper Body */}
      <group ref={upperBodyRef}>
        <mesh position={[0, 1.6, 0]} castShadow><boxGeometry args={[0.74, 0.88, 0.46]} /><meshStandardMaterial color="#D4558A" roughness={0.8} /></mesh>
        <mesh position={[0, 1.95, 0.22]}><boxGeometry args={[0.28, 0.14, 0.08]} /><meshStandardMaterial color="#FFFFFF" roughness={0.8} /></mesh>
        {/* Left Arm */}
        <group ref={armLRef} position={[-0.54, 2.04, 0]} rotation={[0.1, 0, 0]}>
          <mesh position={[0, -0.41, 0]} castShadow><boxGeometry args={[0.26, 0.82, 0.26]} /><meshStandardMaterial color="#F0A898" roughness={0.6} /></mesh>
          <mesh position={[0, -0.84, 0]}><boxGeometry args={[0.24, 0.24, 0.24]} /><meshStandardMaterial color="#F5ADA0" roughness={0.6} /></mesh>
          <mesh position={[0, -0.97, 0.1]} rotation={[-0.3, 0, 0]}><boxGeometry args={[0.34, 0.06, 0.28]} /><meshStandardMaterial color="#FDFBF9" roughness={0.8} /></mesh>
        </group>
        {/* Right Arm */}
        <group ref={armRRef} position={[0.54, 2.04, 0]} rotation={[0.1, 0, 0]}>
          <mesh position={[0, -0.41, 0]} castShadow><boxGeometry args={[0.26, 0.82, 0.26]} /><meshStandardMaterial color="#F0A898" roughness={0.6} /></mesh>
          <mesh position={[0, -0.84, 0]}><boxGeometry args={[0.24, 0.24, 0.24]} /><meshStandardMaterial color="#F5ADA0" roughness={0.6} /></mesh>
        </group>
        {/* Head & Neck */}
        <group ref={headRef} position={[0, 2.1, 0]}>
          <mesh position={[0, 0, 0]}><boxGeometry args={[0.3, 0.3, 0.3]} /><meshStandardMaterial color="#F0A898" roughness={0.6} /></mesh>
          <mesh position={[0, 0.46, 0]} castShadow><boxGeometry args={[0.7, 0.68, 0.6]} /><meshStandardMaterial color="#F5ADA0" roughness={0.6} /></mesh>
          {/* Hair */}
          <mesh position={[-0.4, 0.52, 0]}><boxGeometry args={[0.15, 0.6, 0.64]} /><meshStandardMaterial color="#231008" roughness={0.8} /></mesh>
          <mesh position={[0.4, 0.52, 0]}><boxGeometry args={[0.15, 0.6, 0.64]} /><meshStandardMaterial color="#231008" roughness={0.8} /></mesh>
          <mesh position={[0, 0.52, -0.28]}><boxGeometry args={[0.72, 0.55, 0.12]} /><meshStandardMaterial color="#231008" roughness={0.8} /></mesh>
          {/* Beret */}
          <mesh position={[0, 0.86, 0]}><boxGeometry args={[0.82, 0.24, 0.7]} /><meshStandardMaterial color="#D4558A" roughness={0.8} /></mesh>
          <mesh position={[0, 1.0, 0]}><boxGeometry args={[0.46, 0.2, 0.46]} /><meshStandardMaterial color="#B83A72" roughness={0.8} /></mesh>
          {/* Face */}
          <mesh position={[-0.19, 0.47, 0.31]}><boxGeometry args={[0.15, 0.15, 0.08]} /><meshStandardMaterial color="#180808" /></mesh>
          <mesh position={[0.19, 0.47, 0.31]}><boxGeometry args={[0.15, 0.15, 0.08]} /><meshStandardMaterial color="#180808" /></mesh>
          <mesh position={[-0.15, 0.5, 0.36]}><boxGeometry args={[0.05, 0.05, 0.04]} /><meshStandardMaterial color="#ffffff" /></mesh>
          <mesh position={[0.23, 0.5, 0.36]}><boxGeometry args={[0.05, 0.05, 0.04]} /><meshStandardMaterial color="#ffffff" /></mesh>
          <mesh position={[-0.19, 0.57, 0.31]}><boxGeometry args={[0.18, 0.05, 0.05]} /><meshStandardMaterial color="#100404" /></mesh>
          <mesh position={[0.19, 0.57, 0.31]}><boxGeometry args={[0.18, 0.05, 0.05]} /><meshStandardMaterial color="#100404" /></mesh>
          <mesh position={[0, 0.38, 0.32]}><boxGeometry args={[0.08, 0.1, 0.06]} /><meshStandardMaterial color="#DD9888" /></mesh>
          <mesh position={[0, 0.27, 0.32]}><boxGeometry args={[0.28, 0.07, 0.06]} /><meshStandardMaterial color="#CC5577" /></mesh>
          <mesh position={[-0.27, 0.34, 0.31]}><boxGeometry args={[0.18, 0.1, 0.06]} /><meshStandardMaterial color="#E87890" transparent opacity={0.6} /></mesh>
          <mesh position={[0.27, 0.34, 0.31]}><boxGeometry args={[0.18, 0.1, 0.06]} /><meshStandardMaterial color="#E87890" transparent opacity={0.6} /></mesh>
          {/* Earrings */}
          <mesh position={[-0.38, 0.42, 0.1]}><sphereGeometry args={[0.1, 6, 6]} /><meshStandardMaterial color="#E8B4A0" metalness={0.8} roughness={0.2} /></mesh>
          <mesh position={[0.38, 0.42, 0.1]}><sphereGeometry args={[0.1, 6, 6]} /><meshStandardMaterial color="#E8B4A0" metalness={0.8} roughness={0.2} /></mesh>
        </group>
      </group>
    </group>
  );
}

/* ─────────────────────────────────────────────
   PLAZA ORNAMENT
───────────────────────────────────────────── */
function PlazaOrnament() {
  const gemRef = useRef();
  const innerRef = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (gemRef.current) gemRef.current.rotation.y = t * 0.6;
    if (innerRef.current) {
      innerRef.current.rotation.y = -t * 0.9;
      innerRef.current.rotation.x = t * 0.3;
    }
  });
  return (
    <Float speed={1.2} rotationIntensity={0} floatIntensity={0.4}>
      <group position={[0, 1.8, 0]}>
        <mesh ref={gemRef} castShadow>
          <octahedronGeometry args={[1.0, 0]} />
          <meshPhysicalMaterial
            color="#E8B4A0"
            metalness={0.6}
            roughness={0.1}
            emissive="#D4829A"
            emissiveIntensity={0.5}
          />
        </mesh>
        <mesh ref={innerRef}>
          <octahedronGeometry args={[0.55, 0]} />
          <meshPhysicalMaterial
            color="#C9A0C8"
            transmission={0.7}
            roughness={0.05}
            emissive="#C9A0C8"
            emissiveIntensity={0.8}
          />
        </mesh>
        <pointLight position={[0, 0, 0]} intensity={2.5} color="#E8B4D0" distance={10} />
        <Sparkles position={[0, 0, 0]} count={12} scale={[3, 3, 3]} size={2} speed={0.15} color="#FFB8D0" opacity={0.5} />
      </group>
    </Float>
  );
}

/* ─────────────────────────────────────────────
   GROUND
───────────────────────────────────────────── */
function Ground() {
  const patches = [
    [14,10,7,0x8A9A82],[0-14,0-7,9,0x7B8A74],[7,0-13,6,0x96A88C],
    [0-9,13,8,0x829272],[24,0-18,10,0x8DA085],[0-24,18,7,0x788E70],
    [0,28,11,0x94A688],[0-28,0-4,8,0x7F9075],[17,22,6,0x8C9E82],
    [0-18,0-16,9,0x7A8C72],[9,0-26,7,0x8A9C80],[0-7,20,6,0x92A086],
  ];

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[300, 300, 1, 1]} />
        <meshStandardMaterial color={0x85956B} roughness={1.0} metalness={0} />
      </mesh>
      {patches.map(([x, z, r, c], i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.01, z]} receiveShadow>
          <circleGeometry args={[r, 10]} />
          <meshStandardMaterial color={c} roughness={1.0} metalness={0} />
        </mesh>
      ))}
      {/* Plaza */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[16, 48]} />
        <meshStandardMaterial color={0xEDD5C8} roughness={0.9} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <circleGeometry args={[14, 32]} />
        <meshStandardMaterial color={0xF5E2D8} roughness={0.9} />
      </mesh>
      {/* Decorative rings */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
        <ringGeometry args={[6.0, 6.4, 64]} />
        <meshStandardMaterial color="#D4829A" emissive="#D4829A" emissiveIntensity={0.5} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
        <ringGeometry args={[4.4, 4.7, 64]} />
        <meshStandardMaterial color="#C9A0C8" emissive="#C9A0C8" emissiveIntensity={0.4} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
        <ringGeometry args={[2.8, 3.0, 64]} />
        <meshStandardMaterial color="#D4829A" emissive="#D4829A" emissiveIntensity={0.4} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
        <circleGeometry args={[1.2, 48]} />
        <meshStandardMaterial color="#E8B4A0" emissive="#E8B4A0" emissiveIntensity={0.5} />
      </mesh>
      <PlazaOrnament />
      {/* Footpaths */}
      {ZONES.map(zone => {
        const total = Math.sqrt(zone.x**2 + zone.z**2);
        const ux = zone.x / total, uz = zone.z / total;
        const start = 14, end = total - 6;
        const tileCount = Math.floor((end - start) / 2.0);
        return Array.from({ length: tileCount }, (_, i) => {
          const d = start + i * 2.0 + 1.0;
          const tx = ux * d, tz = uz * d;
          const col = i % 2 === 0 ? 0xF0D8D0 : 0xE8CCC4;
          return (
            <group key={`${zone.id}-${i}`} position={[tx, 0.025, tz]}>
              <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[1.6, 1.6]} />
                <meshStandardMaterial color={col} roughness={0.9} />
              </mesh>
            </group>
          );
        });
      })}
    </group>
  );
}

/* ─────────────────────────────────────────────
   TREES
───────────────────────────────────────────── */
function Tree({ pos, s = 1 }) {
  const lx = (Math.random() - 0.5) * 0.1;
  const lz = (Math.random() - 0.5) * 0.1;
  const variant = Math.floor(Math.random() * 3);
  const canopyColors = [
    [0x9BB08F, 0xB0C4A4, 0x8A9E80],
    [0xE8C4CC, 0xF0D4DA, 0xD4A8B4],
    [0xA8B89C, 0xC8D8BC, 0x96A88A],
  ];
  const sparkleColor = variant === 1 ? "#FFAACC" : "#AACCAA";

  return (
    <group position={pos} scale={s} rotation={[lx, 0, lz]}>
      <mesh position={[0, 1.2, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.45, 2.6, 12]} />
        <meshStandardMaterial color={0x2A1810} roughness={0.9} />
      </mesh>
      <group position={[0, 3.5, 0]}>
        <mesh position={[0, 0, 0]} castShadow>
          <sphereGeometry args={[1.8, 16, 16]} />
          <meshStandardMaterial color={canopyColors[variant][0]} roughness={1.0} metalness={0} />
        </mesh>
        <mesh position={[-1.1, -0.6, 0.8]} castShadow>
          <sphereGeometry args={[1.4, 16, 16]} />
          <meshStandardMaterial color={canopyColors[variant][1]} roughness={1.0} metalness={0} />
        </mesh>
        <mesh position={[1.2, -0.4, -0.6]} castShadow>
          <sphereGeometry args={[1.5, 16, 16]} />
          <meshStandardMaterial color={canopyColors[variant][2]} roughness={1.0} metalness={0} />
        </mesh>
      </group>
      <Sparkles
        position={[0, 3, 0]}
        count={10}
        scale={[4.5, 4.5, 4.5]}
        size={2}
        speed={0.12}
        opacity={0.3}
        color={sparkleColor}
      />
    </group>
  );
}

function AllTrees() {
  const trees = useMemo(() => {
    const validTrees = [];
    for (let i = 0; i < 150; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 20 + Math.random() * 55;
      const tx = Math.cos(a) * r;
      const tz = Math.sin(a) * r;
      if (Math.sqrt(tx*tx + tz*tz) < 18) continue;
      let tooClose = false;
      ZONES.forEach(z => {
        const lineLen = Math.sqrt(z.x**2 + z.z**2);
        const dot = (tx * z.x + tz * z.z) / (lineLen**2);
        const cx = z.x * Math.max(0, Math.min(1, dot));
        const cz = z.z * Math.max(0, Math.min(1, dot));
        if (Math.sqrt((tx-cx)**2 + (tz-cz)**2) < 6.5) tooClose = true;
      });
      if (!tooClose) validTrees.push({ p: [tx, 0, tz], s: 0.7 + Math.random() * 0.5 });
    }
    return validTrees;
  }, []);
  return <>{trees.map((t, i) => <Tree key={i} pos={t.p} s={t.s} />)}</>;
}

/* ─────────────────────────────────────────────
   VOXEL FONT (5x5)
───────────────────────────────────────────── */
const voxelFont = {
  'A': [[0,1,1,1,0],[1,0,0,0,1],[1,1,1,1,1],[1,0,0,0,1],[1,0,0,0,1]],
  'B': [[1,1,1,0,0],[1,0,0,1,0],[1,1,1,0,0],[1,0,0,1,0],[1,1,1,0,0]],
  'C': [[0,1,1,1,0],[1,0,0,0,1],[1,0,0,0,0],[1,0,0,0,1],[0,1,1,1,0]],
  'D': [[1,1,1,0,0],[1,0,0,1,0],[1,0,0,1,0],[1,0,0,1,0],[1,1,1,0,0]],
  'E': [[1,1,1,1,1],[1,0,0,0,0],[1,1,1,0,0],[1,0,0,0,0],[1,1,1,1,1]],
  'F': [[1,1,1,1,1],[1,0,0,0,0],[1,1,1,0,0],[1,0,0,0,0],[1,0,0,0,0]],
  'G': [[0,1,1,1,0],[1,0,0,0,1],[1,0,1,1,1],[1,0,0,0,1],[0,1,1,1,0]],
  'H': [[1,0,0,0,1],[1,0,0,0,1],[1,1,1,1,1],[1,0,0,0,1],[1,0,0,0,1]],
  'I': [[0,1,1,1,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,1,1,1,0]],
  'K': [[1,0,0,0,1],[1,0,0,1,0],[1,1,1,0,0],[1,0,0,1,0],[1,0,0,0,1]],
  'L': [[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,0],[1,1,1,1,1]],
  'M': [[1,0,0,0,1],[1,1,0,1,1],[1,0,1,0,1],[1,0,0,0,1],[1,0,0,0,1]],
  'N': [[1,0,0,0,1],[1,1,0,0,1],[1,0,1,0,1],[1,0,0,1,1],[1,0,0,0,1]],
  'O': [[0,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[0,1,1,1,0]],
  'P': [[1,1,1,1,0],[1,0,0,0,1],[1,1,1,1,0],[1,0,0,0,0],[1,0,0,0,0]],
  'R': [[1,1,1,1,0],[1,0,0,0,1],[1,1,1,1,0],[1,0,0,1,0],[1,0,0,0,1]],
  'S': [[0,1,1,1,1],[1,0,0,0,0],[0,1,1,1,0],[0,0,0,0,1],[1,1,1,1,0]],
  'T': [[1,1,1,1,1],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0]],
  'U': [[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[0,1,1,1,0]],
  'V': [[1,0,0,0,1],[1,0,0,0,1],[0,1,0,1,0],[0,1,0,1,0],[0,0,1,0,0]],
  'W': [[1,0,0,0,1],[1,0,0,0,1],[1,0,1,0,1],[1,1,0,1,1],[1,0,0,0,1]],
  'X': [[1,0,0,0,1],[0,1,0,1,0],[0,0,1,0,0],[0,1,0,1,0],[1,0,0,0,1]],
  'Y': [[1,0,0,0,1],[0,1,0,1,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0]],
  'Z': [[1,1,1,1,1],[0,0,0,1,0],[0,0,1,0,0],[0,1,0,0,0],[1,1,1,1,1]],
  '0': [[0,1,1,1,0],[1,0,0,0,1],[1,0,0,1,1],[1,0,1,0,1],[0,1,1,1,0]],
  '1': [[0,0,1,0,0],[0,1,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,1,1,1,0]],
  '2': [[0,1,1,1,0],[1,0,0,0,1],[0,0,0,1,0],[0,0,1,0,0],[1,1,1,1,1]],
  '3': [[1,1,1,1,0],[0,0,0,0,1],[0,1,1,1,0],[0,0,0,0,1],[1,1,1,1,0]],
  '4': [[0,0,0,1,0],[0,0,1,1,0],[0,1,0,1,0],[1,1,1,1,1],[0,0,0,1,0]],
  '5': [[1,1,1,1,1],[1,0,0,0,0],[1,1,1,1,0],[0,0,0,0,1],[1,1,1,1,0]],
  '6': [[0,1,1,1,0],[1,0,0,0,0],[1,1,1,1,0],[1,0,0,0,1],[0,1,1,1,0]],
  '7': [[1,1,1,1,1],[0,0,0,0,1],[0,0,0,1,0],[0,0,1,0,0],[0,0,1,0,0]],
  '8': [[0,1,1,1,0],[1,0,0,0,1],[0,1,1,1,0],[1,0,0,0,1],[0,1,1,1,0]],
  '9': [[0,1,1,1,0],[1,0,0,0,1],[0,1,1,1,1],[0,0,0,0,1],[0,1,1,1,0]],
  '&': [[0,1,1,0,0],[1,0,0,1,0],[0,1,1,0,1],[1,0,0,1,0],[0,1,1,0,0]],
  '-': [[0,0,0,0,0],[0,0,0,0,0],[1,1,1,1,1],[0,0,0,0,0],[0,0,0,0,0]],
  ' ': [[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]]
};

/* ─────────────────────────────────────────────
   VOXEL PATH LABELS
───────────────────────────────────────────── */
function VoxelLetter({ char, color = "#D4829A" }) {
  const grid = voxelFont[char] || voxelFont[' '];
  const cubeSize = 0.18;
  const spacing = 0.18;
  const offset = 2 * spacing;

  return (
    <group>
      {grid.map((row, r) => row.map((cell, c) => {
        if (!cell) return null;
        return (
          <mesh
            key={`${r}-${c}`}
            position={[
              c * spacing - offset,
              (4 - r) * spacing,
              0
            ]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[cubeSize, cubeSize, cubeSize]} />
            <meshStandardMaterial
              color={color}
              roughness={0.4}
              metalness={0.1}
              emissive={color}
              emissiveIntensity={0.2}
            />
          </mesh>
        );
      }))}
    </group>
  );
}

function VoxelWord({ text, startPos, direction, color, layFlat = false }) {
  const cubeSize = 0.18;
  const letterWidth = 5 * cubeSize;
  const gap = 0.12;
  const step = letterWidth + gap;

  const dir = new THREE.Vector3(direction.x, 0, direction.z).normalize();
  const isLeft = dir.x < 0;
  const chars = text.split('');

  const pathAngle = Math.atan2(dir.x, dir.z);
  const r1 = pathAngle + Math.PI / 2;
  const r2 = pathAngle - Math.PI / 2;
  const faceRot = Math.cos(r1) > Math.cos(r2) ? r1 : r2;
  const perp = new THREE.Vector3(Math.sin(faceRot), 0, Math.cos(faceRot)).normalize();

  return (
    <group position={startPos}>
      {chars.map((char, i) => {
        const placementIndex = isLeft ? (chars.length - 1 - i) : i;
        const pos = dir.clone().multiplyScalar(placementIndex * step);
        pos.add(perp.clone().multiplyScalar(1.6));
        pos.y = layFlat ? 0.05 : 0.1;
        const tiltX = layFlat ? -Math.PI / 2 : -0.55;

        return (
          <group
            key={i}
            position={pos}
            rotation={[0, faceRot, 0]}
          >
            <group rotation={[tiltX, 0, 0]}>
              <VoxelLetter char={char} color={color} />
            </group>
          </group>
        );
      })}
    </group>
  );
}

function PathLabels() {
  return (
    <group>
      {ZONES.map(zone => {
        const dir = new THREE.Vector3(zone.x, 0, zone.z).normalize();
        const startDist = 16.5;
        const startPos = dir.clone().multiplyScalar(startDist);

        // toolkit zone goes straight down — lay flat
        const shouldLayFlat = zone.id === "toolkit";

        return (
          <VoxelWord
            key={zone.id}
            text={zone.label.toUpperCase()}
            startPos={startPos}
            direction={dir}
            color={zone.accent}
            layFlat={shouldLayFlat}
          />
        );
      })}
    </group>
  );
}

/* ─────────────────────────────────────────────
   LIVE SKETCHBOOK — Illustrations zone prop
───────────────────────────────────────────── */
function LiveSketchbook() {
  const canvasRef = useRef(document.createElement('canvas'));
  const textureRef = useRef();
  const cycleDuration = 8;

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 512;
    canvas.height = 640;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#FFF8F3';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (textureRef.current) textureRef.current.needsUpdate = true;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() % cycleDuration;
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, 512, 640);
    ctx.fillStyle = '#FFF8F3';
    ctx.fillRect(0, 0, 512, 640);
    ctx.save();
    ctx.strokeStyle = '#2A1810';
    ctx.lineWidth = 3;

    if (t >= 1) {
      ctx.beginPath();
      ctx.ellipse(256, 280, 100, 130, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    if (t >= 2) {
      ctx.strokeStyle = '#C0607A';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 5]);
      ctx.beginPath(); ctx.moveTo(256, 150); ctx.lineTo(256, 410); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(150, 250); ctx.lineTo(362, 250); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(200, 320); ctx.lineTo(312, 320); ctx.stroke();
      ctx.setLineDash([]);
      ctx.strokeStyle = '#2A1810';
      ctx.lineWidth = 3;
    }
    if (t > 3) {
      const progress = Math.min(1, (t - 3) / 1);
      ctx.beginPath();
      ctx.ellipse(200, 250, 20 * progress, 15 * progress, 0, 0, Math.PI * 2);
      ctx.stroke();
      if (progress > 0.5) {
        ctx.fillStyle = '#2A1810';
        ctx.beginPath();
        ctx.arc(205, 250, 5 * (progress - 0.5) * 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    if (t > 4) {
      const progress = Math.min(1, (t - 4) / 1);
      ctx.beginPath();
      ctx.ellipse(312, 250, 20 * progress, 15 * progress, 0, 0, Math.PI * 2);
      ctx.stroke();
      if (progress > 0.5) {
        ctx.fillStyle = '#2A1810';
        ctx.beginPath();
        ctx.arc(317, 250, 5 * (progress - 0.5) * 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    if (t > 5) {
      const progress = Math.min(1, (t - 5) / 1);
      ctx.beginPath();
      ctx.moveTo(256, 270);
      ctx.lineTo(256, 270 + 40 * progress);
      ctx.stroke();
      if (progress > 0.7) {
        ctx.beginPath();
        ctx.ellipse(256, 315, 8 * (progress - 0.7) * 3, 5 * (progress - 0.7) * 3, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    if (t > 6) {
      const progress = Math.min(1, (t - 6) / 1);
      ctx.beginPath();
      const startX = 220, endX = 292;
      const cx = 256, cy = 350 + 20 * (1 - progress);
      ctx.quadraticCurveTo(256, cy, endX, 350);
      ctx.stroke();
    }

    ctx.restore();
    if (textureRef.current) textureRef.current.needsUpdate = true;
  });

  return (
    <group position={[0, 0, 0]}>
      <mesh position={[-1.4, 3.0, 1.2]} rotation={[0.22, 0, 0.18]} castShadow>
        <boxGeometry args={[0.22, 7.0, 0.22]} />
        <meshStandardMaterial color="#5A3520" roughness={0.9} />
      </mesh>
      <mesh position={[1.4, 3.0, 1.2]} rotation={[0.22, 0, -0.18]} castShadow>
        <boxGeometry args={[0.22, 7.0, 0.22]} />
        <meshStandardMaterial color="#5A3520" roughness={0.9} />
      </mesh>
      <mesh position={[0, 2.8, -1.4]} rotation={[-0.3, 0, 0]} castShadow>
        <boxGeometry args={[0.18, 6.5, 0.18]} />
        <meshStandardMaterial color="#5A3520" roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.4, 0.2]} castShadow>
        <boxGeometry args={[2.9, 0.15, 0.15]} />
        <meshStandardMaterial color="#5A3520" roughness={0.9} />
      </mesh>
      <mesh position={[0, 2.8, 0.5]} castShadow>
        <boxGeometry args={[3.0, 0.2, 0.2]} />
        <meshStandardMaterial color="#6B4A30" roughness={0.8} />
      </mesh>
      <group position={[0, 5.2, 0.3]}>
        <mesh castShadow>
          <boxGeometry args={[3.6, 4.6, 0.14]} />
          <meshStandardMaterial color="#C0607A" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0, 0.08]}>
          <boxGeometry args={[3.3, 4.3, 0.05]} />
          <meshStandardMaterial color="#FFF8F5" roughness={0.95} />
        </mesh>
        <mesh position={[0, 0, 0.12]}>
          <planeGeometry args={[3.25, 4.25]} />
          <meshStandardMaterial map={new THREE.CanvasTexture(canvasRef.current)} ref={textureRef} />
        </mesh>
        <pointLight position={[0, 0, 1.5]} intensity={1.8} color="#FFE0E8" distance={8} />
      </group>
      {[[-1.2, '#D4829A'], [0, '#C9A0C8'], [1.2, '#E8B4A0']].map(([x, c], i) => (
        <mesh key={i} position={[x, 0.18, 1.0]} rotation={[Math.PI/2, 0, i * 0.4 - 0.4]} castShadow>
          <cylinderGeometry args={[0.12, 0.1, 0.9, 8]} />
          <meshStandardMaterial color={c} roughness={0.7} />
        </mesh>
      ))}
      <Sparkles position={[0, 6, 0]} count={14} scale={[5, 5, 3]} size={2.5} speed={0.1} color="#FFAACC" opacity={0.45} />
    </group>
  );
}

/* ─────────────────────────────────────────────
   3D & SPATIAL: Low-Poly Rotating Head
───────────────────────────────────────────── */
function CrystalInstallation() {
  const headGroupRef = useRef();
  const wireRef = useRef();
  const axisGroupRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (headGroupRef.current) headGroupRef.current.rotation.y = t * 0.35;
    if (wireRef.current) {
      wireRef.current.rotation.y = t * 0.5;
      wireRef.current.rotation.x = Math.sin(t * 0.3) * 0.08;
    }
    if (axisGroupRef.current) axisGroupRef.current.rotation.y = t * 0.2;
  });

  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2.8, 3.2, 0.8, 6]} />
        <meshStandardMaterial color="#EDE0F0" roughness={0.6} metalness={0.1} />
      </mesh>
      <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, 0.82, 0]}>
        <ringGeometry args={[2.2, 2.6, 32]} />
        <meshStandardMaterial color="#C9A0C8" emissive="#C9A0C8" emissiveIntensity={1.2} />
      </mesh>
      <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, 0.83, 0]}>
        <ringGeometry args={[0.8, 1.1, 32]} />
        <meshStandardMaterial color="#E8B4D0" emissive="#E8B4D0" emissiveIntensity={0.8} />
      </mesh>

      <Float speed={0.8} rotationIntensity={0} floatIntensity={0.35}>
        <group ref={headGroupRef} position={[0, 5.0, 0]}>
          <mesh castShadow>
            <icosahedronGeometry args={[2.0, 1]} />
            <meshStandardMaterial color="#F5D0E0" roughness={0.55} metalness={0.05} emissive="#E8A8C0" emissiveIntensity={0.12} />
          </mesh>
          <mesh ref={wireRef} castShadow>
            <icosahedronGeometry args={[2.25, 1]} />
            <meshStandardMaterial color="#C9A0C8" wireframe={true} transparent opacity={0.45} emissive="#C9A0C8" emissiveIntensity={0.6} />
          </mesh>
          <mesh position={[-0.7, 0.4, 1.7]} castShadow>
            <sphereGeometry args={[0.38, 8, 8]} />
            <meshStandardMaterial color="#2A1830" roughness={0.8} />
          </mesh>
          <mesh position={[0.7, 0.4, 1.7]} castShadow>
            <sphereGeometry args={[0.38, 8, 8]} />
            <meshStandardMaterial color="#2A1830" roughness={0.8} />
          </mesh>
          <mesh position={[-0.7, 0.4, 2.0]}>
            <sphereGeometry args={[0.18, 8, 8]} />
            <meshStandardMaterial color="#C9A0C8" emissive="#C9A0C8" emissiveIntensity={3} />
          </mesh>
          <mesh position={[0.7, 0.4, 2.0]}>
            <sphereGeometry args={[0.18, 8, 8]} />
            <meshStandardMaterial color="#C9A0C8" emissive="#C9A0C8" emissiveIntensity={3} />
          </mesh>
          <mesh rotation={[Math.PI/2, 0, 0]}>
            <torusGeometry args={[2.3, 0.04, 8, 48]} />
            <meshStandardMaterial color="#E8B4D0" emissive="#E8B4D0" emissiveIntensity={2.5} transparent opacity={0.7} />
          </mesh>
        </group>
      </Float>

      <group ref={axisGroupRef} position={[0, 5.0, 0]}>
        <mesh position={[3.2, 0, 0]}>
          <boxGeometry args={[1.4, 0.08, 0.08]} />
          <meshStandardMaterial color="#D4829A" emissive="#D4829A" emissiveIntensity={1.5} />
        </mesh>
        <mesh position={[3.9, 0, 0]}>
          <coneGeometry args={[0.15, 0.4, 6]} />
          <meshStandardMaterial color="#D4829A" emissive="#D4829A" emissiveIntensity={1.5} />
        </mesh>
        <mesh position={[0, 3.2, 0]}>
          <boxGeometry args={[0.08, 1.4, 0.08]} />
          <meshStandardMaterial color="#C9A0C8" emissive="#C9A0C8" emissiveIntensity={1.5} />
        </mesh>
        <mesh position={[0, 3.9, 0]}>
          <coneGeometry args={[0.15, 0.4, 6]} />
          <meshStandardMaterial color="#C9A0C8" emissive="#C9A0C8" emissiveIntensity={1.5} />
        </mesh>
        <mesh position={[0, 0, 3.2]}>
          <boxGeometry args={[0.08, 0.08, 1.4]} />
          <meshStandardMaterial color="#9BB08F" emissive="#9BB08F" emissiveIntensity={1.5} />
        </mesh>
        <mesh position={[0, 0, 3.9]} rotation={[Math.PI/2, 0, 0]}>
          <coneGeometry args={[0.15, 0.4, 6]} />
          <meshStandardMaterial color="#9BB08F" emissive="#9BB08F" emissiveIntensity={1.5} />
        </mesh>
      </group>

      <pointLight position={[0, 5, 0]} intensity={4} color="#C9A0C8" distance={16} />
      <Sparkles position={[0, 5.5, 0]} count={20} scale={[5, 6, 5]} size={2} speed={0.15} color="#E8B8F0" opacity={0.5} />
    </group>
  );
}

/* ─────────────────────────────────────────────
   POSTER DESIGN: Large-Format Printing Machine
───────────────────────────────────────────── */
function ElegantGalleryWall() {
  const rollRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (rollRef.current) rollRef.current.rotation.x = t * 0.5;
  });

  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, 1.8, 0]} castShadow receiveShadow>
        <boxGeometry args={[8.0, 3.2, 3.5]} />
        <meshStandardMaterial color="#1E1414" roughness={0.5} metalness={0.35} />
      </mesh>
      <mesh position={[0, 3.45, 0]}>
        <boxGeometry args={[8.0, 0.18, 3.5]} />
        <meshStandardMaterial color="#F0E0D8" roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.8, 1.78]}>
        <boxGeometry args={[8.0, 3.2, 0.12]} />
        <meshStandardMaterial color="#2A1C18" roughness={0.5} metalness={0.2} />
      </mesh>
      <mesh position={[0, 2.6, 1.86]}>
        <boxGeometry args={[5.0, 0.55, 0.06]} />
        <meshStandardMaterial color="#3A2820" roughness={0.6} />
      </mesh>
      {[-1.8, -0.9, 0, 0.9, 1.8].map((x, i) => (
        <mesh key={i} position={[x, 2.62, 1.93]}>
          <cylinderGeometry args={[0.12, 0.12, 0.05, 10]} />
          <meshStandardMaterial
            color={["#D4829A","#E8B4A0","#9BB08F","#C9A0C8","#C4A882"][i]}
            emissive={["#D4829A","#E8B4A0","#9BB08F","#C9A0C8","#C4A882"][i]}
            emissiveIntensity={1.0}
          />
        </mesh>
      ))}
      <mesh position={[0, 3.38, 0.8]}>
        <boxGeometry args={[6.5, 0.1, 0.08]} />
        <meshStandardMaterial color="#E8B4A0" emissive="#E8B4A0" emissiveIntensity={2.5} />
      </mesh>
      {[[-3.2, 0], [3.2, 0], [-3.2, -1.4], [3.2, -1.4]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.2, z]} castShadow>
          <boxGeometry args={[0.5, 0.45, 0.5]} />
          <meshStandardMaterial color="#111" roughness={0.7} metalness={0.4} />
        </mesh>
      ))}
      <mesh ref={rollRef} position={[0, 3.72, -0.6]} castShadow>
        <cylinderGeometry args={[0.55, 0.55, 7.0, 20]} />
        <meshStandardMaterial color="#F5E8E0" roughness={0.9} />
      </mesh>
      {[-3.3, 3.3].map((x, i) => (
        <mesh key={i} position={[x, 3.72, -0.6]}>
          <cylinderGeometry args={[0.58, 0.58, 0.12, 20]} />
          <meshStandardMaterial color="#1A1010" roughness={0.6} metalness={0.3} />
        </mesh>
      ))}
      {(() => {
        const pc = document.createElement('canvas');
        pc.width = 512; pc.height = 720;
        const ctx = pc.getContext('2d');
        ctx.fillStyle = '#FFF5F0'; ctx.fillRect(0, 0, 512, 720);
        ctx.fillStyle = '#C9607A'; ctx.fillRect(0, 0, 512, 240);
        ctx.fillStyle = '#FFF5F0';
        ctx.beginPath(); ctx.arc(360, 120, 85, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#E8B4A0';
        ctx.beginPath(); ctx.arc(360, 120, 55, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#1A1010';
        ctx.beginPath(); ctx.arc(360, 120, 22, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#C9A0C8'; ctx.fillRect(0, 240, 110, 340);
        ctx.fillStyle = '#1A1010'; ctx.fillRect(130, 275, 360, 55);
        ctx.fillStyle = '#555'; ctx.fillRect(130, 348, 260, 35);
        ctx.fillStyle = '#888'; ctx.fillRect(130, 398, 195, 25);
        ctx.fillStyle = '#C9607A'; ctx.fillRect(0, 445, 512, 7);
        ctx.fillStyle = '#AAA'; ctx.fillRect(130, 465, 300, 20);
        ctx.fillStyle = '#BBB'; ctx.fillRect(130, 498, 220, 16);
        ctx.fillStyle = '#9BB08F'; ctx.fillRect(0, 580, 512, 140);
        [80,180,256,332,432].forEach((x,i) => {
          ctx.fillStyle = i%2===0 ? '#FFF5F0' : '#D4829A';
          ctx.beginPath(); ctx.arc(x, 650, 18, 0, Math.PI*2); ctx.fill();
        });
        const tex = new THREE.CanvasTexture(pc);
        return (
          <mesh position={[0, 4.8, 1.85]}>
            <planeGeometry args={[7.2, 8.5]} />
            <meshStandardMaterial map={tex} emissive="#FFE8F0" emissiveIntensity={0.2} />
          </mesh>
        );
      })()}
      <pointLight position={[0, 6, 3.5]} intensity={2.0} color="#FFE8F0" distance={14} />
    </group>
  );
}

/* ─────────────────────────────────────────────
   MOTION DESIGN: Editing Suite
───────────────────────────────────────────── */
function VideoEditingStation() {
  const ph1 = useRef();
  const ph2 = useRef();
  const ph3 = useRef();
  const recLight = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ph1.current) ph1.current.position.x = ((t * 0.6) % 4.8) - 2.4;
    if (ph2.current) ph2.current.position.x = ((t * 0.4 + 1.6) % 4.8) - 2.4;
    if (ph3.current) ph3.current.position.x = ((t * 0.8 + 3.2) % 4.8) - 2.4;
    if (recLight.current) recLight.current.intensity = Math.sin(t * 3) > 0.3 ? 2.5 : 0.2;
  });

  return (
    <group position={[0, 0, 0]} rotation={[-0.08, 0, 0]}>
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[8, 0.22, 4]} />
        <meshStandardMaterial color="#1A1414" roughness={0.7} metalness={0.3} />
      </mesh>
      {[[-3.5,-3.5],[3.5,-3.5],[-3.5,1.5],[3.5,1.5]].map(([x,z],i)=>(
        <mesh key={i} position={[x, -0.15, z]}>
          <boxGeometry args={[0.25, 1.3, 0.25]} />
          <meshStandardMaterial color="#111" roughness={0.8} />
        </mesh>
      ))}
      <group position={[0, 0, -1.0]} rotation={[-0.21, 0, 0]}>
        <mesh position={[0, 3.8, 0]} castShadow>
          <boxGeometry args={[7.2, 4.2, 0.3]} />
          <meshStandardMaterial color="#0D0D0D" roughness={0.4} metalness={0.5} />
        </mesh>
        <mesh position={[0, 3.8, 0.16]}>
          <boxGeometry args={[6.8, 3.8, 0.08]} />
          <meshStandardMaterial color="#080808" roughness={1} />
        </mesh>
        <mesh position={[0, 3.85, 0.21]}>
          <boxGeometry args={[6.5, 3.5, 0.06]} />
          <meshStandardMaterial color="#120A18" emissive="#120A18" emissiveIntensity={1.5} roughness={1} />
        </mesh>
        <mesh position={[0, 2.25, 0.28]}>
          <boxGeometry args={[6.3, 1.1, 0.04]} />
          <meshStandardMaterial color="#1E1020" emissive="#1E1020" emissiveIntensity={1} />
        </mesh>
        <mesh position={[0, 2.62, 0.30]}>
          <boxGeometry args={[5.8, 0.22, 0.03]} />
          <meshStandardMaterial color="#D4829A" emissive="#D4829A" emissiveIntensity={1.2} />
        </mesh>
        <mesh position={[0, 2.35, 0.30]}>
          <boxGeometry args={[5.8, 0.18, 0.03]} />
          <meshStandardMaterial color="#C9A0C8" emissive="#C9A0C8" emissiveIntensity={1.0} />
        </mesh>
        <mesh position={[0, 2.10, 0.30]}>
          <boxGeometry args={[5.8, 0.16, 0.03]} />
          <meshStandardMaterial color="#E8B4A0" emissive="#E8B4A0" emissiveIntensity={0.9} />
        </mesh>
        {[[-2.2,0.75],[-0.6,1.2],[0.9,0.9],[2.5,0.6]].map(([x,w],i)=>(
          <mesh key={i} position={[x, 2.62, 0.32]}>
            <boxGeometry args={[w, 0.2, 0.03]} />
            <meshStandardMaterial color="#E8829A" emissive="#D4729A" emissiveIntensity={0.6} />
          </mesh>
        ))}
        {[[-2.5,1.4],[-0.2,0.8],[1.5,1.1]].map(([x,w],i)=>(
          <mesh key={i} position={[x, 2.35, 0.32]}>
            <boxGeometry args={[w, 0.16, 0.03]} />
            <meshStandardMaterial color="#B890C8" emissive="#A880B8" emissiveIntensity={0.5} />
          </mesh>
        ))}
        <mesh ref={ph1} position={[0, 2.55, 0.34]}>
          <boxGeometry args={[0.04, 0.8, 0.03]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
        <mesh position={[1.5, 4.2, 0.24]}>
          <boxGeometry args={[3.0, 2.0, 0.04]} />
          <meshStandardMaterial color="#1A0C20" emissive="#1A0C20" emissiveIntensity={2} />
        </mesh>
        <mesh position={[1.5, 4.2, 0.27]}>
          <boxGeometry args={[2.8, 1.8, 0.03]} />
          <meshStandardMaterial color="#2A1030" emissive="#C9A0C8" emissiveIntensity={0.15} />
        </mesh>
        <mesh position={[1.5, 4.05, 0.29]}>
          <cylinderGeometry args={[0.35, 0.45, 1.0, 10]} />
          <meshStandardMaterial color="#D4829A" emissive="#D4829A" emissiveIntensity={0.4} transparent opacity={0.7} />
        </mesh>
        <mesh position={[-2.6, 4.2, 0.24]}>
          <boxGeometry args={[1.5, 2.2, 0.04]} />
          <meshStandardMaterial color="#160C1C" emissive="#160C1C" emissiveIntensity={1.5} />
        </mesh>
        {[3.3,3.7,4.1,4.5,4.9].map((y,i)=>(
          <mesh key={i} position={[-2.6, y, 0.27]}>
            <cylinderGeometry args={[0.12, 0.12, 0.03, 8]} />
            <meshStandardMaterial
              color={["#D4829A","#C9A0C8","#E8B4A0","#9BB08F","#C4A882"][i]}
              emissive={["#D4829A","#C9A0C8","#E8B4A0","#9BB08F","#C4A882"][i]}
              emissiveIntensity={0.8}
            />
          </mesh>
        ))}
        <mesh position={[3.2, 5.5, 0.28]}>
          <sphereGeometry args={[0.12, 8, 8]} />
          <meshStandardMaterial color="#FF4466" emissive="#FF2244" emissiveIntensity={2} />
        </mesh>
        <pointLight ref={recLight} position={[3.2, 5.5, 0.5]} intensity={2.5} color="#FF4466" distance={5} />
      </group>
      <mesh position={[0, 0.64, 1.0]} castShadow>
        <boxGeometry args={[3.5, 0.1, 1.2]} />
        <meshStandardMaterial color="#1A1414" roughness={0.8} />
      </mesh>
      {[-0.4,0,0.4].map((z,i)=>(
        <mesh key={i} position={[0, 0.7, 1.0+z*0.35]}>
          <boxGeometry args={[3.2, 0.04, 0.22]} />
          <meshStandardMaterial color="#2A1E1E" roughness={0.9} />
        </mesh>
      ))}
      <pointLight position={[0, 3, 0]} intensity={1.8} color="#C9A0C8" distance={10} />
      <Sparkles position={[0, 4, 0]} count={8} scale={[7, 3, 2]} size={1.5} speed={0.08} color="#E8B4D0" opacity={0.25} />
    </group>
  );
}

/* ─────────────────────────────────────────────
   BUILDINGS — zone id now matches label keys
───────────────────────────────────────────── */
function Building({ zone, onZoneClick }) {
  const [hovered, setHovered] = useState(false);
  const wc = zone.wallHex;
  const rc = zone.roofHex;

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
    return () => { document.body.style.cursor = 'auto'; };
  }, [hovered]);

  return (
    <group
      position={[zone.x, 0, zone.z]}
      onClick={(e) => { e.stopPropagation(); if (onZoneClick) onZoneClick(zone); }}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
    >
      {/* Base Pad */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]} receiveShadow>
        <circleGeometry args={[6.5, 32]} />
        <meshStandardMaterial color={hovered ? "#F8E8E0" : wc} roughness={0.9} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]}>
        <ringGeometry args={[6.5, 6.8, 32]} />
        <meshStandardMaterial color={rc} emissive={rc} emissiveIntensity={hovered ? 2.5 : 1.4} />
      </mesh>

      {/* Hover pulse ring */}
      {hovered && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.07, 0]}>
          <ringGeometry args={[7.0, 7.4, 32]} />
          <meshStandardMaterial color={zone.accent} emissive={zone.accent} emissiveIntensity={1.5} transparent opacity={0.6} />
        </mesh>
      )}

      {/* ── ILLUSTRATIONS zone ── */}
      {zone.id === "illustrations" && (
        <group scale={1.35}>
          <LiveSketchbook />
        </group>
      )}

      {/* ── BRANDING & LOGOS zone ── */}
      {zone.id === "branding" && (
        <group position={[0, 3.5, 0]}>
          <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.2}>
            <mesh position={[-0.75, 0, 0]} castShadow><boxGeometry args={[1.3, 5.5, 1.8]} /><meshStandardMaterial color="#1A1514" roughness={0.2} metalness={0.8} /></mesh>
            <mesh position={[0.75, 0.6, 0]} castShadow><boxGeometry args={[1.3, 5.5, 1.8]} /><meshStandardMaterial color="#1A1514" roughness={0.2} metalness={0.8} /></mesh>
            <mesh position={[0, 0.3, 0]}><octahedronGeometry args={[0.5, 0]} /><meshStandardMaterial color="#E8B4A0" emissive="#E8B4A0" emissiveIntensity={2} /></mesh>
          </Float>
          <pointLight position={[0, 0, 0]} intensity={3} color="#E8B4A0" distance={12} />
        </group>
      )}

      {/* ── 3D & SPATIAL zone ── */}
      {zone.id === "3d-spatial" && (
        <group scale={1.3}>
          <CrystalInstallation />
        </group>
      )}

      {/* ── POSTER DESIGN zone ── */}
      {zone.id === "poster-design" && <ElegantGalleryWall />}

      {/* ── CONTACT ME zone ── */}
      {zone.id === "contact" && (
        <group position={[0, 0, 0]}>
          <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[3.2, 2.2, 0.4, 32]} />
            <meshStandardMaterial color="#F8EEEE" roughness={1} />
          </mesh>
          <mesh position={[0, 1.8, 0]} castShadow>
            <cylinderGeometry args={[2.2, 1.6, 2.8, 32]} />
            <meshStandardMaterial color="#C98B8B" roughness={0.8} />
          </mesh>
          <mesh position={[0, 3.15, 0]}>
            <cylinderGeometry args={[2.0, 2.0, 0.1, 32]} />
            <meshStandardMaterial color="#3E2723" roughness={0.2} />
          </mesh>
          <mesh position={[2.2, 1.8, 0]} rotation={[0, 0, -Math.PI/2]} castShadow>
            <torusGeometry args={[0.9, 0.35, 16, 32, Math.PI]} />
            <meshStandardMaterial color="#C98B8B" roughness={0.8} />
          </mesh>
          <Float speed={2.5} rotationIntensity={0.5} floatIntensity={1.5}>
            <mesh position={[-0.8, 4.5, -0.5]}><sphereGeometry args={[0.6, 16, 16]} /><meshStandardMaterial color="#FDFBF9" roughness={1} transparent opacity={0.85} /></mesh>
            <mesh position={[0.6, 5.5, 0.2]}><sphereGeometry args={[0.8, 16, 16]} /><meshStandardMaterial color="#FDFBF9" roughness={1} transparent opacity={0.75} /></mesh>
            <mesh position={[0.3, 4.2, 0.8]}><sphereGeometry args={[0.5, 16, 16]} /><meshStandardMaterial color="#FDFBF9" roughness={1} transparent opacity={0.9} /></mesh>
          </Float>
          <pointLight position={[0, 6, 0]} intensity={2} color="#FFE0D0" distance={12} />
        </group>
      )}

      {/* ── MOTION DESIGN zone ── */}
      {zone.id === "motion-design" && <VideoEditingStation />}

      {/* ── TOOLKIT zone ── */}
      {zone.id === "toolkit" && (
        <>
          <mesh position={[0, 0.5, 0]} castShadow>
            <cylinderGeometry args={[3, 4, 1, 32]} />
            <meshStandardMaterial color={wc} metalness={0.5} roughness={0.5} />
          </mesh>
          <Float speed={1.5} rotationIntensity={1} floatIntensity={0.5}>
            {[0, 1, 2].map((i) => (
              <mesh key={i} position={[0, 5, 0]} rotation={[Math.PI / 4 * i, Math.PI / 3 * i, 0]}>
                <torusGeometry args={[3 - i * 0.4, 0.1, 16, 64]} />
                <meshStandardMaterial
                  color={i === 0 ? 0xC4A882 : i === 1 ? 0xD4829A : 0xC9A0C8}
                  metalness={0.9}
                  roughness={0.1}
                  emissive={i === 0 ? 0xC4A882 : i === 1 ? 0xD4829A : 0xC9A0C8}
                  emissiveIntensity={i === 2 ? 1.5 : 0.3}
                />
              </mesh>
            ))}
          </Float>
          <pointLight position={[0, 5, 0]} intensity={2.5} color="#D4829A" distance={12} />
        </>
      )}
    </group>
  );
}

/* ─────────────────────────────────────────────
   ANIMATED NPC
───────────────────────────────────────────── */
function AnimatedNPC({ position, rotation, color, bobSpeed = 1.4, armSwing = true }) {
  const bodyRef = useRef();
  const armLRef = useRef();
  const armRRef = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (bodyRef.current) bodyRef.current.position.y = position[1] + 0.9 + Math.sin(t * bobSpeed) * 0.04;
    if (armSwing && armLRef.current) {
      armLRef.current.rotation.x = Math.sin(t * 1.8) * 0.22;
      armRRef.current.rotation.x = -Math.sin(t * 1.8) * 0.22;
    }
  });
  return (
    <group position={position} rotation={rotation}>
      {[-0.14, 0.14].map(ox => (
        <mesh key={ox} position={[ox, 0.28, 0]}>
          <boxGeometry args={[0.2, 0.55, 0.2]} />
          <meshLambertMaterial color={0x4A2060} />
        </mesh>
      ))}
      <mesh ref={bodyRef} position={[0, 0.9, 0]}>
        <boxGeometry args={[0.5, 0.65, 0.35]} />
        <meshLambertMaterial color={color} />
      </mesh>
      <group ref={armLRef} position={[-0.32, 0.88, 0]}>
        <mesh><boxGeometry args={[0.18, 0.55, 0.18]} /><meshLambertMaterial color={0xF0A898} /></mesh>
      </group>
      <group ref={armRRef} position={[0.32, 0.88, 0]}>
        <mesh><boxGeometry args={[0.18, 0.55, 0.18]} /><meshLambertMaterial color={0xF0A898} /></mesh>
      </group>
      <mesh position={[0, 1.45, 0]}>
        <boxGeometry args={[0.46, 0.46, 0.4]} />
        <meshLambertMaterial color={0xF5ADA0} />
      </mesh>
      <mesh position={[0, 1.68, 0]}>
        <boxGeometry args={[0.5, 0.18, 0.44]} />
        <meshLambertMaterial color={0x231008} />
      </mesh>
    </group>
  );
}

/* ─────────────────────────────────────────────
   LIVING SCENES — named to match zone IDs
───────────────────────────────────────────── */

// Illustrations zone scene
function IllustrationsScene() {
  return (
    <group position={[-30, 0, -24]}>
      <AnimatedNPC position={[-5.0, 0, 5.5]} rotation={[0, -0.4, 0]} color={0xD4829A} bobSpeed={1.2} armSwing={true} />
      <pointLight position={[-5.0, 4, 4.5]} intensity={1.5} color="#FFDDEE" distance={10} />
    </group>
  );
}

// Branding & Logos zone scene
function BrandingScene() {
  const pressRef = useRef();
  const logoRef = useRef();
  const flRef = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (pressRef.current) pressRef.current.position.y = 2 + Math.sin(t * 2) * 0.8;
    if (logoRef.current) { logoRef.current.rotation.y = t * 0.8; logoRef.current.position.y = 0.85 + Math.sin(t * 1.5) * 0.15; }
    if (flRef.current) flRef.current.intensity = 3 + Math.sin(t * 4) * 1.5;
  });
  return (
    <group position={[-30, 0, 24]}>
      <mesh position={[-5.5, 0.25, 5.5]}><boxGeometry args={[1.4, 0.5, 0.9]} /><meshLambertMaterial color={0x333333} /></mesh>
      <mesh position={[-5.5, 0.68, 5.5]}><boxGeometry args={[1.8, 0.35, 0.7]} /><meshLambertMaterial color={0x222222} /></mesh>
      <mesh ref={pressRef} position={[-5.5, 2, 5.5]}><boxGeometry args={[0.3, 2.5, 0.3]} /><meshLambertMaterial color={0x333333} /></mesh>
      <mesh position={[-5.5, 3.5, 5.5]}><boxGeometry args={[1.8, 0.4, 1.4]} /><meshLambertMaterial color={0x222222} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-5.5, 0.82, 5.5]}>
        <circleGeometry args={[0.8, 16]} />
        <meshLambertMaterial color={0xFF9988} emissive={0xFF6655} emissiveIntensity={1.2} transparent opacity={0.85} />
      </mesh>
      <pointLight ref={flRef} position={[-5.5, 1.5, 5.5]} intensity={3} color="#FF9977" distance={7} />
      <Sparkles position={[-5.5, 1.5, 5.5]} count={20} scale={[2, 3, 2]} size={4} speed={0.6} color="#FFBBAA" />
      <mesh ref={logoRef} position={[-4.0, 0.85, 5.5]}>
        <boxGeometry args={[1.4, 0.12, 1.0]} />
        <meshLambertMaterial color={0xE8B4A0} emissive={0xE8B4A0} emissiveIntensity={0.9} />
      </mesh>
      <AnimatedNPC position={[-4.5, 0, 6.2]} rotation={[0, -0.8, 0]} color={0xC98B8B} bobSpeed={1.5} armSwing={true} />
    </group>
  );
}

// Motion Design zone scene
function MotionDesignScene() {
  return (
    <group position={[40, 0, 0]}>
      <AnimatedNPC position={[-4.5, 0, 3.5]} rotation={[0, Math.PI, 0]} color={0xD4829A} bobSpeed={1.3} armSwing={false} />
      <AnimatedNPC position={[-6.0, 0, 3.0]} rotation={[0, -0.5, 0]} color={0xE8B4A0} bobSpeed={1.6} armSwing={true} />
      <pointLight position={[0, 6, 0]} intensity={1.2} color="#C9A0C8" distance={14} />
    </group>
  );
}

// Contact Me zone scene
function ContactScene() {
  const fairyRefs = useRef([]);
  const steamRefs = useRef([]);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    fairyRefs.current.forEach((f, i) => {
      if (f) f.material.emissiveIntensity = 1.5 + Math.sin(t * 3 + i * 0.4) * 0.8;
    });
    steamRefs.current.forEach(s => {
      if (!s) return;
      s.position.y += 0.003;
      if (s.position.y > 2.2) s.position.y = 1.65;
      s.material.opacity = Math.max(0, 0.4 - (s.position.y - 1.65) * 0.35);
    });
  });
  return (
    <group position={[30, 0, 24]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-5.5, 0.02, 5.5]}>
        <circleGeometry args={[5, 16]} />
        <meshLambertMaterial color={0xC8A08A} />
      </mesh>
      <mesh position={[-5.5, 1.05, 5.5]}>
        <cylinderGeometry args={[1.2, 1.2, 0.14, 16]} />
        <meshLambertMaterial color={0x8B5A2B} />
      </mesh>
      <mesh position={[-5.5, 0.5, 5.5]}>
        <cylinderGeometry args={[0.1, 0.12, 1.0, 8]} />
        <meshLambertMaterial color={0x6B3A18} />
      </mesh>
      {[[-0.6, 0], [0.6, 1]].map(([ox, ci]) => (
        <group key={ci}>
          <mesh position={[-5.5 + ox, 1.33, 5.5]}><cylinderGeometry args={[0.22, 0.18, 0.42, 10]} /><meshLambertMaterial color={0xF0E0D8} /></mesh>
          <mesh position={[-5.5 + ox, 1.22, 5.5]}><cylinderGeometry args={[0.35, 0.38, 0.08, 10]} /><meshLambertMaterial color={0xE8D0C8} /></mesh>
          {[0, 1, 2].map(si => (
            <mesh key={si} ref={el => steamRefs.current[ci * 3 + si] = el}
              position={[-5.5 + ox, 1.7 + si * 0.18, 5.5]}>
              <sphereGeometry args={[0.1, 6, 6]} />
              <meshLambertMaterial color={0xEEDDDD} transparent opacity={0.35} />
            </mesh>
          ))}
        </group>
      ))}
      {[-6.5, -4.5].map((cx, i) => (
        <group key={i}>
          <mesh position={[cx, 0.62, 6.3]}><boxGeometry args={[1.0, 0.12, 0.9]} /><meshLambertMaterial color={0x8B6040} /></mesh>
          <mesh position={[cx, 1.13, 6.78]}><boxGeometry args={[1.0, 0.95, 0.1]} /><meshLambertMaterial color={0x8B6040} /></mesh>
        </group>
      ))}
      <AnimatedNPC position={[-6.5, 0.65, 6.3]} rotation={[0, Math.PI, 0]} color={0xC98B8B} bobSpeed={0.8} armSwing={false} />
      <AnimatedNPC position={[-4.5, 0.65, 6.3]} rotation={[0, Math.PI, 0]} color={0xE8B4A0} bobSpeed={0.9} armSwing={false} />
      <mesh position={[-7.5, 2, 4.5]}><cylinderGeometry args={[0.1, 0.12, 4, 8]} /><meshLambertMaterial color={0x4A2A10} /></mesh>
      <mesh position={[-7.5, 4.1, 4.5]}>
        <sphereGeometry args={[0.4, 8, 8]} />
        <meshLambertMaterial color={0xFFEEDD} emissive={0xFFEEDD} emissiveIntensity={2.5} />
      </mesh>
      <pointLight position={[-7.5, 4.1, 4.5]} intensity={3.5} color="#FFCCAA" distance={12} />
      {Array.from({ length: 8 }, (_, i) => (
        <mesh key={i} ref={el => fairyRefs.current[i] = el}
          position={[-7.5 + i * 0.58, 3.5 + Math.sin(i * 0.8) * 0.25, 4.5]}>
          <sphereGeometry args={[0.12, 6, 6]} />
          <meshLambertMaterial color={0xFFEEDD} emissive={0xFFEEDD} emissiveIntensity={2} />
        </mesh>
      ))}
      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
        <group position={[-5.5, 3.4, 5.5]}>
          <mesh><boxGeometry args={[2.6, 0.8, 0.18]} /><meshLambertMaterial color={0xC98B8B} emissive={0xC98B8B} emissiveIntensity={0.2} /></mesh>
          <Text position={[0, 0, 0.12]} fontSize={0.28} color="#FDFBF9" anchorX="center" anchorY="middle">
            OPEN · BOOK A CALL
          </Text>
        </group>
      </Float>
    </group>
  );
}

/* ─────────────────────────────────────────────
   DIRECTION BOARD — individual hover
───────────────────────────────────────────── */
function DirectionBoard({ z, position, isLeft, onZoneClick }) {
  const [hovered, setHovered] = useState(false);
  const boardRef = useRef();

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
    return () => { document.body.style.cursor = 'auto'; };
  }, [hovered]);

  useFrame(() => {
    if (boardRef.current) {
      const targetScale = hovered ? 1.08 : 1;
      boardRef.current.scale.x += (targetScale - boardRef.current.scale.x) * 0.15;
      boardRef.current.scale.y += (targetScale - boardRef.current.scale.y) * 0.15;
      boardRef.current.scale.z += (targetScale - boardRef.current.scale.z) * 0.15;
      const targetZ = hovered ? 0.1 : 0;
      boardRef.current.position.z += (targetZ - boardRef.current.position.z) * 0.15;
    }
  });

  const anchorX = isLeft ? "left" : "right";
  const emojiX = isLeft ? -1.3 : 1.3;
  const textX = isLeft ? -0.8 : 0.8;

  return (
    <group
      position={position}
      onClick={(e) => { e.stopPropagation(); if (onZoneClick) onZoneClick(z); }}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
    >
      <group ref={boardRef}>
        <mesh castShadow>
          <boxGeometry args={[3.2, 0.65, 0.15]} />
          <meshStandardMaterial color={hovered ? "#F8E8E0" : "#F0D8D0"} roughness={0.9} />
        </mesh>
        <Text position={[emojiX, 0, 0.08]} fontSize={0.3} color={z.accent} anchorX={anchorX} anchorY="middle">
          {z.emoji}
        </Text>
        <Text position={[textX, 0, 0.08]} fontSize={0.22} color={hovered ? z.accent : "#3A2020"} anchorX={anchorX} anchorY="middle" letterSpacing={0.05} fontWeight="bold">
          {z.label}
        </Text>
      </group>
    </group>
  );
}

/* ─────────────────────────────────────────────
   SIGNPOST
───────────────────────────────────────────── */
function SignPost({ onZoneClick }) {
  const leftZ  = ZONES.filter(z => ["illustrations", "branding", "poster-design"].includes(z.id));
  const rightZ = ZONES.filter(z => ["3d-spatial", "motion-design", "toolkit", "contact"].includes(z.id));

  return (
    <group position={[0, 0, 5.5]} scale={2.0}>
      {/* Main Pole */}
      <mesh position={[0, 0, -0.2]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 10, 20]} />
        <meshStandardMaterial color="#4A2E1A" roughness={0.9} />
      </mesh>
      {/* Top Header Board */}
      <group position={[0, 4.6, 0]}>
        <mesh castShadow>
          <boxGeometry args={[6.2, 1.4, 0.2]} />
          <meshStandardMaterial color="#C98B8B" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0, 0.06]}>
          <boxGeometry args={[6.3, 1.5, 0.04]} />
          <meshStandardMaterial color="#D4829A" emissive="#D4829A" emissiveIntensity={0.3} transparent opacity={0.5} />
        </mesh>
        <Text position={[0, 0.25, 0.12]} fontSize={0.5} color="#FDFBF9" anchorX="center" anchorY="middle" letterSpacing={0.05} fontWeight="bold">
          RINKYA DESIGNS
        </Text>
        {/* Updated tagline — removed "EXPLORE THE UNIVERSE", replaced with designer name */}
        <Text position={[0, -0.25, 0.12]} fontSize={0.2} color="#F5E0E0" anchorX="center" anchorY="middle" letterSpacing={0.12}>
          Rinku Patel · Graphic Designer
        </Text>
      </group>
      {/* Left Boards */}
      {leftZ.map((z, i) => (
        <DirectionBoard key={z.id} z={z} position={[-1.5, 3.4 - i * 0.9, 0]} isLeft={true} onZoneClick={onZoneClick} />
      ))}
      {/* Right Boards */}
      {rightZ.map((z, i) => (
        <DirectionBoard key={z.id} z={z} position={[1.5, 3.4 - i * 0.9, 0]} isLeft={false} onZoneClick={onZoneClick} />
      ))}
      <Sparkles position={[0, 1, 0]} count={12} scale={[4, 2, 2]} size={1.5} speed={0.08} color="#FFB8CC" opacity={0.4} />
    </group>
  );
}

/* ─────────────────────────────────────────────
   FULL SCENE
───────────────────────────────────────────── */
function WorldScene({ onZone, onIntroEnd, onZoneClick }) {
  const charRef = useRef(new THREE.Group());
  const charPosRef = useRef(new THREE.Vector3(0, 0, 8));
  const camTheta = useRef(Math.PI);

  return (
    <>
      <fog attach="fog" args={['#F8EEE8', 55, 200]} />

      <Sky
        distance={450000}
        sunPosition={[8, 6, -12]}
        turbidity={4}
        rayleigh={0.4}
        mieCoefficient={0.004}
        mieDirectionalG={0.85}
      />

      <ambientLight intensity={1.1} color="#FFF5F0" />
      <hemisphereLight skyColor="#FFF5F0" groundColor="#E8D5C8" intensity={0.6} />

      <directionalLight
        position={[40, 60, 20]}
        intensity={1.6}
        color="#FFF0E8"
        castShadow
        shadow-mapSize={[512, 512]}
        shadow-camera-near={1}
        shadow-camera-far={260}
        shadow-camera-left={-110}
        shadow-camera-right={110}
        shadow-camera-top={110}
        shadow-camera-bottom={-110}
        shadow-bias={-0.0001}
      />
      <directionalLight position={[-30, 20, -25]} intensity={0.5} color="#F8E8E8" />

      <Ground />
      <AllTrees />
      <PathLabels />

      {/* Buildings — all receive onZoneClick for direct zone clicking */}
      {ZONES.map(z => <Building key={z.id} zone={z} onZoneClick={onZoneClick} />)}

      {/* Living scenes — named to match zone IDs */}
      <IllustrationsScene />
      <BrandingScene />
      <MotionDesignScene />
      <ContactScene />

      <SignPost onZoneClick={onZoneClick} />
      <Character charRef={charRef} />
      <CameraController charPosRef={charPosRef} onIntroEnd={onIntroEnd} thetaRef={camTheta} />
      <MovementSystem
        charRef={charRef}
        charPosRef={charPosRef}
        camThetaRef={camTheta}
        onZone={onZone}
      />
    </>
  );
}

/* ─────────────────────────────────────────────
   ROOT EXPORT
───────────────────────────────────────────── */
export default function ThreeWorld() {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const [activeZone, setActiveZone] = useState(null);
  const [showPanel, setShowPanel] = useState(false);
  const [panelZone, setPanelZone] = useState(null);
  const [showBooking, setShowBooking] = useState(false);
  const [introOver, setIntroOver] = useState(false);
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const rx = useRef(0), ry = useRef(0);

  useEffect(() => {
    const move = e => {
      if (dotRef.current) { dotRef.current.style.left = e.clientX + "px"; dotRef.current.style.top = e.clientY + "px"; }
      rx.current += (e.clientX - rx.current) * 0.12;
      ry.current += (e.clientY - ry.current) * 0.12;
      if (ringRef.current) { ringRef.current.style.left = rx.current + "px"; ringRef.current.style.top = ry.current + "px"; }
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  useEffect(() => {
    const kd = e => {
      if (e.key === "e" || e.key === "E") {
        if (!activeZone) return;
        if (activeZone.id === "contact") { setShowBooking(true); }
        else { setPanelZone(activeZone); setShowPanel(true); }
      }
      if (e.key === "Escape" || e.key === "Esc") { setShowPanel(false); setShowBooking(false); }
    };
    window.addEventListener("keydown", kd);
    return () => window.removeEventListener("keydown", kd);
  }, [activeZone, showPanel, showBooking]);

  // Unified handler — called by both signpost boards AND direct zone clicks
  const handleZoneClick = useCallback((zone) => {
    if (zone.id === "contact") {
      setShowBooking(true);
    } else {
      setPanelZone(zone);
      setShowPanel(true);
    }
  }, []);

  const accent = activeZone?.accent || "#D4829A";

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative", background: "#F8F0EC" }}>
      <Canvas
        camera={{ position:[0,5,15], fov:50, near:0.1, far:600 }}
        shadows={!isMobile}
        dpr={[1, isMobile ? 1 : 1.5]}
        gl={{
          antialias: !isMobile,
          powerPreference: "high-performance",
          precision: isMobile ? "lowp" : "highp",
  }}
>
        <WorldScene
          onZone={setActiveZone}
          onIntroEnd={() => setIntroOver(true)}
          onZoneClick={handleZoneClick}
        />
      </Canvas>

      {/* Custom cursor dot */}
      <div ref={dotRef} style={{
        position: "fixed", width: 8, height: 8, borderRadius: "50%",
        background: accent, pointerEvents: "none", zIndex: 9999,
        transform: "translate(-50%,-50%)", transition: "background 0.4s",
        mixBlendMode: "multiply", top: "0px", left: "0px",
      }} />
      <div ref={ringRef} style={{
        position: "fixed", width: 36, height: 36, borderRadius: "50%",
        border: `1.5px solid ${accent}90`, pointerEvents: "none", zIndex: 9998,
        transform: "translate(-50%,-50%)", transition: "border-color 0.4s",
        top: "0px", left: "0px",
      }} />

      {/* Header nav */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 60,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "20px 36px",
        background: "linear-gradient(to bottom, rgba(30,10,20,0.75), transparent)",
        pointerEvents: "none",
      }}>
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 700, letterSpacing: "0.08em", color: "#F5EDD8" }}>
          RINKYA <span style={{ color: "#D4829A" }}>✦</span> DESIGNS
        </div>
        <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", color: accent, fontWeight: 500, transition: "color 0.5s" }}>
          {activeZone ? activeZone.label : ""}
        </div>
        <div style={{ pointerEvents: "all" }}>
          <MusicPlayer worldAccent={accent} />
        </div>
      </div>

      {/* Hint bar — updated copy */}
      {!showPanel && !showBooking && introOver && (
        <div style={{
          position: "fixed", bottom: 50, left: "50%",
          transform: "translateX(-50%)", zIndex: 60,
          background: "linear-gradient(135deg, rgba(255,240,240,0.8), rgba(248,230,230,0.65))",
          backdropFilter: "blur(14px) saturate(130%)",
          WebkitBackdropFilter: "blur(14px) saturate(130%)",
          border: `1px solid rgba(212,130,154,0.35)`,
          boxShadow: `0 8px 32px 0 rgba(180,100,120,0.12)`,
          padding: "12px 32px", borderRadius: "50px",
          display: "flex", alignItems: "center", gap: 12,
          pointerEvents: "none",
          animation: "floatPulse 3s ease-in-out infinite"
        }}>
          <div style={{ fontSize: 16 }}>🌸</div>
          <div>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, letterSpacing: "0.15em", color: "#6A3040", textTransform: "uppercase", fontWeight: 600 }}>
              Click any Zone or the Signpost to Explore Work
            </div>
          </div>
          <style>{`
            @keyframes floatPulse {
              0% { transform: translate(-50%, 0px); opacity: 0.85; }
              50% { transform: translate(-50%, -6px); opacity: 1; }
              100% { transform: translate(-50%, 0px); opacity: 0.85; }
            }
          `}</style>
        </div>
      )}

      {showPanel && panelZone && <WorksPanel zone={panelZone} onClose={() => setShowPanel(false)} />}
      {showBooking && <BookingCalendar onClose={() => setShowBooking(false)} />}
    </div>
  );
}