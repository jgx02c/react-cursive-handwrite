// src/components/HandwritingText.tsx
import React, { useEffect, useMemo, ElementType } from "react";
import { motion, useAnimation } from "framer-motion";
import { defaultPath } from "../fonts/defaultPath";

interface HandwritingTextProps {
  /** The text to be displayed */
  children: React.ReactNode;
  /** SVG path data for the text. If not provided, uses the default cursive path */
  path?: string;
  /** Imported SVG file path */
  svgFile?: string;
  /** Color of the stroke */
  strokeColor?: string;
  /** Width of the stroke */
  strokeWidth?: number;
  /** Duration of the animation in seconds */
  duration?: number;
  /** Width of the SVG viewport */
  width?: number | string;
  /** Height of the SVG viewport */
  height?: number | string;
  /** Initial stroke dash array value (defaults to 2000) */
  strokeDashArray?: number;
  /** HTML element type to wrap the text (defaults to 'div') */
  as?: ElementType;
}

export const HandwritingText: React.FC<HandwritingTextProps> = ({
  children,
  path = defaultPath,
  svgFile,
  strokeColor = "#000",
  strokeWidth = 2,
  duration = 3,
  width = "100%",
  height = "100%",
  strokeDashArray = 2000,
  as: Component = "div",
}) => {
  const controls = useAnimation();
  const [svgContent, setSvgContent] = React.useState<string | null>(null);

  // Load SVG file if provided
  useEffect(() => {
    if (svgFile) {
      fetch(svgFile)
        .then(response => response.text())
        .then(text => {
          // Extract path data from SVG
          const parser = new DOMParser();
          const doc = parser.parseFromString(text, 'image/svg+xml');
          const pathElement = doc.querySelector('path');
          if (pathElement) {
            setSvgContent(pathElement.getAttribute('d') || null);
          }
        })
        .catch(error => console.error('Error loading SVG:', error));
    }
  }, [svgFile]);

  // Calculate viewBox based on path dimensions
  const viewBox = useMemo(() => {
    const pathToUse = svgContent || path;
    const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pathElement.setAttribute("d", pathToUse);
    const bbox = pathElement.getBBox();
    return `0 0 ${bbox.width} ${bbox.height}`;
  }, [path, svgContent]);

  useEffect(() => {
    controls.start({
      strokeDashoffset: 0,
      transition: { duration, ease: "easeInOut" },
    });
  }, [controls, duration]);

  return (
    <Component style={{ position: 'relative', display: 'inline-block' }}>
      <svg
        width={width}
        height={height}
        viewBox={viewBox}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: 'absolute', top: 0, left: 0, overflow: "visible" }}
      >
        <motion.path
          d={svgContent || path}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={strokeDashArray}
          strokeDashoffset={strokeDashArray}
          animate={controls}
        />
      </svg>
      <span style={{ visibility: 'hidden' }}>{children}</span>
    </Component>
  );
};