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
    this.letterPaths = letterPaths;
  }

  public addText(text: string): void {
    let xOffset = 0;
    
    for (let i = 0; i < text.length; i++) {
      const letter = text[i].toLowerCase();
      
      if (letter === ' ') {
        xOffset += 20; // Space width
        continue;
      }
      
      const letterData = this.letterPaths[letter];
      if (!letterData) {
        console.log(`Missing letter: "${letter}"`);
        continue;
      }
      
      const positionedPath = createPositionedPath(letterData, xOffset);
      this.queue.push({
        letter,
        path: positionedPath,
        isRendered: false,
        order: i
      });
      
      xOffset += letterData.width;
    }
  }

  public getNextLetter(): QueuedLetter | null {
    if (this.currentIndex >= this.queue.length) {
      return null;
    }
    
    const nextLetter = this.queue[this.currentIndex];
    this.currentIndex++;
    return nextLetter;
  }

  public markAsRendered(order: number): void {
    const letter = this.queue.find(l => l.order === order);
    if (letter) {
      letter.isRendered = true;
    }
  }

  public isComplete(): boolean {
    return this.queue.every(letter => letter.isRendered);
  }

  public getTotalLength(): number {
    return this.queue.reduce((sum, letter) => {
      return sum + letter.path.width;
    }, 0);
  }

  public getMaxHeight(): number {
    return Math.max(...this.queue.map(letter => letter.path.height));
  }

  public reset(): void {
    this.queue = [];
    this.currentIndex = 0;
  }
}
