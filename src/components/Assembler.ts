import { LetterPaths } from './Loader';
import { PositionedPath, createPositionedPath, measurePath } from './PathCreator';

export interface AssembledText {
  paths: PositionedPath[];
  totalWidth: number;
  maxHeight: number;
  totalLength: number;
}

export function assembleText(text: string, letterPaths: LetterPaths): AssembledText {
  console.log(`Assembling text: "${text}" with ${Object.keys(letterPaths).length} available letters`);
  
  let maxHeight = 0;
  let totalWidth = 0;
  let totalLength = 0;
  const paths: PositionedPath[] = [];

  for (let i = 0; i < text.length; i++) {
    const letter = text[i].toLowerCase();
    console.log(`Processing letter "${letter}" at position ${i}`);
    
    if (letter === ' ') {
      continue;
    }
    
    const letterData = letterPaths[letter];
    if (!letterData) {
      console.log(`Missing letter: "${letter}"`);
      continue;
    }
    
    // Create path with no offset to stack them
    const positionedPath = createPositionedPath(letterData, 0);
    paths.push(positionedPath);
    
    maxHeight = Math.max(maxHeight, letterData.height);
    totalWidth = Math.max(totalWidth, letterData.width);
    totalLength += measurePath(positionedPath.path).length;
  }
  
  return {
    paths,
    totalWidth,
    maxHeight,
    totalLength
  };
} 