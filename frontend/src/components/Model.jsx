import React, { useRef, useState, useMemo, useEffect } from "react";
import { useGLTF, useFBX, useAnimations } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { API_BASE_URL } from "../config";

// Mapping from backend viseme letters to morph target names
const corresponding = {
  A: "viseme_PP",
  B: "viseme_kk",
  C: "viseme_I",
  D: "viseme_AA",
  E: "viseme_O",
  F: "viseme_U",
  G: "viseme_FF",
  H: "viseme_TH",
  X: "viseme_PP",
};

// Fallback: multiple open visemes for varied mouth shapes
const FALLBACK_VISEMES = ["viseme_AA", "viseme_O", "viseme_E", "viseme_I", "viseme_U"];

export function Model({ audioUrl, ...props }) {
  // Load 3D model
  const { scene } = useGLTF("/models/692c2a53176ba02c5babdf21.glb");

  // Load animations
  const idleFBX = useFBX("/animations/idle.fbx");
  const greetFBX = useFBX("/animations/greeting.fbx");

  const idleClip = useMemo(() => {
    const c = idleFBX.animations[0].clone();
    c.name = "idle";
    return c;
  }, [idleFBX]);

  const greetClip = useMemo(() => {
    const c = greetFBX.animations[0].clone();
    c.name = "greeting";
    return c;
  }, [greetFBX]);

  const allAnimations = useMemo(() => [idleClip, greetClip], [idleClip, greetClip]);
  const group = useRef();
  const [animation, setAnimation] = useState("idle");
  const { actions } = useAnimations(allAnimations, group);

  // Refs for morphable meshes
  const headMesh = useRef();
  const teethMesh = useRef();

  // Audio and lipsync state
  const [audio, setAudio] = useState(null);
  const [lipsync, setLipsync] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Store fallback viseme indices once found
  const fallbackVisemeIndices = useRef([]);
  const [fallbackReady, setFallbackReady] = useState(false);

  // Clone model to safely manipulate
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);

  // Find head and teeth meshes after cloning
  useEffect(() => {
    clone.traverse((child) => {
      if (child.isMesh) {
        if (child.name === "Wolf3D_Head") {
          headMesh.current = child;
          console.log("Head mesh found. Morph targets:", child.morphTargetDictionary);
        }
        if (child.name === "Wolf3D_Teeth") {
          teethMesh.current = child;
          console.log("Teeth mesh found. Morph targets:", child.morphTargetDictionary);
        }
      }
    });
  }, [clone]);

  // Determine which fallback visemes exist
  useEffect(() => {
    if (headMesh.current && !fallbackReady) {
      const dict = headMesh.current.morphTargetDictionary;
      const indices = [];
      for (const name of FALLBACK_VISEMES) {
        if (dict[name] !== undefined) {
          indices.push(dict[name]);
        }
      }
      if (indices.length > 0) {
        console.log("Using fallback visemes indices:", indices);
        fallbackVisemeIndices.current = indices;
        setFallbackReady(true);
      }
    }
  }, [headMesh.current, fallbackReady]);

  // Play greeting animation once on mount
  useEffect(() => {
    setAnimation("greeting");
    const timer = setTimeout(() => {
      setAnimation("idle");
    }, 3000); // adjust to match greeting length

    return () => clearTimeout(timer);
  }, []);

  // Reset morphs when not playing (ensures mouth closes)
  useEffect(() => {
    if (!isPlaying) {
      const h = headMesh.current;
      const t = teethMesh.current;
      if (h && t) {
        Object.values(corresponding).forEach((v) => {
          const hi = h.morphTargetDictionary[v];
          const ti = t.morphTargetDictionary[v];
          if (hi !== undefined) h.morphTargetInfluences[hi] = 0;
          if (ti !== undefined) t.morphTargetInfluences[ti] = 0;
        });
      }
    }
  }, [isPlaying]);

  // Load audio and JSON when audioUrl changes
  useEffect(() => {
    if (!audioUrl) {
      setAudio(null);
      setLipsync(null);
      setIsPlaying(false);
      return;
    }

    const loadAudioAndJSON = async () => {
      try {
        const fullAudioUrl = audioUrl.startsWith('http') ? audioUrl : `${API_BASE_URL}${audioUrl}`;
        const jsonUrl = fullAudioUrl.replace(/\.mp3$/, ".json");

        // Try to load viseme JSON
        let jsonData = null;
        try {
          const jsonResponse = await fetch(jsonUrl);
          if (jsonResponse.ok) {
            jsonData = await jsonResponse.json();
            setLipsync(jsonData);
            console.log("Viseme JSON loaded, using accurate lip-sync");
          } else {
            console.log("No viseme JSON found, using refined fallback");
          }
        } catch {
          console.log("No viseme JSON found, using refined fallback");
        }

        // Load audio
        const audioObj = new Audio(fullAudioUrl);
        audioObj.addEventListener("ended", () => {
          console.log("Audio ended");
          setIsPlaying(false);
        });
        setAudio(audioObj);
        setIsPlaying(true);
        audioObj.play().catch(e => console.error("Audio play failed:", e));
      } catch (error) {
        console.error("Failed to load audio:", error);
      }
    };

    loadAudioAndJSON();

    return () => {
      if (audio) {
        audio.pause();
        audio.removeEventListener("ended", () => {});
      }
    };
  }, [audioUrl]);

  // Animation effect
  useEffect(() => {
    actions[animation]?.reset().fadeIn(0.5).play();
    return () => actions[animation]?.fadeOut(0.5);
  }, [animation, actions]);

  // Lip-sync frame loop
  useFrame(() => {
    const h = headMesh.current;
    const t = teethMesh.current;
    if (!h || !t || !isPlaying || !audio || audio.paused) return;

    const currentTime = audio.currentTime;

    // Reset all visemes (cues will set the active one)
    Object.values(corresponding).forEach((v) => {
      const hi = h.morphTargetDictionary[v];
      const ti = t.morphTargetDictionary[v];
      if (hi !== undefined) h.morphTargetInfluences[hi] = 0;
      if (ti !== undefined) t.morphTargetInfluences[ti] = 0;
    });

    // If no lipsync data, use refined fallback
    if (!lipsync) {
      if (fallbackVisemeIndices.current.length > 0) {
        const index = Math.floor(currentTime * 6) % fallbackVisemeIndices.current.length;
        const visemeIdx = fallbackVisemeIndices.current[index];
        const intensity = 0.5 + 0.5 * Math.sin(currentTime * 8);
        h.morphTargetInfluences[visemeIdx] = intensity;

        // Match teeth if possible
        if (t.morphTargetDictionary) {
          const visemeName = Object.keys(h.morphTargetDictionary).find(key => h.morphTargetDictionary[key] === visemeIdx);
          if (visemeName) {
            const teethIdx = t.morphTargetDictionary[visemeName];
            if (teethIdx !== undefined) {
              t.morphTargetInfluences[teethIdx] = intensity * 0.8;
            }
          }
        }
      } else {
        // Fallback not ready – try any open viseme
        for (const name of FALLBACK_VISEMES) {
          const idx = h.morphTargetDictionary[name];
          if (idx !== undefined) {
            const intensity = 0.5 + 0.5 * Math.sin(currentTime * 8);
            h.morphTargetInfluences[idx] = intensity;
            break;
          }
        }
      }
      return;
    }

    // Normal lip-sync with cues
    for (let cue of lipsync.mouthCues) {
      if (currentTime >= cue.start && currentTime <= cue.end) {
        const viseme = corresponding[cue.value];
        const hi = h.morphTargetDictionary[viseme];
        const ti = t.morphTargetDictionary[viseme];
        if (hi !== undefined) h.morphTargetInfluences[hi] = 1;
        if (ti !== undefined) t.morphTargetInfluences[ti] = 0.8;
        break;
      }
    }
  });

  return <group ref={group} {...props} dispose={null}><primitive object={clone} /></group>;
}

// Preload model
useGLTF.preload("/models/692c2a53176ba02c5babdf21.glb");