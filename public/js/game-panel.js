class GamePanel {
    constructor() {
        this.currentPosition = 0;
        this.correctAnswers = 0;
        this.incorrectAnswers = 0;
        this.selectedOption = null;
        this.isRolling = false;
        this.gameWon = false;
        this.isPaused = false;

        // Configuración del tablero 8x8 (64 casillas)
        this.snakes = {
            62: 19, 56: 33, 49: 11, 47: 26, 
            43: 18, 39: 21, 35: 7, 30: 12
        };

        this.ladders = {
            2: 25, 4: 14, 9: 31, 20: 42, 
            28: 48, 36: 57, 51: 60
        };

        // Las preguntas ahora se cargan desde el archivo questions.js
        this.questions = getAllQuestions();

        this.init();
    }

    init() {
        this.createBoard();
        this.bindEvents();
        this.updateDisplay();
    }

    createBoard() {
        const board = document.getElementById('gameBoard');
        board.innerHTML = '';

        for (let row = 7; row >= 0; row--) {
            for (let col = 0; col < 8; col++) {
                const cellNumber = row % 2 === 1 ?
                    row * 8 + (8 - col) :
                    row * 8 + col + 1;

                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.textContent = cellNumber;
                cell.id = `cell-${cellNumber}`;

                // Marcar casillas especiales
                if (cellNumber === 1) {
                    cell.classList.add('start');
                    cell.innerHTML = '🏁<br>1';
                } else if (cellNumber === 64) {
                    cell.classList.add('finish');
                    cell.innerHTML = '🏆<br>64';
                } else if (this.snakes[cellNumber]) {
                    cell.classList.add('snake');
                    cell.innerHTML = `🐍<br>${cellNumber}`;
                } else if (this.ladders[cellNumber]) {
                    cell.classList.add('ladder');
                    cell.innerHTML = `🪜<br>${cellNumber}`;
                }

                board.appendChild(cell);
            }
        }

        this.createPlayerToken();
    }

    createPlayerToken() {
        const token = document.createElement('div');
        token.className = 'player-token';
        token.id = 'playerToken';
        document.body.appendChild(token);
        this.updateTokenPosition();
    }

    updateTokenPosition() {
        const token = document.getElementById('playerToken');
        const targetCell = document.getElementById(`cell-${this.currentPosition || 1}`);

        if (targetCell && token) {
            const rect = targetCell.getBoundingClientRect();
            token.style.left = (rect.left + rect.width / 2 - 10) + 'px';
            token.style.top = (rect.top + rect.height / 2 - 10) + 'px';
        }
    }

    bindEvents() {
        document.getElementById('dice').addEventListener('click', () => this.rollDice());
        document.getElementById('submitBtn').addEventListener('click', () => this.submitAnswer());
        document.getElementById('pauseBtn').addEventListener('click', () => this.togglePause());


        // Controles de voz
        document.getElementById('voiceToggleBtn').addEventListener('click', () => this.toggleVoiceReading());
        document.getElementById('repeatQuestionBtn').addEventListener('click', () => this.repeatQuestion());
        document.getElementById('stopSpeechBtn').addEventListener('click', () => this.stopSpeechReading());


        // Redimensionar token al cambiar tamaño de ventana
        window.addEventListener('resize', () => this.updateTokenPosition());

        if (dice) {
            dice.addEventListener('click', () => this.rollDice());
        }

        document.getElementById('resumeBtn').addEventListener('click', () => {
            // Llamar al método de GameState para actualizar el estado
            gameState.resumeGame();

            // Actualizar UI: esconder modal, cambiar texto botón pausa, etc
            const btn = document.getElementById('pauseBtn');
            const modal = document.getElementById('pauseModal');

            btn.innerHTML = '⏸ PAUSE';
            btn.classList.remove('paused');
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        });

    }

    rollDice() {
        if (this.isRolling || this.gameWon || this.isPaused) return;

        this.isRolling = true;
        const dice = document.getElementById('dice');

        dice.classList.add('rolling');


        setTimeout(() => {
            const diceValue = Math.floor(Math.random() * 6) + 1;
            this.showDiceValue(diceValue);
            dice.classList.remove('rolling');

            // Mostrar pregunta después del dado
            setTimeout(() => {
                this.showQuestion(diceValue);
                this.isRolling = false;
            }, 500);
        }, 600);
    }

    showDiceValue(value) {
        const dice = document.getElementById('dice');
        dice.innerHTML = '';

        const dotPositions = {
            1: [[1, 1]],
            2: [[0, 0], [2, 2]],
            3: [[0, 0], [1, 1], [2, 2]],
            4: [[0, 0], [0, 2], [2, 0], [2, 2]],
            5: [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]],
            6: [[0, 0], [0, 2], [1, 0], [1, 2], [2, 0], [2, 2]]
        };

        dotPositions[value].forEach(([row, col]) => {
            const dot = document.createElement('div');
            dot.className = 'dot';
            dot.style.gridArea = `${row + 1} / ${col + 1}`;
            dice.appendChild(dot);
        });
    }


    showQuestion(diceValue) {
        const modal = document.getElementById('questionModal');
        const questionText = document.getElementById('questionText');
        const optionsContainer = document.getElementById('optionsContainer');

        // Seleccionar pregunta aleatoria usando la función del archivo questions.js
        const randomQuestion = getRandomQuestion();

        questionText.textContent = randomQuestion.question;
        optionsContainer.innerHTML = '';
        this.selectedOption = null;
        this.currentQuestion = randomQuestion;
        this.pendingDiceValue = diceValue;

        // Crear opciones
        randomQuestion.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'option';
            button.textContent = `${String.fromCharCode(65 + index)}. ${option}`;
            button.addEventListener('click', () => this.selectOption(index, button));
            optionsContainer.appendChild(button);
        });

        document.getElementById('submitBtn').disabled = true;
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('show');
            
            // Leer la pregunta en voz alta después de mostrar el modal
            setTimeout(() => {
                readQuestion(randomQuestion);
            }, 500);
        }, 10);
    }

    selectOption(index, button) {
        // Limpiar selección anterior
        document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));

        // Seleccionar nueva opción
        button.classList.add('selected');
        this.selectedOption = index;
        document.getElementById('submitBtn').disabled = false;
        
        // Leer la opción seleccionada en voz alta
        if (this.currentQuestion && isVoiceEnabled()) {
            readOption(this.currentQuestion, index);
        }
    }

    submitAnswer() {
        if (this.selectedOption === null) return;

        // Detener la lectura de voz cuando se envía la respuesta
        stopSpeech();

        const isCorrect = this.selectedOption === this.currentQuestion.correct;

        // Cerrar modal
        const modal = document.getElementById('questionModal');
        modal.classList.remove('show');
        setTimeout(() => modal.style.display = 'none', 300);

        // Procesar respuesta
        setTimeout(() => {
            this.processAnswer(isCorrect, this.pendingDiceValue);
        }, 400);
    }

    processAnswer(isCorrect, diceValue) {
        if (isCorrect) {
            this.correctAnswers++;
            this.movePlayer(diceValue);
            this.showFeedback('Correct answer! You advance ' + diceValue + ' square', 'success');
        } else {
            this.incorrectAnswers++;
            if (this.currentPosition > 1) {
                this.currentPosition = Math.max(0, this.currentPosition - 1);
                this.showFeedback('Incorrect answer. Move back 1 square.', 'error');
            } else {
                this.showFeedback('Incorrect answer, but you can`t go back any further.', 'warning');
            }
        }

        this.updateDisplay();
        this.updateTokenPosition();

        // Habilitar botón de dado después de un momento
        setTimeout(() => {
            if (!this.gameWon) {
                document.getElementById('dice').disabled = false;
            }
        }, 2000);
    }

    movePlayer(spaces) {
        const oldPosition = this.currentPosition;
        this.currentPosition = Math.min(this.currentPosition + spaces, 64);

        // Verificar serpientes y escaleras
        if (this.snakes[this.currentPosition]) {
            setTimeout(() => {
                this.currentPosition = this.snakes[oldPosition + spaces];
                this.showFeedback('Oh no! You stepped on a snake!🐍', 'warning');
                this.updateDisplay();
                this.updateTokenPosition();
            }, 1000);
        } else if (this.ladders[this.currentPosition]) {
            setTimeout(() => {
                this.currentPosition = this.ladders[oldPosition + spaces];
                this.showFeedback('Great! You climbed a ladder. 🪜', 'success');
                this.updateDisplay();
                this.updateTokenPosition();
            }, 1000);
        }

        // Verificar victoria
        if (this.currentPosition >= 64) {
            this.currentPosition = 64;
            setTimeout(() => this.showWinScreen(), 1500);
        }
    }

    showFeedback(message, type) {
        const status = document.getElementById('gameStatus');
        const colors = {
            success: '#27ae60',
            error: '#e74c3c',
            warning: '#f39c12'
        };

        status.textContent = message;
        status.style.color = colors[type] || '#ecf0f1';

        setTimeout(() => {
            status.textContent = this.gameWon ? 'Game over!' : 'Roll the dice to continue!';
            status.style.color = '#ecf0f1';
        }, 3000);
    }

    updateDisplay() {
        // Actualizar posición
        document.getElementById('currentPosition').textContent = `Positionn: ${this.currentPosition}/64`;

        // Actualizar progreso
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        const percentage = (this.currentPosition / 64) * 100;

        progressFill.style.width = percentage + '%';
        progressText.textContent = `${this.currentPosition}/64`;

        // Actualizar estadísticas
        document.getElementById('correctCount').textContent = this.correctAnswers;
        document.getElementById('incorrectCount').textContent = this.incorrectAnswers;
    }

    showWinScreen() {
        this.gameWon = true;

        const modal = document.getElementById('winModal');
        document.getElementById('finalCorrect').textContent = this.correctAnswers;
        document.getElementById('finalIncorrect').textContent = this.incorrectAnswers;

        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('show'), 10);
    }

    togglePause() {
        console.log("togglePause ejecutado. Estado actual:", gameState.getGame().isPaused);

        const btn = document.getElementById('pauseBtn');
        const modal = document.getElementById('pauseModal');

        if (gameState.getGame().isPaused) {
            // Reanudar juego
            gameState.resumeGame();
            btn.innerHTML = '⏸ PAUSE';
            btn.classList.remove('paused');
            modal.classList.remove('show');
            setTimeout(() => modal.style.display = 'none', 300);
        } else {
            // Pausar juego
            gameState.pauseGame();
            btn.innerHTML = '▶ RESUME';
            btn.classList.add('paused');
            modal.style.display = 'flex';
            setTimeout(() => modal.classList.add('show'), 10);
        }
    }
    updatePauseButton() {
        const btn = document.getElementById('pauseBtn');
        const isPaused = gameState.getGame().isPaused;

        if (btn) {
            btn.innerHTML = isPaused ? '▶ REANUDAR' : '⏸ PAUSAR';
            btn.style.background = isPaused
                ? 'linear-gradient(135deg, rgba(46, 204, 113, 0.9), rgba(39, 174, 96, 0.8))'
                : 'linear-gradient(135deg, rgba(241, 196, 15, 0.9), rgba(243, 156, 18, 0.8))';
        }
    }

    // ===== MÉTODOS PARA CONTROL DE VOZ =====

    toggleVoiceReading() {
        const isEnabled = toggleVoice();
        const btn = document.getElementById('voiceToggleBtn');
        
        if (btn) {
            btn.textContent = isEnabled ? '🔊' : '🔇';
            btn.title = isEnabled ? 'Disable voice reading' : 'Enable voice reading';
        }
        
        // Mostrar feedback visual
        this.showFeedback(
            isEnabled ? 'Voice reading enabled' : 'Voice reading disabled',
            isEnabled ? 'success' : 'warning'
        );
    }

    repeatQuestion() {
        if (this.currentQuestion) {
            readQuestion(this.currentQuestion);
        }
    }

    stopSpeechReading() {
        stopSpeech();
        this.showFeedback('Voice reading stopped', 'warning');
    }

}

/**
 * Inicializa el panel cuando el DOM está listo
 */
document.addEventListener('DOMContentLoaded', function () {
    gamePanel = new GamePanel();
    // ← Agregar estas líneas para debug
    console.log('Estado completo:', gameState.getFullState());
    const player = gameState.getPlayer();
    console.log('Datos del jugador:', player);

    // Mostrar nombre
    const nameElement = document.querySelector("#player1 .player-name");
    if (nameElement) {
        nameElement.textContent = player.name || "Sin nombre";
        console.log('Nombre asignado:', player.name); // ← Debug
    }

    // Mostrar color
    const iconElement = document.querySelector("#player1 .player-icon");
    if (iconElement) {
        // Remover clases de color existentes
        iconElement.classList.remove('blue', 'green', 'yellow', 'pink');

        // Agregar la clase directamente
        const colorClass = player.color || 'blue'; // 'blue' por defecto
        iconElement.classList.add(colorClass);

        console.log('Clase de color asignada:', colorClass);

    }

});


// Función para reiniciar el juego
function resetGame() {
    const winModal = document.getElementById('winModal');
    winModal.classList.remove('show');
    setTimeout(() => {
        winModal.style.display = 'none';
        // Crear nueva instancia del juego
        game = new GamePanel();
    }, 300);
}


function goHome() {
    // Si el modal de pausa está visible, ciérralo con animación
    const modal = document.getElementById('pauseModal');
    if (modal && modal.classList.contains('show')) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
            window.location.href = 'index.html'; // o la pantalla que uses como "inicio"
        }, 300);
    } else {
        // Si no hay modal abierto, ir directamente a la página de inicio
        window.location.href = 'index.html';
    }
}


// Manejar redimensionado de ventana
window.addEventListener('resize', function () {
    if (game) {
        setTimeout(() => game.updateTokenPosition(), 100);
    }
});