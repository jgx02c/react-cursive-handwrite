# React Cursive Handwrite

A React component that animates text in a cursive handwriting style using SVG paths. Perfect for creating elegant, animated text effects in your React applications.

## Features

- 🖋️ Smooth cursive handwriting animation
- 🎨 Customizable stroke color and width
- ⚡ Adjustable animation duration
- 📏 Responsive sizing
- 🎯 Multiple text wrapping options
- 🔄 Replay animation capability
- 🎭 Custom SVG path support

## Installation

```bash
npm install react-cursive-handwrite
# or
yarn add react-cursive-handwrite
```

## Setup

Before using the component, you need to set up the font files. The component expects SVG files for each letter in a specific directory structure:

```
public/
  fonts/
    google/  # or any other font name you specify
      a.svg
      b.svg
      c.svg
      # ... and so on for each letter
```

## Usage

### Basic Usage

```jsx
import { HandwritingText } from 'react-cursive-handwrite';

function App() {
  return (
    <HandwritingText fontPath="fonts/google">
      Hello World
    </HandwritingText>
  );
}
```

### Advanced Usage

```jsx
import { HandwritingText } from 'react-cursive-handwrite';

function App() {
  return (
    <HandwritingText 
      fontPath="fonts/google"
      strokeColor="#FF0000"
      strokeWidth={3}
      duration={5}
      width={500}
      height={100}
      replay={true}
      replayDelay={2000}
    >
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
      fontPath="fonts/google"
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
| `fontPath` | `string` | "google" | Path to the directory containing letter SVG files |
| `path` | `string` | - | SVG path data for the text (overrides fontPath) |
| `svgFile` | `string` | - | Path to an SVG file containing the path data |
| `strokeColor` | `string` | "#000" | Color of the stroke |
| `strokeWidth` | `number` | 2 | Width of the stroke |
| `duration` | `number` | 3 | Duration of the animation in seconds |
| `width` | `number \| string` | "100%" | Width of the SVG viewport |
| `height` | `number \| string` | "100%" | Height of the SVG viewport |
| `strokeDashArray` | `number` | 2000 | Initial stroke dash array value |
| `as` | `ElementType` | "div" | HTML element type to wrap the text |
| `replay` | `boolean` | false | Whether to replay the animation |
| `replayDelay` | `number` | 2000 | Delay in milliseconds before replaying the animation |

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

## Best Practices

1. **Performance**: For optimal performance, keep the SVG path data as simple as possible
2. **Responsiveness**: Use percentage-based widths and heights for responsive designs
3. **Animation**: Adjust the duration based on the length of the text
4. **Replay**: Use the replay feature sparingly to avoid overwhelming users
5. **Font Files**: Ensure your font SVG files are properly named (lowercase letters) and placed in the correct directory structure

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT

## Support

If you find this package useful, please consider giving it a ⭐️ on GitHub!
