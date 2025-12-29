import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, ContactShadows } from "@react-three/drei";
import { Suspense } from "react";
import Avatar from "./Avatar";

interface ExperienceProps {
    audioUrl: string | null;
    isPlaying: boolean;
    onEnded: () => void;
}

export const Experience = ({ audioUrl, isPlaying, onEnded }: ExperienceProps) => {
    return (
        <Canvas key="portrait-final-v12" shadows camera={{ position: [0, 0.5, 1.5], fov: 25 }}>
            {/* Debugging: Background Color */}
            <color attach="background" args={['#ffffff']} />

            {/* Lighting */}
            <ambientLight intensity={1.2} />
            <directionalLight position={[-2, 5, 5]} intensity={1.5} shadow-mapSize={1024} castShadow />
            <spotLight position={[5, 2, 5]} angle={0.5} penumbra={1} intensity={1} />

            <Environment preset="city" />

            {/* The Avatar */}
            {/* 
               FINAL PORTRAIT CALIBRATION:
               - Origin is Top of Head (0,0,0).
               - Move Group DOWN (-0.15) to make room for hair.
               - Move Camera DOWN (0.5) to keep eye level aligned.
               - Rotate X (-0.1) slightly to tilt head down/forward as requested.
            */}
            <group position={[0, -0.15, 0]} rotation={[-0.1, 0, 0]}>
                <Suspense fallback={null}>
                    <Avatar audioUrl={audioUrl} isPlaying={isPlaying} onEnded={onEnded} />
                </Suspense>
            </group>

            <ContactShadows opacity={0.5} scale={10} blur={2} far={4} resolution={256} color="#000000" />

            {/* Locked Controls */}
            <OrbitControls target={[0, 0, 0]} enableZoom={false} enablePan={false} enableRotate={false} />
        </Canvas>
    );
};

export default Experience;
