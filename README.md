# Snakes & Ladders English Quiz Game

A retro-style English quiz game built with Node.js, featuring a Snakes & Ladders theme with colorful, pixelated design.

## Features

- **Retro Design**: Pixel-art style interface with vibrant colors
- **Responsive Layout**: Works on desktop and mobile devices
- **Accessibility**: Full keyboard navigation and screen reader support
- **Game State Management**: Saves progress and settings locally
- **Sound Controls**: Toggle sound effects and background music
- **Player Customization**: Choose your name and player color

## Technology Stack

- **Backend**: Node.js with Express
- **Frontend**: Vanilla HTML, CSS, and JavaScript
- **Styling**: CSS Variables for consistent theming
- **Storage**: LocalStorage for game state persistence

## Installation and Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   npm start
   ```

3. Open your browser and go to:
   ```
   http://localhost:3000
   ```

## Deployment to Vercel

This application is configured for easy deployment to Vercel. You can deploy using either the web interface or CLI:

### Option 1: Deploy from Vercel Web Dashboard (Recommended)

1. **Push your code to GitHub**:
   - Create a new repository on GitHub
   - Push your local code to the repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

2. **Deploy on Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign up/Login with your GitHub account
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect it's a Node.js project
   - Click "Deploy"

3. **Configuration** (automatic):
   - Build Command: `npm run build`
   - Output Directory: `public` (auto-detected)
   - Install Command: `npm install`
   - Root Directory: `./`

### Option 2: Deploy using Vercel CLI

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy to Vercel**:
   ```bash
   vercel
   ```
   
   Follow the prompts:
   - Set up and deploy? `Y`
   - Which scope? Choose your account
   - Link to existing project? `N` (for first deployment)
   - What's your project's name? `englisheb2` (or your preferred name)
   - In which directory is your code located? `./`

4. **Production deployment**:
   ```bash
   vercel --prod
   ```

### Vercel Configuration Files:

- `vercel.json`: Deployment configuration
- `.vercelignore`: Files to exclude from deployment
- `.env.example`: Environment variables template

### Environment Variables:

If you need to set environment variables in Vercel:
1. Go to your project dashboard on Vercel
2. Navigate to Settings → Environment Variables
3. Add any required environment variables

### Troubleshooting Common Issues:

**404 Error on Game Routes:**
If you get a 404 error when clicking "Play":
1. The app now uses direct HTML navigation (`game.html`) instead of server routes
2. Make sure the `vercel.json` file is properly configured for static files
3. Redeploy the project after making changes
4. Check browser developer tools for any path errors

**Static Files Not Loading:**
If CSS, JS, or images don't load:
1. Verify all file paths in HTML are relative (no leading `/`)
2. Check that files exist in the correct `public` folder structure
3. Clear browser cache and try again
4. Check Vercel deployment logs for any build errors

**Navigation Issues:**
The app uses multiple navigation strategies for maximum compatibility:
- Direct HTML links: `./game.html`
- URL rewrites in vercel.json: `/game` → `/public/game.html`
- Client-side redirection with redirect.js
- Custom 404.html handling for fallback redirection

**Important**: After deploying to Vercel, you may need to:
1. Clear browser cache completely
2. Wait 5-10 minutes for Vercel's cache to update
3. Force-refresh Vercel's deployment (in Vercel dashboard → Deployments → Latest → Redeploy)

**Common Vercel Deployment Errors:**
- `The property 'functions' cannot be used with the property 'builds'`: This indicates a configuration conflict in vercel.json. Make sure to use either `functions` or `builds`, but not both together.
- `404 Not Found` errors: Check that all static files are properly configured in vercel.json routes.
- Long-running server issues: Serverless functions have a timeout limit, make sure server responses are efficient.

## Adding Images

To complete the visual experience, add these images to the `public/assets/images/` folder:

### Required Images:

1. **game-board.png**
   - A colorful Snakes & Ladders board
   - Recommended size: 500x500 pixels
   - Should match the retro/pixel art style

2. **logo.png**
   - Game logo with "Snakes & Ladders" text
   - Recommended size: 200x150 pixels
   - Should have transparent background

3. **favicon.ico** (optional)
   - Browser tab icon
   - 16x16 or 32x32 pixels

### Image Guidelines:

- **Style**: Retro, pixelated, colorful
- **Colors**: Use bright, saturated colors that match the UI
- **Format**: PNG with transparency support preferred
- **Size**: Keep file sizes reasonable for web loading

## Game Structure

### File Organization:
```
public/
├── assets/
│   └── images/          # Place your images here
├── css/
│   ├── variables.css    # Color and style variables
│   └── styles.css       # Main stylesheet
├── js/
│   ├── game-state.js    # Game state management
│   └── main-screen.js   # Main screen functionality
├── index.html           # Main screen
└── game.html           # Game screen (placeholder)
```

### CSS Variables:
The game uses CSS variables for consistent theming. Key color variables include:
- `--primary-green`, `--primary-blue`, `--primary-yellow`, `--primary-red`
- `--background-dark`, `--background-medium`, `--background-light`
- `--text-white`, `--text-dark`, `--text-gold`

## Features in Detail

### Main Screen Features:
- Player name input with validation
- Color selection (blue, green, yellow, red)
- Play and Continue buttons
- Sound/music toggle controls
- Help system with instructions
- Responsive design for all screen sizes

### Accessibility Features:
- Full keyboard navigation
- Screen reader support
- ARIA labels and descriptions
- Focus management
- Color contrast compliance

### Game State Management:
- Player information (name, color, position, score)
- Game settings (sound, music, difficulty)
- Progress tracking (level, experience, achievements)
- Auto-save functionality

## UX Design Principles Applied

### Nielsen's Heuristics:
1. **Visibility of System Status**: Loading states and button feedback
2. **Match System and Real World**: Familiar Snakes & Ladders board
3. **User Control**: Sound controls and game state management
4. **Consistency**: Consistent colors, fonts, and interaction patterns
5. **Error Prevention**: Input validation and confirmation dialogs
6. **Recognition Rather Than Recall**: Visual icons and clear labels
7. **Flexibility**: Keyboard and mouse navigation options
8. **Aesthetic Design**: Clean, colorful, engaging interface
9. **Error Recovery**: Clear error messages and recovery options
10. **Help and Documentation**: Built-in help system

### UX Laws Applied:
- **Fitts' Law**: Large, easily clickable buttons
- **Hick's Law**: Limited, clear choices on main screen
- **Miller's Rule**: Grouped related controls
- **Jakob's Law**: Familiar game interface patterns

## Development Notes

- All text and comments are in English as requested
- Code follows modern JavaScript practices
- CSS uses flexbox for responsive layouts
- Game state persists across browser sessions
- Extensible architecture for adding game screens

## Next Steps

1. Add your images to the `assets/images/` folder
2. Implement the actual quiz game logic
3. Add sound effects and background music
4. Create additional game screens (settings, leaderboard, etc.)
5. Add more question categories and difficulty levels

## Browser Support

- Modern browsers with ES6+ support
- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers (iOS Safari, Chrome Mobile)
