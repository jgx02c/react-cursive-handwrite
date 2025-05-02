import { LetterPath } from './Loader';
import { PositionedPath, createPositionedPath } from './PathCreator';

export interface QueuedLetter {
  letter: string;
  path: PositionedPath;
  isRendered: boolean;
  order: number;
}

export class QueueManager {
  private queue: QueuedLetter[] = [];
  private currentIndex = 0;
  private letterPaths: Record<string, LetterPath>;

  constructor(letterPaths: Record<string, LetterPath>) {
    if (!letterPaths || typeof letterPaths !== 'object') {
      throw new Error('Invalid letter paths provided to QueueManager');
    }
    this.letterPaths = letterPaths;
  }

  public addText = (text: string): void => {
    if (!text || typeof text !== 'string') {
      throw new Error('Invalid text provided to addText');
    }

    let xOffset = 0;
    
    for (let i = 0; i < text.length; i++) {
      const letter = text[i].toLowerCase();
      
      if (letter === ' ') {
        xOffset += 20; // Space width
        continue;
      }
      
      const letterData = this.letterPaths[letter];
      if (!letterData) {
        console.warn(`Missing letter: "${letter}"`);
        continue;
      }
      
      try {
        const positionedPath = createPositionedPath(letterData, xOffset);
        this.queue.push({
          letter,
          path: positionedPath,
          isRendered: false,
          order: i
        });
        
        xOffset += letterData.width;
      } catch (error) {
        console.error(`Error processing letter "${letter}":`, error);
        continue;
      }
    }
  };

  public getNextLetter = (): QueuedLetter | null => {
    if (this.currentIndex >= this.queue.length) {
      return null;
    }
    
    const nextLetter = this.queue[this.currentIndex];
    if (!nextLetter) {
      console.warn('Invalid letter at index:', this.currentIndex);
      return null;
    }
    
    this.currentIndex++;
    return nextLetter;
  };

  public markAsRendered = (order: number): void => {
    const letter = this.queue.find(l => l.order === order);
    if (letter) {
      letter.isRendered = true;
    }
  };

  public isComplete = (): boolean => {
    return this.queue.every(letter => letter.isRendered);
  };

  public getTotalLength = (): number => {
    return this.queue.reduce((sum, letter) => {
      return sum + (letter?.path?.width || 0);
    }, 0);
  };

  public getMaxHeight = (): number => {
    return Math.max(...this.queue.map(letter => letter?.path?.height || 0));
  };

  public reset = (): void => {
    this.queue = [];
    this.currentIndex = 0;
  };
}
