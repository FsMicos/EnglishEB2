/**
 * Banco de preguntas para el juego de Serpientes y Escaleras
 * Cada pregunta tiene:
 * - question: La pregunta a mostrar
 * - options: Array de 4 opciones posibles
 * - correct: Índice de la respuesta correcta (0-3)
 */

const QUESTIONS_BANK = [
    {
        question: "Which sentence is grammatically correct?",
        options: [
            "She suggested me to take the test again.",
            "She suggested that I take the test again.",
            "She suggested that I took the test again.",
            "She suggested me that I take the test again."
        ],
        correct: 1
    },
    {
        question: "Identify the correct use of the past perfect tense.",
        options: [
            "By the time he arrived, the show started.",
            "By the time he arrived, the show has started.",
            "By the time he arrived, the show had started.",
            "By the time he arrived, the show will have started."
        ],
        correct: 2
    },
    {
        question: "Which sentence uses a **reduced relative clause** correctly?",
        options: [
            "The students who were studying late passed the exam.",
            "The students studying late passed the exam.",
            "The students studied late passed the exam.",
            "The students who studying late passed the exam."
        ],
        correct: 1
    },
    {
        question: "Choose the correct form of the conditional sentence:",
        options: [
            "If I would have seen her, I would have said hello.",
            "If I had seen her, I would have said hello.",
            "If I saw her, I would had said hello.",
            "If I see her, I would have said hello."
        ],
        correct: 1
    },
    {
        question: "Which sentence uses **inversion** for emphasis correctly?",
        options: [
            "Rarely I have seen such talent.",
            "Rarely have I seen such talent.",
            "Rarely seen I such talent.",
            "Rarely have seen I such talent."
        ],
        correct: 1
    },
    {
        question: "Choose the correct sentence using **modal verbs in the past**:",
        options: [
            "He must gone to the meeting.",
            "He must have gone to the meeting.",
            "He must has gone to the meeting.",
            "He must had gone to the meeting."
        ],
        correct: 1
    },
    {
        question: "Identify the correct **use of a participle clause**:",
        options: [
            "Walking through the park, a tree fell on me.",
            "Walking through the park, I saw a squirrel.",
            "Walking through the park, the birds were loud.",
            "Walking through the park, the wind blew hard."
        ],
        correct: 1
    },
    {
        question: "Which sentence is an example of a **cleft sentence** for emphasis?",
        options: [
            "I only saw her at the party.",
            "It was her that I saw at the party.",
            "At the party I saw her.",
            "She was at the party I saw."
        ],
        correct: 1
    },
    {
        question: "Which is the correct **reported speech** form?",
        options: [
            "He said he will call me later.",
            "He said he would call me later.",
            "He said he calls me later.",
            "He said he called me later."
        ],
        correct: 1
    },
    {
        question: "Choose the grammatically correct sentence with a **noun clause**:",
        options: [
            "What he said it was interesting.",
            "What did he say was interesting.",
            "What he said was interesting.",
            "That he said was interesting."
        ],
        correct: 2
    },
    {
        question: "Which sentence correctly uses the **subjunctive mood**?",
        options: [
            "I wish I was taller.",
            "I wish I were taller.",
            "I wish I am taller.",
            "I wish I will be taller."
        ],
        correct: 1
    },
    {
        question: "Choose the correct **gerund** usage:",
        options: [
            "I enjoy to read books.",
            "I enjoy reading books.",
            "I enjoy read books.",
            "I enjoy for reading books."
        ],
        correct: 1
    },
    {
        question: "Which sentence shows correct **parallel structure**?",
        options: [
            "She likes hiking, swimming, and to bike.",
            "She likes hiking, swimming, and biking.",
            "She likes to hike, swimming, and biking.",
            "She likes hiking, to swim, and biking."
        ],
        correct: 1
    },
    {
        question: "Identify the correct use of **articles**:",
        options: [
            "I need a advice about the situation.",
            "I need an advice about the situation.",
            "I need advice about the situation.",
            "I need the advice about a situation."
        ],
        correct: 2
    },
    {
        question: "Which sentence uses **passive voice** correctly?",
        options: [
            "The cake was ate by the children.",
            "The cake was eaten by the children.",
            "The cake was eat by the children.",
            "The cake has ate by the children."
        ],
        correct: 1
    }
];

// Función para obtener una pregunta aleatoria
function getRandomQuestion() {
    const randomIndex = Math.floor(Math.random() * QUESTIONS_BANK.length);
    return QUESTIONS_BANK[randomIndex];
}

// Función para obtener todas las preguntas
function getAllQuestions() {
    return QUESTIONS_BANK;
}

// Función para obtener una pregunta específica por índice
function getQuestionByIndex(index) {
    if (index >= 0 && index < QUESTIONS_BANK.length) {
        return QUESTIONS_BANK[index];
    }
    return null;
}

// Función para obtener el número total de preguntas
function getTotalQuestions() {
    return QUESTIONS_BANK.length;
}

// ===== FUNCIONALIDAD DE TEXTO A VOZ =====

// Configuración del lector de voz
const speechConfig = {
    rate: 0.8,        // Velocidad de lectura (0.1 a 10)
    pitch: 1.0,       // Tono de voz (0 a 2)
    volume: 0.8,      // Volumen (0 a 1)
    lang: 'en-US'     // Idioma
};

// Variable para controlar si el audio está habilitado
let voiceEnabled = true;

// Variable para el objeto de síntesis de voz
let speechSynthesis = null;

// Inicializar el lector de voz
function initializeSpeechSynthesis() {
    if ('speechSynthesis' in window) {
        speechSynthesis = window.speechSynthesis;
        return true;
    } else {
        console.warn('Speech Synthesis no está disponible en este navegador');
        return false;
    }
}

// Función para leer texto en voz alta
function speakText(text) {
    if (!voiceEnabled || !speechSynthesis) return;

    // Detener cualquier lectura anterior
    speechSynthesis.cancel();

    // Limpiar el texto de markdown y símbolos especiales
    const cleanText = text.replace(/\*\*/g, '').replace(/\*/g, '');

    // Crear un objeto de síntesis de voz
    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // Configurar la voz
    utterance.rate = speechConfig.rate;
    utterance.pitch = speechConfig.pitch;
    utterance.volume = speechConfig.volume;
    utterance.lang = speechConfig.lang;

    // Seleccionar una voz específica (inglés americano)
    const voices = speechSynthesis.getVoices();
    const englishVoice = voices.find(voice => 
        voice.lang.startsWith('en-US') || voice.lang.startsWith('en')
    );
    
    if (englishVoice) {
        utterance.voice = englishVoice;
    }

    // Eventos para debugging
    utterance.onstart = () => {
        console.log('Iniciando lectura de texto');
    };

    utterance.onend = () => {
        console.log('Lectura completada');
    };

    utterance.onerror = (event) => {
        console.error('Error en la síntesis de voz:', event.error);
    };

    // Reproducir el texto
    speechSynthesis.speak(utterance);
}

// Función para leer una pregunta completa
function readQuestion(questionObj) {
    if (!questionObj) return;

    const questionText = questionObj.question;
    const optionsText = questionObj.options.map((option, index) => 
        `Option ${String.fromCharCode(65 + index)}: ${option}`
    ).join('. ');

    const fullText = `${questionText}. ${optionsText}`;
    speakText(fullText);
}

// Función para leer solo la pregunta (sin opciones)
function readQuestionOnly(questionObj) {
    if (!questionObj) return;
    speakText(questionObj.question);
}

// Función para leer una opción específica
function readOption(questionObj, optionIndex) {
    if (!questionObj || optionIndex < 0 || optionIndex >= questionObj.options.length) return;
    
    const optionText = `Option ${String.fromCharCode(65 + optionIndex)}: ${questionObj.options[optionIndex]}`;
    speakText(optionText);
}

// Función para pausar la lectura
function pauseSpeech() {
    if (speechSynthesis && speechSynthesis.speaking) {
        speechSynthesis.pause();
    }
}

// Función para reanudar la lectura
function resumeSpeech() {
    if (speechSynthesis && speechSynthesis.paused) {
        speechSynthesis.resume();
    }
}

// Función para detener la lectura
function stopSpeech() {
    if (speechSynthesis) {
        speechSynthesis.cancel();
    }
}

// Función para alternar el estado de voz
function toggleVoice() {
    voiceEnabled = !voiceEnabled;
    if (!voiceEnabled) {
        stopSpeech();
    }
    return voiceEnabled;
}

// Función para verificar si la voz está disponible
function isSpeechAvailable() {
    return 'speechSynthesis' in window;
}

// Función para obtener el estado de la voz
function isVoiceEnabled() {
    return voiceEnabled;
}

// Función para configurar los parámetros de voz
function configureSpeech(config) {
    if (config.rate !== undefined) speechConfig.rate = config.rate;
    if (config.pitch !== undefined) speechConfig.pitch = config.pitch;
    if (config.volume !== undefined) speechConfig.volume = config.volume;
    if (config.lang !== undefined) speechConfig.lang = config.lang;
}

// Inicializar automáticamente cuando se carga el archivo
document.addEventListener('DOMContentLoaded', function() {
    initializeSpeechSynthesis();
    
    // Esperar a que las voces estén disponibles
    if (speechSynthesis) {
        speechSynthesis.onvoiceschanged = function() {
            console.log('Voces disponibles:', speechSynthesis.getVoices().length);
        };
    }
});
