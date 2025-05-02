import { LetterPath } from './Loader';

export interface PositionedPath {
  path: string;
  xOffset: number;
  width: number;
  height: number;
}

export function createPositionedPath(letterPath: LetterPath, xOffset: number): PositionedPath {
  // Create a temporary SVG to measure the path
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
  pathElement.setAttribute("d", letterPath.path);
  svg.appendChild(pathElement);
  document.body.appendChild(svg);

  const bbox = pathElement.getBBox();
  document.body.removeChild(svg);

  // Calculate baseline offset based on the viewBox height
  const baselineOffset = letterPath.height - bbox.height;
  
  // Position the path with the calculated baseline
  const positionedPath = `M${xOffset},${baselineOffset} ${letterPath.path}`;
  
  return {
    path: positionedPath,
    xOffset,
    width: letterPath.width,
    height: letterPath.height
  };
}

export function measurePath(path: string): { length: number; width: number; height: number } {
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
} 