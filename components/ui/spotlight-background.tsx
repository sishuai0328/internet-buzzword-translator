"use client";

import { useMotionValue, motion, useMotionTemplate } from "framer-motion";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { CanvasRevealEffect } from "./canvas-reveal-effect";

export const SpotlightBackground = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  let mouseX = useMotionValue(0);
  let mouseY = useMotionValue(0);
  const [isHovering, setIsHovering] = useState(false);

  function handleMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: React.MouseEvent<HTMLDivElement>) {
    if (!currentTarget) return;
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      className={cn("relative w-full h-full group", className)}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              600px circle at ${mouseX}px ${mouseY}px,
              hsl(var(--primary) / 0.1),
              transparent 40%
            )
          `,
        }}
      />
      {isHovering && (
        <CanvasRevealEffect
            animationSpeed={3}
            containerClassName="absolute inset-0 pointer-events-none"
            colors={[
              [68, 40, 137], // primary HSL(262, 55%, 35%)
              [139, 92, 246], // a lighter purple from the original component
            ]}
            dotSize={2}
            opacities={[0.2, 0.2, 0.2, 0.4, 0.4, 0.4, 0.8, 0.8, 0.8, 1]}
        />
      )}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}; 