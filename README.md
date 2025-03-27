# React Cursive Handwrite

A React component that animates text in a cursive handwriting style using SVG paths. Perfect for creating elegant, animated text effects in your React applications.

## Installation

```bash
npm install react-cursive-handwrite
# or
yarn add react-cursive-handwrite
```

## Usage

### Basic Usage

```jsx
import { HandwritingText } from 'react-cursive-handwrite';

function App() {
  return (
    <HandwritingText>
      Hello World
    </HandwritingText>
  );
}
```

### Using Custom SVG Path

```jsx
import { HandwritingText } from 'react-cursive-handwrite';

function App() {
  return (
    <HandwritingText 
      path="M 0,0 L 100,100..." // Your custom SVG path
      strokeColor="#FF0000"
      strokeWidth={3}
      duration={5}
    >
      Hello World
    </HandwritingText>
  );
}
```

### Using SVG File

```jsx
import { HandwritingText } from 'react-cursive-handwrite';

function App() {
  return (
    <HandwritingText 
      svgFile="/path/to/your/cursive.svg"
      strokeColor="#0000FF"
    >
      Hello World
    </HandwritingText>
  );
}
```

### As a Heading

```jsx
import { HandwritingText } from 'react-cursive-handwrite';

function App() {
  return (
    <HandwritingText 
      as="h1"
      strokeColor="#00FF00"
      strokeWidth={2}
    >
      Welcome to My Site
    </HandwritingText>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | Required | The text to be displayed |
| `path` | `string` | Default cursive path | SVG path data for the text |
| `svgFile` | `string` | - | Path to an SVG file containing the path data |
| `strokeColor` | `string` | "#000" | Color of the stroke |
| `strokeWidth` | `number` | 2 | Width of the stroke |
| `duration` | `number` | 3 | Duration of the animation in seconds |
| `width` | `number \| string` | "100%" | Width of the SVG viewport |
| `height` | `number \| string` | "100%" | Height of the SVG viewport |
| `strokeDashArray` | `number` | 2000 | Initial stroke dash array value |
| `as` | `ElementType` | "div" | HTML element type to wrap the text |

## Creating Custom SVG Paths

You can create custom SVG paths for your text using various tools:

1. **FontForge**: Convert fonts to SVG paths
2. **Adobe Illustrator**: Create and export SVG paths
3. **Online SVG Path Generators**: Convert text to SVG paths

### Example SVG File Structure

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path d="M 20,80 C 20,80 40,20 60,20 S 80,20 80,80 S 60,140 40,140 S 20,140 20,80"/>
</svg>
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
