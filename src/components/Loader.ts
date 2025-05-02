// Import SVG files as raw strings

type LetterPaths = {
    path: string;
    width: number;
    height: number;
    fill: string;
  };
  
  // Parse SVG from the converter's format
  function parseSVG(svgString: string): LetterPaths {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgString, 'image/svg+xml');
    const svg = doc.querySelector('svg');
    const path = doc.querySelector('path');
    
    if (!svg || !path) {
      throw new Error('Invalid SVG format');
    }
  
    // Get the viewBox dimensions
    const viewBox = svg.getAttribute('viewBox')?.split(' ').map(Number) || [0, 0, 100, 100];
    const width = viewBox[2];
    const height = viewBox[3];
  
    // Get the fill color from the path or its parent group
    const fill = path.getAttribute('fill') || 
                path.parentElement?.getAttribute('fill') || 
                '#000000';
  
    return {
      path: path.getAttribute('d') || '',
      width,
      height,
      fill
    };
  }
  
  // Store paths for each letter
  const letterPaths: Record<string, Record<string, LetterPaths>> = {};
  
  // Initialize font with a specific path
  export async function initializeFont(fontPath: string): Promise<Record<string, LetterPaths>> {
    console.log(`Initializing font with path: ${fontPath}`);
    
    if (letterPaths[fontPath]) {
      console.log(`Using cached paths for ${fontPath}`);
      return letterPaths[fontPath];
    }
  
    try {
      const paths: Record<string, LetterPaths> = {};
      const letters = 'abcdefghijklmnopqrstuvwxyz';
      
      // Create a promise for each letter
      const letterPromises = letters.split('').map(async (letter) => {
        try {
          // Try to load the SVG file
          const response = await fetch(`/${fontPath}/${letter}.svg`);
          if (response.ok) {
            const svgContent = await response.text();
            paths[letter] = parseSVG(svgContent);
            console.log(`✅ Successfully loaded SVG for letter "${letter}"`);
            return true;
          }
          return false;
        } catch (error) {
          console.log(`❌ Error loading SVG for letter "${letter}":`, error);
          return false;
        }
      });
      
      // Wait for all letters to be processed
      await Promise.allSettled(letterPromises);
      
      console.log(`Loaded ${Object.keys(paths).length} letter SVGs for font "${fontPath}"`);
      letterPaths[fontPath] = paths;
      return paths;
    } catch (error) {
      console.error('Error loading font:', error);
      return {};
    }
  }
  
  // Get the path for a letter
  export function getLetterPath(letter: string, fontPaths: Record<string, LetterPaths>): LetterPaths | null {
    const lowerLetter = letter.toLowerCase();
    if (fontPaths[lowerLetter]) {
      return fontPaths[lowerLetter];
    }
    console.log(`No SVG path found for letter: "${letter}"`);
    return null;
  }
  
  // Generate a path for a word
  export function generateWordPath(word: string, fontPaths: Record<string, LetterPaths>): { path: string; fill: string } {
    console.log(`Generating path for word: "${word}" with ${Object.keys(fontPaths).length} available letters`);
    
    let path = '';
    let xOffset = 0;
    const letterSpacing = 10; // Reduced spacing for better alignment
    let currentFill = '#000000';
  
    for (let i = 0; i < word.length; i++) {
      const letter = word[i].toLowerCase();
      if (letter === ' ') {
        // Handle spaces
        xOffset += 30; // Space width
        continue;
      }
      
      const letterData = getLetterPath(letter, fontPaths);
      if (!letterData) {
        // Skip missing letters
        console.log(`Skipping missing letter: "${letter}"`);
        continue;
      }
      
      if (letterData.path) {
        currentFill = letterData.fill;
        
        // Split the path into commands and their parameters
        const commands = letterData.path.split(/(?=[MLHVCSQTAZmlhvcsqtaz])/);
        let letterPathWithOffset = '';
        
        for (const cmd of commands) {
          if (!cmd) continue;
          
          const command = cmd[0];
          const params = cmd.slice(1).trim().split(/[\s,]+/).filter(Boolean);
          
          if (command === 'Z' || command === 'z') {
            letterPathWithOffset += command;
            continue;
          }
          
          let newParams: string[] = [];
          let isX = true;
          
          for (let i = 0; i < params.length; i++) {
            const param = params[i];
            if (!isNaN(parseFloat(param))) {
              if (isX && /[MLHVCSQTA]/.test(command)) {
                // Add xOffset to x coordinates for absolute commands
                newParams.push((parseFloat(param) + xOffset).toString());
              } else if (isX && /[mlhvcsqta]/.test(command)) {
                // For relative commands, only add xOffset to the first x coordinate
                if (i === 0) {
                  newParams.push((parseFloat(param) + xOffset).toString());
                } else {
                  newParams.push(param);
                }
              } else {
                newParams.push(param);
              }
              isX = !isX;
            } else {
              newParams.push(param);
            }
          }
          
          letterPathWithOffset += command + newParams.join(' ');
        }
        
        path += letterPathWithOffset;
        
        // Update offset for next letter based on the actual width of the current letter
        xOffset += letterData.width + letterSpacing;
      }
    }
  
    console.log(`Generated path length: ${path.length} characters`);
    return { path, fill: currentFill };
  } 