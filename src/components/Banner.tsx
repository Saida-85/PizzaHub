"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const SLICE_COUNT = 6;
const SPREAD = 27; // % of pizza size each slice moves outward
const OPEN_DELAY = 0.7; // seconds the whole pizza is shown before it opens
const OVERLAP_DEG = 0.5; // tiny wedge overlap to hide hairline seams

const SLICES = Array.from({ length: SLICE_COUNT }, (_, i) => {
  const step = 360 / SLICE_COUNT;
  const center = -90 + i * step;
  const a1 = ((center - step / 2 - OVERLAP_DEG) * Math.PI) / 180;
  const a2 = ((center + step / 2 + OVERLAP_DEG) * Math.PI) / 180;
  const R = 150;
  const clip = `polygon(50% 50%, ${50 + R * Math.cos(a1)}% ${
    50 + R * Math.sin(a1)
  }%, ${50 + R * Math.cos(a2)}% ${50 + R * Math.sin(a2)}%)`;
  const rad = (center * Math.PI) / 180;
  return {
    clip,
    x: `${(SPREAD * Math.cos(rad)).toFixed(2)}%`,
    y: `${(SPREAD * Math.sin(rad)).toFixed(2)}%`,
    rotate: i % 2 === 0 ? -4 : 4,
    delay: OPEN_DELAY + i * 0.06,
  };
});

const NO_SHADOW = "drop-shadow(0px 0px 0px rgba(0,0,0,0))";
const SHADOW = "drop-shadow(0px 12px 18px rgba(0,0,0,0.55))";

export default function HeroBanner() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative w-full min-h-[88vh] bg-[#0B1315] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-16 overflow-hidden border-b border-[#D4A359]/20">
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] sm:w-[520px] sm:h-[520px] rounded-full bg-[#E05A2B]/15 blur-3xl"
      />

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center text-center">
        {/* Small label */}
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-2 flex items-center gap-3 text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#D4A359]"
        >
          <span className="h-px w-8 bg-[#D4A359]/60" />
          Local pizzerias · Delivered hot
          <span className="h-px w-8 bg-[#D4A359]/60" />
        </motion.p>

        {/* Square container so slices cut through the true pizza center */}
        <div className="relative aspect-square w-[220px] sm:w-[300px] md:w-[380px] my-24 sm:my-28">
          {/* BEHIND LAYER: headline revealed in the open band */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.7,
              delay: reduceMotion ? 0 : OPEN_DELAY + 0.3,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
          >
            <h1 className="font-heading text-base sm:text-2xl md:text-4xl font-semibold tracking-tight leading-[1.1] whitespace-nowrap drop-shadow-[0_4px_16px_rgba(11,19,21,0.95)]">
              <span className="block text-white">Cheese Pulls</span>
              <span className="block italic font-medium text-[#D4A359]">
                Worth Waiting For.
              </span>
            </h1>
          </motion.div>

          {/* 6 SLICES (underneath, shadows fade in only once they move) */}
          {SLICES.map((s, i) => (
            <motion.div
              key={i}
              initial={{ x: "0%", y: "0%", rotate: 0, filter: NO_SHADOW }}
              animate={{ x: s.x, y: s.y, rotate: s.rotate, filter: SHADOW }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : {
                      x: {
                        type: "spring",
                        stiffness: 70,
                        damping: 13,
                        mass: 0.9,
                        delay: s.delay,
                      },
                      y: {
                        type: "spring",
                        stiffness: 70,
                        damping: 13,
                        mass: 0.9,
                        delay: s.delay,
                      },
                      rotate: {
                        type: "spring",
                        stiffness: 70,
                        damping: 13,
                        mass: 0.9,
                        delay: s.delay,
                      },
                      filter: {
                        duration: 0.8,
                        delay: s.delay,
                        ease: "easeOut",
                      },
                    }
              }
              className="absolute inset-0 z-20 pointer-events-none"
            >
              {/* clip-path on the inner layer so the shadow isn't clipped */}
              <div className="absolute inset-0" style={{ clipPath: s.clip }}>
                <Image
                  src="/bannerPizza.png"
                  alt=""
                  aria-hidden="true"
                  fill
                  priority
                  sizes="(min-width: 768px) 380px, 300px"
                  className="object-contain"
                />
              </div>
            </motion.div>
          ))}

          {/* WHOLE PIZZA: shown untouched at first, then removed as the slices open */}
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{
              duration: 0.01,
              delay: reduceMotion ? 0 : OPEN_DELAY,
            }}
            className="absolute inset-0 z-30 pointer-events-none"
          >
            <Image
              src="/bannerPizza.png"
              alt="Freshly baked pizza"
              fill
              priority
              sizes="(min-width: 768px) 380px, 300px"
              className="object-contain"
            />
          </motion.div>
        </div>

        {/* Supporting Description */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: reduceMotion ? 0 : OPEN_DELAY + 0.5,
          }}
          className="font-body text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed"
        >
          Discover top-rated local pizzerias, hand-stretched sourdough crusts,
          and bubbling mozzarella baked fresh and delivered straight to your
          doorstep.
        </motion.p>

        {/* Primary CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: reduceMotion ? 0 : OPEN_DELAY + 0.6,
          }}
          className="mt-8"
        >
          <Button
            asChild
            size="lg"
            className="font-body bg-[#E05A2B] hover:bg-[#c84b20] text-white rounded-none px-8 py-6 text-xs uppercase tracking-[0.2em] font-semibold shadow-lg shadow-[#E05A2B]/25 transition-all"
          >
            <Link href="/menu" className="flex items-center gap-3">
              Explore Pizza Menu
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
