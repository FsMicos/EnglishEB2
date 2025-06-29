/**
 * Game State Management
 * Handles all game state, settings, and data persistence
 */

class GameState {
    constructor() {
        this.state = {
            player: {
                name: '',
                color: 'green',
                position: 0,
                score: 0
            },
            settings: {
                soundVolume: 100,
                musicVolume: 100,
                difficulty: 'medium', // easy, medium, hard
                language: 'en'
            },
            game: {
                currentQuestion: 0,
                totalQuestions: 0,
                correctAnswers: 0,
                isGameStarted: false,
                isPaused: false,
                gameType: 'quiz' // quiz, practice, challenge
            },
            progress: {
                level: 1,
                experience: 0,
                achievements: []
            }
        };
        
        this.loadState();
    }

    // Load state from localStorage
    loadState() {
        try {
            const savedState = localStorage.getItem('snakesLaddersQuiz');
            if (savedState) {
                const parsed = JSON.parse(savedState);
                this.state = { ...this.state, ...parsed };
            }
        } catch (error) {
            console.warn('Could not load saved game state:', error);
        }
    }

    // Save state to localStorage
    saveState() {
        try {
            localStorage.setItem('snakesLaddersQuiz', JSON.stringify(this.state));
        } catch (error) {
            console.warn('Could not save game state:', error);
        }
    }

    // Player methods
    setPlayerName(name) {
        this.state.player.name = name.trim();
        this.saveState();
    }

    setPlayerColor(color) {
        this.state.player.color = color;
        this.saveState();
    }

    updatePlayerPosition(position) {
        this.state.player.position = position;
        this.saveState();
    }

    updatePlayerScore(score) {
        this.state.player.score = score;
        this.saveState();
    }

    // Settings methods
    setSoundVolume(volume) {
        this.state.settings.soundVolume = Math.max(0, Math.min(100, volume));
        this.saveState();
        return this.state.settings.soundVolume;
    }

    setMusicVolume(volume) {
        this.state.settings.musicVolume = Math.max(0, Math.min(100, volume));
        this.saveState();
        return this.state.settings.musicVolume;
    }

    setDifficulty(difficulty) {
        this.state.settings.difficulty = difficulty;
        this.saveState();
    }

    // Game methods
    startNewGame() {
        this.state.game = {
            currentQuestion: 0,
            totalQuestions: 10, // Default
            correctAnswers: 0,
            isGameStarted: true,
            isPaused: false,
            gameType: 'quiz'
        };
        this.state.player.position = 0;
        this.state.player.score = 0;
        this.saveState();
    }

    pauseGame() {
        this.state.game.isPaused = true;
        this.saveState();
    }

    resumeGame() {
        this.state.game.isPaused = false;
        this.saveState();
    }

    endGame() {
        this.state.game.isGameStarted = false;
        this.state.game.isPaused = false;
        this.saveState();
    }

    // Progress methods
    addExperience(points) {
        this.state.progress.experience += points;
        // Check for level up
        const newLevel = Math.floor(this.state.progress.experience / 100) + 1;
        if (newLevel > this.state.progress.level) {
            this.state.progress.level = newLevel;
            this.saveState();
            return { levelUp: true, newLevel };
        }
        this.saveState();
        return { levelUp: false };
    }

    addAchievement(achievementId) {
        if (!this.state.progress.achievements.includes(achievementId)) {
            this.state.progress.achievements.push(achievementId);
            this.saveState();
            return true;
        }
        return false;
    }

    // Validation methods
    isValidPlayerName(name) {
        return name && name.trim().length >= 2 && name.trim().length <= 20;
    }

    canContinueGame() {
        return this.state.game.isGameStarted && 
               this.state.player.name && 
               this.state.game.currentQuestion < this.state.game.totalQuestions;
    }

    // Getters
    getPlayer() {
        return { ...this.state.player };
    }

    getSettings() {
        return { ...this.state.settings };
    }

    getGame() {
        return { ...this.state.game };
    }

    getProgress() {
        return { ...this.state.progress };
    }

    getFullState() {
        return JSON.parse(JSON.stringify(this.state));
    }

    // Reset methods
    resetPlayer() {
        this.state.player = {
            name: '',
            color: 'green',
            position: 0,
            score: 0
        };
        this.saveState();
    }

    resetGame() {
        this.state.game = {
            currentQuestion: 0,
            totalQuestions: 0,
            correctAnswers: 0,
            isGameStarted: false,
            isPaused: false,
            gameType: 'quiz'
        };
        this.saveState();
    }

    resetAll() {
        localStorage.removeItem('snakesLaddersQuiz');
        this.state = {
            player: {
                name: '',
                color: 'green',
                position: 0,
                score: 0
            },
            settings: {
                soundVolume: 100,
                musicVolume: 100,
                difficulty: 'medium',
                language: 'en'
            },
            game: {
                currentQuestion: 0,
                totalQuestions: 0,
                correctAnswers: 0,
                isGameStarted: false,
                isPaused: false,
                gameType: 'quiz'
            },
            progress: {
                level: 1,
                experience: 0,
                achievements: []
            }
        };
    }
}

// Create global game state instance
window.gameState = new GameState();
