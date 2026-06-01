import { AccessibilityInfo } from "react-native";
import { useEffect, useState } from "react";
import { motion } from "./tokens";

export function useReduceMotion() {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const subscription = AccessibilityInfo.addEventListener("reduceMotionChanged", setReduceMotion);
    return () => subscription.remove();
  }, []);

  return reduceMotion;
}

export function getMotionToken(name: keyof typeof motion, reduceMotion: boolean) {
  return reduceMotion ? { duration: 0 } : motion[name];
}
