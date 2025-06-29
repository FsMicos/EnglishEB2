/**
 * Main Screen Functionality
 * Handles the initial game screen interactions and navigation
 */

class MainScreen {
    constructor() {
        this.elements = {};
        this.currentSelectedColor = 'green';
        this.soundVolume = 100;
        this.musicVolume = 100;
        
        this.init();
    }

    init() {
        this.bindElements();
        this.setupEventListeners();
        this.loadSavedState();
        this.updateUI();
        
        // Initialize accessibility
        this.setupAccessibility();
        
        console.log('🎮 Main Screen initialized');
    }

    bindElements() {
        this.elements = {
            hostNameInput: document.getElementById('hostName'),
            colorOptions: document.querySelectorAll('.color-option'),
            playBtn: document.getElementById('playBtn'),
            continueBtn: document.getElementById('continueBtn'),
            soundDown: document.getElementById('soundDown'),
            soundUp: document.getElementById('soundUp'),
            musicDown: document.getElementById('musicDown'),
            musicUp: document.getElementById('musicUp'),
            soundVolume: document.getElementById('soundVolume'),
            musicVolume: document.getElementById('musicVolume'),
            helpBtn: document.getElementById('helpBtn'),
            gameBoard: document.getElementById('gameBoard'),
            gameLogo: document.getElementById('gameLogo'),
            boardImage: document.getElementById('boardImage'),
            logoImage: document.getElementById('logoImage')
        };
    }

    setupEventListeners() {
        // Host name input
        this.elements.hostNameInput.addEventListener('input', (e) => {
            this.handleNameInput(e.target.value);
        });

        this.elements.hostNameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handlePlayGame();
            }
        });

        // Color selection
        this.elements.colorOptions.forEach(option => {
            option.addEventListener('click', () => {
                this.handleColorSelection(option.dataset.color);
            });

            option.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.handleColorSelection(option.dataset.color);
                }
            });
        });

        // Game buttons
        this.elements.playBtn.addEventListener('click', () => {
            this.handlePlayGame();
        });

        this.elements.continueBtn.addEventListener('click', () => {
            this.handleContinueGame();
        });

        // Volume controls
        this.elements.soundDown.addEventListener('click', () => {
            this.handleVolumeChange('sound', -10);
        });

        this.elements.soundUp.addEventListener('click', () => {
            this.handleVolumeChange('sound', 10);
        });

        this.elements.musicDown.addEventListener('click', () => {
            this.handleVolumeChange('music', -10);
        });

        this.elements.musicUp.addEventListener('click', () => {
            this.handleVolumeChange('music', 10);
        });

        // Help button
        this.elements.helpBtn.addEventListener('click', () => {
            this.handleHelp();
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardNavigation(e);
        });
    }

    setupAccessibility() {
        // Set initial ARIA states
        this.elements.colorOptions.forEach((option, index) => {
            option.setAttribute('aria-checked', option.classList.contains('selected'));
            option.setAttribute('tabindex', option.classList.contains('selected') ? '0' : '-1');
        });

        // Add screen reader announcements
        this.elements.hostNameInput.setAttribute('aria-describedby', 'nameHelp');
        
        // Create hidden help text
        const nameHelp = document.createElement('div');
        nameHelp.id = 'nameHelp';
        nameHelp.className = 'sr-only';
        nameHelp.textContent = 'Enter a nickname between 2 and 20 characters';
        document.body.appendChild(nameHelp);
    }

    loadSavedState() {
        const player = gameState.getPlayer();
        const settings = gameState.getSettings();

        // Load player name
        if (player.name) {
            this.elements.hostNameInput.value = player.name;
        }

        // Load player color
        this.currentSelectedColor = player.color;
        this.updateColorSelection();

        // Load volume settings
        this.soundVolume = settings.soundVolume || 100;
        this.musicVolume = settings.musicVolume || 100;
        this.updateVolumeDisplays();
    }

    updateUI() {
        this.updateContinueButton();
        this.validateForm();
    }

    updateContinueButton() {
        const canContinue = gameState.canContinueGame();
        this.elements.continueBtn.style.display = canContinue ? 'block' : 'none';
        
        if (canContinue) {
            const game = gameState.getGame();
            const progress = `${game.currentQuestion}/${game.totalQuestions}`;
            this.elements.continueBtn.querySelector('span').textContent = `Continue (${progress})`;
        }
    }

    validateForm() {
        const name = this.elements.hostNameInput.value.trim();
        const isValid = gameState.isValidPlayerName(name);
        
        this.elements.playBtn.disabled = !isValid;
        this.elements.playBtn.classList.toggle('disabled', !isValid);
        
        if (isValid) {
            this.elements.playBtn.setAttribute('aria-describedby', '');
        } else {
            this.elements.playBtn.setAttribute('aria-describedby', 'playHelp');
        }
    }

    handleNameInput(name) {
        gameState.setPlayerName(name);
        this.validateForm();
        
        // Provide real-time feedback
        if (name.length > 0 && name.length < 2) {
            this.elements.hostNameInput.setCustomValidity('Name must be at least 2 characters');
        } else if (name.length > 20) {
            this.elements.hostNameInput.setCustomValidity('Name must be 20 characters or less');
        } else {
            this.elements.hostNameInput.setCustomValidity('');
        }
    }

    handleColorSelection(color) {
        this.currentSelectedColor = color;
        gameState.setPlayerColor(color);
        this.updateColorSelection();
        this.playSelectSound();
    }

    updateColorSelection() {
        this.elements.colorOptions.forEach(option => {
            const isSelected = option.dataset.color === this.currentSelectedColor;
            option.classList.toggle('selected', isSelected);
            option.setAttribute('aria-checked', isSelected);
            option.setAttribute('tabindex', isSelected ? '0' : '-1');
        });
    }

    handlePlayGame() {
        const name = this.elements.hostNameInput.value.trim();
        
        if (!gameState.isValidPlayerName(name)) {
            this.showError('Please enter a valid name (2-20 characters)');
            this.elements.hostNameInput.focus();
            return;
        }

        this.playClickSound();
        this.showLoading(true);
        
        // Save final state
        gameState.setPlayerName(name);
        gameState.setPlayerColor(this.currentSelectedColor);
        gameState.startNewGame();
        
        // Simulate loading and navigate to game
        setTimeout(() => {
            this.navigateToGame();
        }, 1000);
    }

    handleContinueGame() {
        if (!gameState.canContinueGame()) {
            this.showError('No saved game found');
            return;
        }

        this.playClickSound();
        this.showLoading(true);
        
        setTimeout(() => {
            this.navigateToGame();
        }, 500);
    }

    handleVolumeChange(type, change) {
        if (type === 'sound') {
            this.soundVolume = Math.max(0, Math.min(100, this.soundVolume + change));
            gameState.setSoundVolume(this.soundVolume);
        } else {
            this.musicVolume = Math.max(0, Math.min(100, this.musicVolume + change));
            gameState.setMusicVolume(this.musicVolume);
        }
        
        this.updateVolumeDisplays();
        this.playClickSound();
        
        // Handle actual volume changes
        if (type === 'music') {
            this.updateBackgroundMusicVolume();
        }
    }

    updateVolumeDisplays() {
        this.elements.soundVolume.textContent = this.soundVolume;
        this.elements.musicVolume.textContent = this.musicVolume;
        
        // Update visual feedback
        this.elements.soundVolume.style.color = this.soundVolume === 0 ? 
            'var(--retro-orange)' : 'var(--button-text)';
        this.elements.musicVolume.style.color = this.musicVolume === 0 ? 
            'var(--retro-orange)' : 'var(--button-text)';
    }

    handleHelp() {
        this.playClickSound();
        this.showHelp();
    }

    handleKeyboardNavigation(e) {
        // Handle Escape key
        if (e.key === 'Escape') {
            // Close any open modals or return focus to main content
            document.activeElement.blur();
        }
        
        // Handle Enter key on focused elements
        if (e.key === 'Enter') {
            const focused = document.activeElement;
            if (focused.classList.contains('game-btn')) {
                focused.click();
            }
        }
        
        // Handle arrow keys for color selection
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            const focused = document.activeElement;
            if (focused.classList.contains('color-option')) {
                e.preventDefault();
                const colors = Array.from(this.elements.colorOptions);
                const currentIndex = colors.indexOf(focused);
                let newIndex;
                
                if (e.key === 'ArrowLeft') {
                    newIndex = currentIndex > 0 ? currentIndex - 1 : colors.length - 1;
                } else {
                    newIndex = currentIndex < colors.length - 1 ? currentIndex + 1 : 0;
                }
                
                colors[newIndex].focus();
            }
        }
    }

    showLoading(show) {
        this.elements.playBtn.classList.toggle('loading', show);
        this.elements.continueBtn.classList.toggle('loading', show);
        
        if (show) {
            this.elements.playBtn.disabled = true;
            this.elements.continueBtn.disabled = true;
        } else {
            this.validateForm();
            this.elements.continueBtn.disabled = false;
        }
    }

    showError(message) {
        // Create or update error message
        let errorDiv = document.getElementById('errorMessage');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.id = 'errorMessage';
            errorDiv.className = 'error-message';
            this.elements.hostNameInput.parentNode.appendChild(errorDiv);
        }
        
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 3000);
        
        // Announce to screen readers
        errorDiv.setAttribute('role', 'alert');
    }

    showHelp() {
        const helpContent = `
            <h2>How to Play Snakes & Ladders English Quiz</h2>
            <ul>
                <li><strong>Enter your name:</strong> Choose a nickname (2-20 characters)</li>
                <li><strong>Pick your color:</strong> Select your game piece color</li>
                <li><strong>Answer questions:</strong> Correct answers move you forward</li>
                <li><strong>Snakes:</strong> Wrong answers may send you backwards</li>
                <li><strong>Ladders:</strong> Bonus questions can boost you ahead</li>
                <li><strong>Win:</strong> First to reach the end wins!</li>
            </ul>
            <p><strong>Controls:</strong></p>
            <ul>
                <li>Use Tab to navigate between elements</li>
                <li>Use Enter or Space to select options</li>
                <li>Use arrow keys to choose colors</li>
            </ul>
        `;
        
        this.showModal('Game Instructions', helpContent);
    }

    showModal(title, content) {
        // Create modal overlay
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${title}</h2>
                    <button class="modal-close" aria-label="Close dialog">&times;</button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        // Focus management
        const closeBtn = overlay.querySelector('.modal-close');
        closeBtn.focus();
        
        // Close handlers
        const closeModal = () => {
            document.body.removeChild(overlay);
            this.elements.helpBtn.focus();
        };
        
        closeBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal();
        });
        
        document.addEventListener('keydown', function escapeHandler(e) {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', escapeHandler);
            }
        });
    }

    navigateToGame() {
        window.location.href = '/game';
    }

    // Sound methods (placeholders for actual sound implementation)
    playClickSound() {
        if (this.soundVolume > 0) {
            // Implement actual sound playing here with volume
            console.log(`🔊 Playing click sound at volume ${this.soundVolume}`);
        }
    }

    playSelectSound() {
        if (this.soundVolume > 0) {
            // Implement actual sound playing here with volume
            console.log(`🔊 Playing select sound at volume ${this.soundVolume}`);
        }
    }

    startBackgroundMusic() {
        if (this.musicVolume > 0) {
            // Implement background music here with volume
            console.log(`🎵 Starting background music at volume ${this.musicVolume}`);
        }
    }

    updateBackgroundMusicVolume() {
        // Implement volume update for background music
        console.log(`🎵 Updating background music volume to ${this.musicVolume}`);
    }

    stopBackgroundMusic() {
        // Implement stopping background music here
        console.log('🎵 Stopping background music');
    }
}

// Image loading functions (called from HTML)
window.loadGameBoard = function() {
    const boardImg = document.getElementById('boardImage');
    const boardContainer = document.getElementById('gameBoard');
    
    if (boardImg.complete && boardImg.naturalWidth > 0) {
        boardContainer.innerHTML = '';
        boardContainer.appendChild(boardImg);
        boardImg.style.display = 'block';
        boardImg.style.width = '100%';
        boardImg.style.height = '100%';
        boardImg.style.objectFit = 'cover';
        boardImg.style.borderRadius = 'var(--border-radius)';
    }
};

window.loadGameLogo = function() {
    const logoImg = document.getElementById('logoImage');
    const logoContainer = document.getElementById('gameLogo');
    
    if (logoImg.complete && logoImg.naturalWidth > 0) {
        logoContainer.innerHTML = '';
        logoContainer.appendChild(logoImg);
        logoImg.style.display = 'block';
        logoImg.style.width = '100%';
        logoImg.style.height = '100%';
        logoImg.style.objectFit = 'contain';
        logoImg.style.borderRadius = 'var(--border-radius-large)';
    }
};

// Initialize main screen when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.mainScreen = new MainScreen();
});
