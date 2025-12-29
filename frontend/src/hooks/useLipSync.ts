import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";

const LIP_SYNC_SMOOTHING = 0.5;
const MIN_DECIBELS = -30;

export const useLipSync = (
    audioUrl: string | null,
    isPlaying: boolean,
    onEnded?: () => void
) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const dataArrayRef = useRef<Uint8Array | null>(null);
    const mouthOpenRef = useRef(0);

    useEffect(() => {
        if (!audioUrl || !isPlaying) return;

        const audio = new Audio(audioUrl);
        audioRef.current = audio;
        audio.crossOrigin = "anonymous"; // Safe for local blobs/data URIs too

        // Cross-browser AudioContext creation
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        const audioContext = new AudioContext();

        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        analyser.minDecibels = -90;
        analyser.maxDecibels = -10;
        analyser.smoothingTimeConstant = 0.85;

        // Resume context if suspended (browser autoplay policy)
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }

        const source = audioContext.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(audioContext.destination);

        analyserRef.current = analyser;
        dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);

        audio.onended = () => {
            if (onEnded) onEnded();
        };

        audio.play().catch(e => {
            console.error("Playback error:", e);
            // If autoplay fails, we might need to alert the user or try resuming again
            if (audioContext.state === 'suspended') audioContext.resume();
        });

        return () => {
            audio.pause();
            audio.src = "";
            source.disconnect();
            analyser.disconnect();
            audioContext.close();
        };
    }, [audioUrl, isPlaying]);

    useFrame(() => {
        if (!analyserRef.current || !dataArrayRef.current || !isPlaying) {
            mouthOpenRef.current = 0;
            return;
        }

        analyserRef.current.getByteFrequencyData(dataArrayRef.current);

        // Get average volume from frequency data
        let sum = 0;
        const binCount = dataArrayRef.current.length;
        // We focus on lower-mid frequencies for voice activity
        for (let i = 0; i < binCount; i++) {
            sum += dataArrayRef.current[i];
        }
        const average = sum / binCount;

        // Normalize (0-255) to (0-1) for morph targets
        // Apply sensitivity threshold
        // BOOST: Lowered threshold from 10 to 5, lowered divisor from 100 to 50 for 2x gain
        let normalized = Math.max(0, (average - 5) / 50);

        // Clamp at 1.0 to prevent distortion
        normalized = Math.min(1.0, normalized);

        // Smooth transition
        mouthOpenRef.current += (normalized - mouthOpenRef.current) * LIP_SYNC_SMOOTHING;
    });

    return {
        mouthOpen: mouthOpenRef
    };
};
