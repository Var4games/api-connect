"use client";

import { useState } from "react";

// Predefined 20 matching color combinations
const colorThemes = [
  { background: "#F5F5DC", foreground: "#8B0000" }, // Beige & Dark Red
  { background: "#E6E6FA", foreground: "#4B0082" }, // Lavender & Indigo
  { background: "#FDF5E6", foreground: "#8B4513" }, // Old Lace & Saddle Brown
  { background: "#FFFACD", foreground: "#8B0000" }, // Lemon Chiffon & Dark Red
  { background: "#DFF0D8", foreground: "#2F4F4F" }, // Light Green & Dark Slate Gray
  { background: "#D8BFD8", foreground: "#483D8B" }, // Thistle & Dark Slate Blue
  { background: "#F0E68C", foreground: "#556B2F" }, // Khaki & Dark Olive Green
  { background: "#FFB6C1", foreground: "#8B0000" }, // Light Pink & Dark Red
  { background: "#FA8072", foreground: "#2F4F4F" }, // Salmon & Dark Slate Gray
  { background: "#98FB98", foreground: "#006400" }, // Pale Green & Dark Green
  { background: "#87CEEB", foreground: "#4682B4" }, // Sky Blue & Steel Blue
  { background: "#FFD700", foreground: "#8B4513" }, // Gold & Saddle Brown
  { background: "#CD5C5C", foreground: "#2E8B57" }, // Indian Red & Sea Green
  { background: "#40E0D0", foreground: "#2F4F4F" }, // Turquoise & Dark Slate Gray
  { background: "#DAA520", foreground: "#00008B" }, // Golden Rod & Dark Blue
  { background: "#7B68EE", foreground: "#2F4F4F" }, // Medium Slate Blue & Dark Slate Gray
  { background: "#32CD32", foreground: "#8B0000" }, // Lime Green & Dark Red
  { background: "#4682B4", foreground: "#FFD700" }, // Steel Blue & Gold
  { background: "#A52A2A", foreground: "#FAEBD7" }, // Brown & Antique White
  { background: "#DC143C", foreground: "#FFFFFF" }, // Crimson & White
];

export default function ThemeToggle() {
  const [theme, setTheme] = useState(colorThemes[0]); // Default theme

  // Function to select a random predefined theme
  const generateRandomTheme = () => {
    const randomTheme =
      colorThemes[Math.floor(Math.random() * colorThemes.length)];
    setTheme(randomTheme);
    document.documentElement.style.setProperty(
      "--background",
      randomTheme.background
    );
    document.documentElement.style.setProperty(
      "--foreground",
      randomTheme.foreground
    );
  };

  return (
    <button
      onClick={generateRandomTheme}
      className="p-2 rounded transition-colors duration-300"
      style={{
        background: theme.foreground,
        color: theme.background,
        border: `2px solid ${theme.background}`,
      }}
    >
      🎨 Random Theme
    </button>
  );
}
