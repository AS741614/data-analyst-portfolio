import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// --- CUSTOM GLSL SHADERS FOR BACKGROUND PARTICLES ---
const BackgroundParticleShader = {
  vertexShader: `
    uniform float uTime;
    uniform float uScroll;
    varying vec3 vPosition;
    varying float vAlpha;

    void main() {
      vPosition = position;
      
      // Cyber-organic wave animation using trigonometric wave summation
      vec3 pos = position;
      float angleX = uTime * 0.15 + position.y * 0.04;
      float angleY = uTime * 0.12 + position.x * 0.03;
      pos.x += sin(angleX) * 12.0;
      pos.y += cos(angleY) * 8.0;
      pos.z += sin(angleX + angleY) * 10.0;

      // Scroll parallax factor
      pos.y -= uScroll * 18.0;

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mvPosition;

      // Attenuate point size by distance from camera
      gl_PointSize = (180.0 / -mvPosition.z) * (1.2 + sin(uTime * 1.5 + position.x) * 0.4);
      
      // Calculate alpha fading based on depth
      vAlpha = clamp((350.0 + mvPosition.z) / 350.0, 0.1, 0.7);
    }
  `,
  fragmentShader: `
    uniform vec3 uColorCyan;
    uniform vec3 uColorPurple;
    uniform vec3 uColorPink;
    varying vec3 vPosition;
    varying float vAlpha;

    void main() {
      // Soft round particle math
      vec2 coord = gl_PointCoord - vec2(0.5);
      if (dot(coord, coord) > 0.25) discard;
      
      float dist = length(coord);
      float strength = smoothstep(0.5, 0.05, dist) * vAlpha;

      // Dynamic color interpolation across vertical position
      float factor = clamp((vPosition.y + 120.0) / 240.0, 0.0, 1.0);
      vec3 color = mix(uColorCyan, uColorPurple, factor);
      if (vPosition.z > 50.0) {
        color = mix(color, uColorPink, 0.4);
      }

      gl_FragColor = vec4(color, strength);
    }
  `
};

// --- WEBGL DEFORMING GRID TERRAIN (Asset 2 Upgrade) ---
function TerrainGrid() {
  const meshRef = useRef();
  const materialRef = useRef();
  const [scrollPos, setScrollPos] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const pct = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      setScrollPos(pct);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = elapsed;
      // Scroll shifts the mesh uniforms for continuous flow feel
      materialRef.current.uniforms.uScroll.value = THREE.MathUtils.lerp(
        materialRef.current.uniforms.uScroll.value,
        scrollPos,
        0.08
      );
    }
    if (meshRef.current) {
      meshRef.current.rotation.z = elapsed * 0.015;
    }
  });

  const uniforms = React.useMemo(() => ({
    uTime: { value: 0 },
    uScroll: { value: 0 },
    uColorCyan: { value: new THREE.Color('#00f0ff') },
    uColorPurple: { value: new THREE.Color('#b026ff') }
  }), []);

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2.3, 0, 0]} position={[0, -22, -15]}>
      <planeGeometry args={[140, 140, 36, 36]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={`
          uniform float uTime;
          uniform float uScroll;
          varying vec3 vPosition;
          varying float vElevation;

          void main() {
            vPosition = position;
            
            // Undulating grid movement
            vec3 pos = position;
            float z = sin(pos.x * 0.08 + uTime * 0.6) * cos(pos.y * 0.08 + uTime * 0.4) * 4.8;
            z += sin(pos.x * 0.2 - uTime * 1.2) * 0.8;
            
            // Adjust elevation based on scroll
            pos.z += z - (uScroll * 2.0);
            vElevation = z;

            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_Position = projectionMatrix * mvPosition;
          }
        `}
        fragmentShader={`
          uniform vec3 uColorCyan;
          uniform vec3 uColorPurple;
          varying vec3 vPosition;
          varying float vElevation;

          void main() {
            // Blend cyan and purple colors on grid height
            float factor = clamp((vElevation + 5.0) / 10.0, 0.0, 1.0);
            vec3 color = mix(uColorCyan, uColorPurple, factor);
            
            // Boundary grid edge fadeout
            float dist = length(vPosition.xy);
            float alpha = smoothstep(70.0, 25.0, dist) * 0.35;

            gl_FragColor = vec4(color, alpha);
          }
        `}
        uniforms={uniforms}
        wireframe={true}
        transparent={true}
        depthWrite={false}
      />
    </mesh>
  );
}

export function Advanced3DBackground() {
  return (
    <div className="webgl-bg" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -3, pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 0, 45], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <TerrainGrid />
      </Canvas>
    </div>
  );
}

// --- HERO CENTERPIECE (Pulsing Icosahedron Core) ---
function HeroCoreMesh() {
  const meshRef = useRef();
  const coreRef = useRef();
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMouse({
        x: (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2),
        y: (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2)
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    
    if (meshRef.current) {
      // Passive rotation
      meshRef.current.rotation.y = elapsed * 0.12;
      meshRef.current.rotation.x = elapsed * 0.08;

      // Mouse Parallax tilt
      meshRef.current.rotation.y += mouse.x * 0.3;
      meshRef.current.rotation.x += mouse.y * 0.3;
    }

    if (coreRef.current) {
      // Core pulsation
      const scale = 1.35 + Math.sin(elapsed * 2.5) * 0.15;
      coreRef.current.scale.set(scale, scale, scale);
      coreRef.current.rotation.z = -elapsed * 0.3;
    }
  });

  return (
    <group>
      {/* Volumetric ambient point light inside the shape */}
      <pointLight position={[0, 0, 0]} intensity={18} color="#00f0ff" distance={30} />
      
      {/* Outer Wireframe Icosahedron */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[2.5, 1]} />
        <meshBasicMaterial 
          color="#00f0ff" 
          wireframe={true} 
          transparent={true} 
          opacity={0.65} 
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Inner Glowing Energy Core */}
      <mesh ref={coreRef}>
        <dodecahedronGeometry args={[0.7, 0]} />
        <meshStandardMaterial 
          color="#b026ff" 
          emissive="#ff006e"
          emissiveIntensity={2.5}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* Outer Satellites Orbit */}
      <SatelliteOrbit speed={1.1} radius={4.2} size={0.15} color="#ff006e" />
      <SatelliteOrbit speed={-0.8} radius={5.0} size={0.12} color="#00ff94" />
    </group>
  );
}

function SatelliteOrbit({ speed, radius, size, color }) {
  const ref = useRef();
  useFrame((state) => {
    const t = state.clock.getElapsedTime() * speed;
    if (ref.current) {
      ref.current.position.set(
        Math.cos(t) * radius,
        Math.sin(t * 1.5) * 0.4 * radius,
        Math.sin(t) * radius
      );
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[size, 16, 16]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}

export function Hero3DWebGL() {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '380px', position: 'relative' }}>
      <Canvas camera={{ position: [0, 0, 7.5], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 10]} intensity={1.5} />
        <HeroCoreMesh />
      </Canvas>
    </div>
  );
}

// --- PROJECT DETAIL PREVIEWS (WebGL geometry renders inside card slots) ---
function VaultMesh({ hovered }) {
  const ref = useRef();
  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    ref.current.rotation.y = elapsed * (hovered ? 0.8 : 0.2);
    ref.current.rotation.x = elapsed * 0.15;
  });

  return (
    <group ref={ref}>
      <mesh>
        <boxGeometry args={[1.8, 1.8, 1.8]} />
        <meshStandardMaterial 
          color="#00f0ff" 
          wireframe={true} 
          transparent={true} 
          opacity={0.7} 
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.65, 32, 32]} />
        <meshStandardMaterial 
          color="#b026ff" 
          emissive="#b026ff" 
          emissiveIntensity={1.5}
        />
      </mesh>
    </group>
  );
}

function RAGMesh({ hovered }) {
  const ref = useRef();
  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    ref.current.rotation.y = elapsed * (hovered ? 0.9 : 0.25);
    ref.current.rotation.z = elapsed * 0.12;
  });

  return (
    <group ref={ref}>
      <mesh>
        <sphereGeometry args={[1.3, 12, 12]} />
        <meshStandardMaterial 
          color="#b026ff" 
          wireframe={true} 
          transparent={true} 
          opacity={0.8}
        />
      </mesh>
      <mesh>
        <octahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial 
          color="#ff006e" 
          emissive="#ff006e" 
          emissiveIntensity={1.8}
        />
      </mesh>
    </group>
  );
}

function PipelineMesh({ hovered }) {
  const ref = useRef();
  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    ref.current.rotation.y = elapsed * (hovered ? 1.0 : 0.3);
    ref.current.rotation.x = elapsed * 0.2;
  });

  return (
    <group ref={ref}>
      <mesh>
        <torusGeometry args={[1.1, 0.22, 12, 48]} />
        <meshStandardMaterial 
          color="#ff006e" 
          wireframe={true} 
          transparent={true}
          opacity={0.75}
        />
      </mesh>
      <mesh>
        <cylinderGeometry args={[0.1, 0.1, 2.5, 12]} />
        <meshStandardMaterial color="#00ff94" />
      </mesh>
    </group>
  );
}

function LeadScoringMesh({ hovered }) {
  const ref = useRef();
  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    ref.current.rotation.y = elapsed * (hovered ? 0.95 : 0.25);
    ref.current.rotation.x = elapsed * 0.35;
  });

  return (
    <group ref={ref}>
      <mesh>
        <dodecahedronGeometry args={[1.3, 0]} />
        <meshStandardMaterial 
          color="#00ff94" 
          wireframe={true} 
          transparent={true} 
          opacity={0.7}
        />
      </mesh>
      <mesh>
        <tetrahedronGeometry args={[0.6, 0]} />
        <meshStandardMaterial 
          color="#00f0ff" 
          emissive="#00f0ff" 
          emissiveIntensity={1.2}
        />
      </mesh>
    </group>
  );
}

function PRBotMesh({ hovered }) {
  const ref = useRef();
  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    ref.current.rotation.y = elapsed * (hovered ? 1.1 : 0.3);
    ref.current.rotation.z = elapsed * 0.2;
  });

  return (
    <group ref={ref}>
      <mesh>
        <octahedronGeometry args={[1.2, 1]} />
        <meshStandardMaterial 
          color="#00f0ff" 
          wireframe={true} 
          transparent={true} 
          opacity={0.7}
        />
      </mesh>
      <mesh>
        <boxGeometry args={[0.4, 0.4, 0.4]} />
        <meshStandardMaterial 
          color="#00ff94" 
          emissive="#00ff94" 
          emissiveIntensity={1.5}
        />
      </mesh>
    </group>
  );
}

export function ProjectWebGLPreview({ projectId }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div 
      style={{ width: '100%', height: '100%', minHeight: '180px' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Canvas camera={{ position: [0, 0, 3.2], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} intensity={2.0} />
        
        {projectId === 'project-01' && <VaultMesh hovered={hovered} />}
        {projectId === 'project-02' && <RAGMesh hovered={hovered} />}
        {projectId === 'project-03' && <PipelineMesh hovered={hovered} />}
        {projectId === 'project-04' && <LeadScoringMesh hovered={hovered} />}
        {projectId === 'project-05' && <PRBotMesh hovered={hovered} />}
      </Canvas>
    </div>
  );
}
