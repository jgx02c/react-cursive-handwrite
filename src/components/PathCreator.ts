import { LetterPath } from './Loader';

export interface PositionedPath {
  path: string;
  xOffset: number;
  width: number;
  height: number;
}

export const createPositionedPath = (letterPath: LetterPath, xOffset: number): PositionedPath => {
  if (!letterPath?.path) {
    throw new Error('Invalid letter path provided');
  }

  try {
    // Create a temporary SVG to measure the path
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
    
    // Validate and clean the path data
    const cleanedPath = letterPath.path.trim().replace(/\s+/g, ' ');
    if (!cleanedPath) {
      throw new Error('Empty path data');
    }
    
    pathElement.setAttribute("d", cleanedPath);
    svg.appendChild(pathElement);
    document.body.appendChild(svg);

    const bbox = pathElement.getBBox();
    document.body.removeChild(svg);

    // Validate dimensions
    if (isNaN(bbox.width) || isNaN(bbox.height)) {
      throw new Error('Invalid path dimensions');
    }

    // Calculate baseline offset based on the viewBox height
    const baselineOffset = letterPath.height - bbox.height;
    
    // Create the positioned path with proper validation
    const positionedPath = `M${xOffset},${baselineOffset} ${cleanedPath}`;
    
    return {
      path: positionedPath,
      xOffset,
      width: letterPath.width,
      height: letterPath.height
    };
  } catch (error) {
    console.error('Error creating positioned path:', error);
    throw error;
  }
};

export const measurePath = (path: string): { length: number; width: number; height: number } => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
  pathElement.setAttribute("d", path);
  svg.appendChild(pathElement);
  document.body.appendChild(svg);

  const length = pathElement.getTotalLength();
  const bbox = pathElement.getBBox();

  document.body.removeChild(svg);

  return {
    length,
    width: bbox.width,
    height: bbox.height
  };
}; 