"use client";

import type {
  ReactNode,
  ElementType,
  ComponentPropsWithoutRef,
  CSSProperties,
} from "react";
import {
  LazyMotion,
  domAnimation,
  m,
  useReducedMotion,
  type Variants,
} from "framer-motion";

const viewport = { once: true, amount: 0.16 };
const ease = [0.16, 1, 0.3, 1] as const;

type MotionChildrenProps = {
  children: ReactNode;
};

type SoftRevealProps = MotionChildrenProps & {
  className?: string;
  delay?: number;
  distance?: number;
};

type MaskRevealProps = MotionChildrenProps & {
  className?: string;
  delay?: number;
  direction?: "up" | "left";
  rounded?: string;
};

type SplitRevealProps<T extends ElementType> = {
  as?: T;
  text: string;
  className?: string;
  mode?: "words" | "lines";
  delay?: number;
  lineClassNames?: string[];
} & Omit<ComponentPropsWithoutRef<T>, "children">;

type ParallaxAccentProps = {
  className?: string;
  yRange?: [number, number];
  xRange?: [number, number];
  rotateRange?: [number, number];
};

type StaggerGroupProps = MotionChildrenProps & {
  className?: string;
  delayChildren?: number;
  stagger?: number;
};

type StaggerItemProps = MotionChildrenProps & {
  className?: string;
};

export function MotionProvider({ children }: MotionChildrenProps) {
  return <LazyMotion features={domAnimation}>{children}</LazyMotion>;
}

export function SoftReveal({
  children,
  className,
  delay = 0,
  distance = 14,
}: SoftRevealProps) {
  const reduceMotion = useReducedMotion();

  return (
    <m.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: distance }}
      whileInView={{
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.72,
          delay,
          ease,
        },
      }}
      viewport={viewport}
    >
      {children}
    </m.div>
  );
}

export function MaskReveal({
  children,
  className,
  delay = 0,
  direction = "up",
  rounded = "0rem",
}: MaskRevealProps) {
  const reduceMotion = useReducedMotion();
  const initialAxis = direction === "left" ? { x: 28, y: 0 } : { x: 0, y: 18 };
  const style = { borderRadius: rounded } as CSSProperties;

  return (
    <div className={className} style={style}>
      <m.div
        className="h-full w-full"
        initial={reduceMotion ? false : { opacity: 0, ...initialAxis }}
        whileInView={{
          opacity: 1,
          x: 0,
          y: 0,
          transition: {
            duration: 0.82,
            delay,
            ease,
          },
        }}
        viewport={viewport}
      >
        {children}
      </m.div>
    </div>
  );
}

export function SplitReveal<T extends ElementType = "div">({
  as,
  text,
  className,
  mode = "words",
  delay = 0,
  lineClassNames,
  ...props
}: SplitRevealProps<T>) {
  const reduceMotion = useReducedMotion();
  const Tag = (as ?? "div") as ElementType;
  const pieces = mode === "lines" ? text.split("\n") : text.split(" ");
  const childVariants: Variants = {
    hidden: reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: "0.85em" },
    visible: {
      opacity: 1,
      y: "0em",
      transition: {
        duration: 0.72,
        ease,
      },
    },
  };

  return (
    <m.div
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={{
        hidden: {},
        visible: {
          transition: {
            delayChildren: delay,
            staggerChildren: mode === "lines" ? 0.1 : 0.04,
          },
        },
      }}
    >
      <Tag className={className} {...props}>
        {pieces.map((piece, index) => (
          <span
            key={`${piece}-${index}`}
            className={
              mode === "lines"
                ? "block overflow-hidden pt-[0.08em] pb-[0.16em]"
                : "split-word"
            }
          >
            <m.span
              className={
                mode === "lines"
                  ? `block ${lineClassNames?.[index] ?? ""}`
                  : ""
              }
              variants={childVariants}
            >
              {piece}
            </m.span>
          </span>
        ))}
      </Tag>
    </m.div>
  );
}

export function StaggerGroup({
  children,
  className,
  delayChildren = 0.05,
  stagger = 0.07,
}: StaggerGroupProps) {
  return (
    <m.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={{
        hidden: {},
        visible: {
          transition: {
            delayChildren,
            staggerChildren: stagger,
          },
        },
      }}
    >
      {children}
    </m.div>
  );
}

export function StaggerItem({ children, className }: StaggerItemProps) {
  const reduceMotion = useReducedMotion();

  return (
    <m.div
      className={className}
      variants={{
        hidden: reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.68,
            ease,
          },
        },
      }}
    >
      {children}
    </m.div>
  );
}

export function ParallaxAccent({
  className,
  yRange = [-18, 34],
  xRange = [0, 0],
  rotateRange = [-4, 5],
}: ParallaxAccentProps) {
  const reduceMotion = useReducedMotion();

  return (
    <m.span
      className={className}
      initial={
        reduceMotion
          ? false
          : {
              opacity: 0,
              x: xRange[0] * 0.28,
              y: yRange[0] * 0.28,
              rotate: rotateRange[0] * 0.28,
              scale: 0.96,
            }
      }
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
        rotate: 0,
        scale: 1,
        transition: {
          duration: 0.9,
          ease,
        },
      }}
      viewport={viewport}
    />
  );
}
