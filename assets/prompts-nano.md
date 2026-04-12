# Prompts for Nano Banana Pro & 2

These prompts are optimized for the Nano Banana Image MCP based on the user's request to transform "LOGO.jpeg" into a 3D Pixar-style scene without text.

## 1. Initial 3D Scene Generation (using LOGO.jpeg as ImagePath)
This prompt focuses on an exact 3D recreation of the logo's composition without text.

**Prompt for `generate_image`:**
`Exact 3D recreation in Pixar/Dreamworks animation style of the provided image. A cute green Mexican parrot mascot standing behind a bustling vibrant kitchen counter. The character is interacting with cooking pots and fresh ingredients matching the original composition perfectly. Pure 3D rendering, octane render, vivid warm colors, soft cinematic studio lighting. CRITICAL: Absolutely NO text, NO letters, NO typography, NO words anywhere in the image. The sign or text areas from the original must be replaced with blank wood or kitchen tiles.`

*Note: You would pass the absolute path to `LOGO.jpeg` in the `ImagePaths` array.*

## 2. Character Sheet Generation (using the result of #1 as ImagePath)
This prompt creates the turnaround/expressions sheet using the previous generation as a base.

**Prompt for `generate_image`:**
`A 3D character design model sheet of the green parrot mascot inside the exact same kitchen environment from the reference image, Pixar 3D animation style. Showing the complete kitchen counter from 4 different camera angles arranged in a grid: wide shot from the left, close up to the counter, wide shot from the right, and a top-down angle. Pure seamless 3D rendering, vibrant colors. CRITICAL: Absolutely NO text, NO typography, NO letters.`

*Note: You would pass the absolute path to the generated image from step 1 in the `ImagePaths` array.*
