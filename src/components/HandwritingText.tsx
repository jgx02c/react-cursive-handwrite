// src/components/HandwritingText.tsx
import React, { useEffect, ElementType } from "react";
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
  strokeDashArray = 2000,
  as: Component = "div",
}) => {
  const controls = useAnimation();
  const [svgContent, setSvgContent] = React.useState<string | null>(null);
  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });

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

  // Calculate viewBox and dimensions based on path
  useEffect(() => {
    const pathToUse = svgContent || path;
    const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pathElement.setAttribute("d", pathToUse);
    const bbox = pathElement.getBBox();
    setDimensions({
      width: bbox.width,
      height: bbox.height
    });
  }, [path, svgContent]);

  useEffect(() => {
    controls.start({
      strokeDashoffset: 0,
      transition: { duration, ease: "easeInOut" },
    });
  }, [controls, duration]);

  const containerStyle = {
    position: 'relative' as const,
    display: 'inline-block',
    width: dimensions.width || 'auto',
    height: dimensions.height || 'auto',
    minWidth: '100px',
    minHeight: '50px'
  };

  const svgStyle = {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    overflow: 'visible' as const
  };

  return (
    <Component style={containerStyle}>
      <svg
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={svgStyle}
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
      <span style={{ visibility: 'hidden', display: 'block', width: dimensions.width, height: dimensions.height }}>
        {children}
      </span>
    </Component>
  );
};