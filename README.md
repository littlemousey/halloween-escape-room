# 🎃 Witch's Lair Escape Room

A spooky Halloween-themed digital escape room game built with React and TypeScript. Players must explore a mysterious witch's lair, solve puzzles, gather ingredients, and brew an escape potion before the witch returns at midnight!

## 🎮 Game Features

- **4 Interconnected Rooms**: Forest Path, Entrance Hall, Potion Room, and Secret Lair
- **Multiple Puzzle Types**: 
  - Map discovery puzzles
  - Riddles and wordplay
  - Mirror reflection puzzles
  - Ancient spellbook decoding
  - Ingredient gathering and potion brewing
- **60-Minute Timer**: Race against time before the witch returns
- **Hint System**: 5 hints to help when you're stuck
- **Inventory Management**: Collect and use magical items
- **Dark Mystical Theme**: Atmospheric Halloween design with purple/black color scheme

## 🛠️ Technology Stack

### Core Dependencies
- **React**: ^18.2.0 - UI framework
- **React DOM**: ^18.2.0 - DOM rendering
- **Lucide React**: ^0.294.0 - Beautiful icons

### Development Dependencies
- **TypeScript**: ^5.2.2 - Type safety
- **Vite**: ^5.0.8 - Fast build tool and dev server
- **@vitejs/plugin-react**: ^4.2.1 - React plugin for Vite
- **Tailwind CSS**: ^3.3.6 - Utility-first CSS framework
- **PostCSS**: ^8.4.32 - CSS processing
- **Autoprefixer**: ^10.4.16 - CSS vendor prefixes
- **ESLint**: ^8.55.0 - Code linting
- **@typescript-eslint/eslint-plugin**: ^6.14.0 - TypeScript linting
- **@typescript-eslint/parser**: ^6.14.0 - TypeScript parser for ESLint

## 📁 Project Structure

```
halloween-escape-room/
├── public/                     # Static assets
├── src/
│   ├── components/
│   │   └── WitchLairEscape.tsx # Main game component
│   ├── App.tsx                 # Root application component
│   ├── main.tsx               # React entry point
│   └── index.css              # Global styles (Tailwind imports)
├── index.html                 # HTML template
├── package.json               # Dependencies and scripts
├── vite.config.ts            # Vite configuration
├── tsconfig.json             # TypeScript configuration
├── tsconfig.node.json        # Node-specific TypeScript config
├── tailwind.config.js        # Tailwind CSS configuration
├── postcss.config.js         # PostCSS configuration
├── eslint.config.js          # ESLint configuration
└── README.md                 # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/littlemousey/halloween-escape-room.git
   cd halloween-escape-room
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:5173/` to start playing!

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build the app for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint to check code quality |

## 🎯 How to Play

1. **Start the Adventure**: Click "Enter the Lair" to begin your 60-minute escape challenge
2. **Explore Rooms**: Navigate between different areas using the room buttons
3. **Solve Puzzles**: Click on interactive elements to discover clues and solve puzzles
4. **Collect Items**: Gather magical ingredients and tools in your inventory
5. **Use Hints Wisely**: You have 5 hints available if you get stuck
6. **Brew the Escape Potion**: Combine ingredients in the correct order
7. **Escape**: Use the final code to break the witch's seal and escape!

### Room Guide
- 🌲 **Forest Path**: Find the ancient map and collect mystical moonflowers
- 🏠 **Entrance Hall**: Solve riddles to unlock deeper areas and find raven feathers
- 🧪 **Potion Room**: Mirror puzzles, spellbook challenges, and ingredient collection
- 🔮 **Secret Lair**: The final escape challenge with magical seals

## 🎨 Design Features

- **Responsive Design**: Works on desktop and mobile devices
- **Dark Theme**: Atmospheric Halloween color palette
- **Animated Elements**: Smooth transitions and hover effects
- **Accessible UI**: Clear typography and intuitive navigation
- **Immersive Atmosphere**: Detailed descriptions and mystical theming

## 🔧 Development

### Code Structure
- **TypeScript**: Full type safety with custom types for game state
- **Component-Based**: Modular React components
- **State Management**: React hooks for game state
- **Styling**: Tailwind CSS utility classes

### Key Types
```typescript
type GameState = 'intro' | 'playing' | 'won' | 'lost';
type Room = 'forest' | 'entrance' | 'potionRoom' | 'lair';  
type Item = 'map' | 'iron_key' | 'moonflower' | 'raven_feather' | 'crystal_shard' | 'shadow_moss' | 'spell_scroll' | 'escape_potion';
```

## 🚀 Deployment

### Production Build
```bash
npm run build
```
This creates a `dist/` folder with optimized production files.

### Deployment Options
- **Vercel**: Connect your GitHub repo for automatic deployments
- **Netlify**: Drag and drop the `dist` folder
- **GitHub Pages**: Use GitHub Actions for automated deployment
- **Any static hosting**: Upload the `dist` folder contents

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🎃 Happy Halloween!

Enjoy exploring the witch's lair and may you escape before midnight strikes! 🧙‍♀️✨
