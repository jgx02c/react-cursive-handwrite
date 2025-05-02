// src/components/HandwritingText.tsx
import React, { useEffect, ElementType, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { initializeFont, LetterPaths } from "./Loader";
import { QueueManager, QueuedLetter } from "./QueueManager";

interface HandwritingTextProps {
  /** The text to be displayed */
  children: React.ReactNode;
  /** Color of the stroke */
  strokeColor?: string;
  /** Width of the stroke */
  strokeWidth?: number;
  /** Duration of the animation in seconds */
  duration?: number;
  /** HTML element type to wrap the text (defaults to 'div') */
  as?: ElementType;
  /** Path to the font folder containing letter SVGs */
  fontPath?: string;
  /** Whether to show debug logging */
  debug?: boolean;
}

export const HandwritingText: React.FC<HandwritingTextProps> = ({
  children,
  strokeColor = "#000",
  strokeWidth = 2,
  duration = 3,
  as: Component = "div",
  fontPath = "google",
  debug = false,
}) => {
  const log = (...args: any[]) => {
    if (debug) {
      console.log('[HandwritingText]', ...args);
    }
  };

  const controls = useAnimation();
  const [letterPaths, setLetterPaths] = React.useState<LetterPaths>({});
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });
  const [renderedLetters, setRenderedLetters] = useState<QueuedLetter[]>([]);
  const [currentLetter, setCurrentLetter] = React.useState<QueuedLetter | null>(null);
  const queueManagerRef = useRef<QueueManager | null>(null);

  // Initialize font
  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    setError(null);
    
    const loadFont = async () => {
      try {
        log(`Loading font from path: ${fontPath}`);
        const paths = await initializeFont(fontPath);
        
        if (!mounted) return;
        
        if (Object.keys(paths).length === 0) {
          log('Warning: No letter paths were loaded');
        } else {
          log(`Loaded ${Object.keys(paths).length} letter paths`);
        }
        
        setLetterPaths(paths);
        queueManagerRef.current = new QueueManager(paths);
        setIsLoading(false);
      } catch (error) {
        log('Error loading font:', error);
        if (mounted) {
          setError(`Failed to load font: ${error instanceof Error ? error.message : String(error)}`);
          setIsLoading(false);
        }
      }
    };

    loadFont();
    return () => {
      mounted = false;
    };
  }, [fontPath, debug]);

  // Process text and update dimensions
  useEffect(() => {
    if (isLoading || !queueManagerRef.current) return;
    
    const text = typeof children === 'string' ? children : '';
    if (!text) {
      setError('No text content provided');
      return;
    }
    
    queueManagerRef.current.reset();
    queueManagerRef.current.addText(text);
    setRenderedLetters([]); // Clear previous letters
    
    // Add padding to dimensions
    const padding = 20;
    setDimensions({
      width: queueManagerRef.current.getTotalLength() + (padding * 2),
      height: queueManagerRef.current.getMaxHeight() + (padding * 2)
    });
    
    // Start with first letter
    setCurrentLetter(queueManagerRef.current.getNextLetter());
  }, [children, letterPaths, isLoading]);

  // Calculate baseline Y position - use 75% of max height as baseline
  const baselineY = Math.floor(dimensions.height * 0.75);

  // Animate current letter
  useEffect(() => {
    if (!currentLetter) return;
    
    // Create a temporary SVG to measure the path length
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", currentLetter.path.path);
    svg.appendChild(path);
    document.body.appendChild(svg);
    
    const pathLength = path.getTotalLength();
    document.body.removeChild(svg);
    
    log(`Animating letter "${currentLetter.letter}" with length ${pathLength}`);

    const text = typeof children === 'string' ? children : '';
    const letterDuration = (duration / text.length) * 1.25; // Slightly longer duration for overlap
    
    controls.set({ 
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength,
      opacity: 1 
    });
    
    controls.start({
      strokeDashoffset: 0,
      opacity: 1,
      transition: {
        duration: letterDuration,
        ease: [0.33, 1, 0.68, 1], // Custom easing for smoother animation
      },
    }).then(() => {
      if (queueManagerRef.current) {
        setRenderedLetters(prev => [...prev, currentLetter]);
        queueManagerRef.current.markAsRendered(currentLetter.order);
      }
    });

    // Start next letter when current letter is 60% complete for smoother overlap
    const timer = setTimeout(() => {
      if (queueManagerRef.current) {
        const nextLetter = queueManagerRef.current.getNextLetter();
        if (nextLetter) {
          setCurrentLetter(nextLetter);
        }
      }
    }, letterDuration * 1000 * 0.6); // Start next letter earlier

    return () => clearTimeout(timer);
  }, [currentLetter, controls, duration, children]);

  const containerStyle = {
    position: 'relative' as const,
    display: 'inline-block',
    width: dimensions.width || 'auto',
    height: dimensions.height || 'auto',
    minWidth: '100px',
    minHeight: '50px',
    opacity: isLoading ? 0 : 1, // Hide while loading
    transition: 'opacity 0.3s ease-in' // Smooth fade in when ready
  };

  const svgStyle = {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    overflow: 'visible' as const
  };

  if (isLoading) {
    return <Component style={containerStyle} />; // Empty container while loading
  }

  return (
    <Component style={containerStyle}>
      {error ? (
        <div style={{ fontSize: '14px', color: 'red', padding: '10px' }}>
          {debug ? error : 'Error loading content'}
        </div>
      ) : (
        <svg
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={svgStyle}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Render completed letters */}
          {renderedLetters.map((letter, index) => (
            <path
              key={`rendered-${index}`}
              d={letter.path.path}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              transform={`translate(${letter.path.xOffset}, ${baselineY - letter.path.height})`}
            />
          ))}
          {/* Render current letter */}
          {currentLetter && (
            <motion.path
              d={currentLetter.path.path}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              transform={`translate(${currentLetter.path.xOffset}, ${baselineY - currentLetter.path.height})`}
              initial={{ 
                strokeDasharray: 0,
                strokeDashoffset: 0,
                opacity: 0 
              }}
              animate={controls}
            />
          )}
        </svg>
      )}
    </Component>
  );
};