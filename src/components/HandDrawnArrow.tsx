/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";

interface HandDrawnArrowProps {
  /** Size multiplier/preset */
  size?: "sm" | "md" | "lg";
  /** Optional rotation in degrees, e.g. 90, 180, -45 */
  rotate?: number;
  /** Optional custom Tailwind classes */
  className?: string;
  /** Custom stroke width */
  strokeWidth?: number;
  /** Custom green color overrides */
  color?: string;
  /** Delay before drawing animation starts */
  delay?: number;
  /** Infinite loop animation after drawing? */
  animateLoop?: boolean;
}

/**
 * HandDrawnArrow: A premium, beautifully stylized SVGAanimated vector representing
 * the custom hand-drawn, looping green arrow uploaded by the user.
 * 
 * It points left naturally, but can be rotated to point anywhere.
 * Animates beautifully as if it's "drawing itself" or "arriving" on mount.
 */
export default function HandDrawnArrow({
  size = "md",
  rotate = 0,
  className = "",
  strokeWidth = 3,
  color = "stroke-emerald-500 dark:stroke-emerald-400",
  delay = 0.2,
  animateLoop = true,
}: HandDrawnArrowProps) {
  // Determine standard width & height based on size presets
  const sizeClasses = {
    sm: "w-10 h-6",
    md: "w-20 h-10",
    lg: "w-32 h-16",
  };

  // SVG representation of the loop-the-loop arrow pointing left
  // Starts on the right, curves down, loops clockwise, then sweeps left and forms an arrowhead pointing left.
  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{
        transform: `rotate(${rotate}deg)`,
        transformOrigin: "center center",
      }}
    >
      <svg
        viewBox="0 0 140 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${sizeClasses[size]} overflow-visible`}
      >
        <defs>
          {/* Crayon texture filter to give it the hand-drawn sketch feel from the uploaded image */}
          <filter id="crayon-pointer-texture" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>

        <g filter="url(#crayon-pointer-texture)">
          {/* The main looping pen stroke path */}
          <motion.path
            d="M 130 20 C 112 28, 92 32, 85 24 C 80 16, 92 12, 88 26 C 82 42, 58 45, 34 38 C 22 34, 15 28, 8 28"
            className={`${color}`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: 1, 
              opacity: 1,
              x: animateLoop ? [0, -3, 0] : 0, 
              y: animateLoop ? [0, 1, 0] : 0 
            }}
            transition={{
              pathLength: { duration: 1.2, delay: delay, ease: [0.22, 1, 0.36, 1] },
              opacity: { duration: 0.3, delay: delay },
              x: {
                repeat: Infinity,
                duration: 2,
                ease: "easeInOut",
              },
              y: {
                repeat: Infinity,
                duration: 2,
                ease: "easeInOut",
              }
            }}
          />

          {/* The arrowhead top wing pointing left-up */}
          <motion.path
            d="M 8 28 Q 14 20, 18 16"
            className={`${color}`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: delay + 0.9, ease: "easeOut" }}
          />

          {/* The arrowhead bottom wing pointing left-down */}
          <motion.path
            d="M 8 28 Q 13 36, 17 40"
            className={`${color}`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: delay + 1.0, ease: "easeOut" }}
          />
        </g>
      </svg>
    </div>
  );
}

/**
 * High-fidelity 'Important' (গুরুত্বপূর্ণ) inline notification badge.
 * Includes a beautiful green hand-drawn looping arrow showing pointing entrance.
 */
export function ImportantBadge({
  text = "গুরুত্বপূর্ণ",
  subText = "",
  className = "",
}: {
  text?: string;
  subText?: string;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/5 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-extrabold text-xs select-none shadow-sm relative ${className}`}
    >
      <span className="relative z-10 flex items-center gap-1">
        <span>⭐</span>
        <span>{text}</span>
        {subText && <span className="opacity-80 font-semibold px-0.5">({subText})</span>}
      </span>
      
      {/* Hand drawn arrow pointing is floating arriving */}
      <HandDrawnArrow
        size="sm"
        rotate={10}
        strokeWidth={3.5}
        className="absolute -right-8 -top-3 scale-[0.8] drop-shadow-sm pointer-events-none"
        delay={0.5}
      />
    </motion.div>
  );
}
