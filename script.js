const tabuleiro = document.querySelector('#tabuleiro');
const celulas   = document.querySelectorAll('.celula');
const reiniciar = document.querySelector("#reiniciar");

let currentPlayer = "X";
let gameActive    = true;
let gameState     = ["", "", "", "", "", "", "", "", ""];

const adversaryTime = 500; // Atraso para dar o tempo do jogador ver o movimento, no caso é em milissegundos (ms)

const winning_combinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

// Função para lidar com o clique em uma célula
function clickCell(event) {
    const celula = event.target;
    const index  = celula.getAttribute("data-index");

    if (gameState[index] !== "" || !gameActive) return;

    gameState[index]   = currentPlayer;
    celula.textContent = currentPlayer;

    // Verifica o resultado antes de trocar de jogador
    checkResult();

    // Só troca de jogador se o jogo estiver ativo
    if (gameActive) {
        swapPlayer();

        // Se for a vez do computador, ele joga automaticamente após um pequeno atraso
        if (currentPlayer === "O" && gameActive) {
            setTimeout(computerMove, adversaryTime);
        }
    }
}

// Trocar o jogador
function swapPlayer() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
}

// Função para o adversário jogar
function computerMove() {
    if (!gameActive) return;

    let availableCells = [];
    for (let i = 0; i < gameState.length; i++) {
        if (gameState[i] === "") {
            availableCells.push(i);
        }
    }

    const randomIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
    
    gameState[randomIndex] = "O";
    celulas[randomIndex].textContent = "O";

    checkResult();
    swapPlayer();
}

// Verifica se há vencedor ou empate
function checkResult() {
    let roundWon = false;
    let winner   = "";

    // Verificando se algum jogador venceu
    for (const combination of winning_combinations) {
        const [a, b, c] = combination;

        if (gameState[a] !== "" && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            roundWon = true;
            winner   = gameState[a]; // O jogador vencedor será "X" ou "O"
            break;
        }
    }

    if (roundWon) {
        alert(`O jogador "${winner}" venceu o jogo! 🎉`);
        gameActive = false; // Para o jogo
        showEmojiParticles(); // Chama a função para mostrar as partículas
        return;
    }

    // Verificando empate
    if (!gameState.includes("") && gameActive) {
        alert("🏆 Empate!");
        gameActive = false;
    }
}

// Função para mostrar as partículas de emoji
function showEmojiParticles() {
    const emojis = ["🎉", "🏆", "🎊"]; // Lista de emojis
    const emoji  = emojis[Math.floor(Math.random() * emojis.length)]; // Escolhe um emoji aleatório

    for (let i = 0; i < 30; i++) { // Gera 30 partículas
        createParticle(emoji);
    }
}

// Função para criar partículas de emoji
function createParticle(emoji) {
    const particle = document.createElement("div");
    particle.classList.add("particle");
    particle.textContent = emoji;

    // Define a posição inicial aleatória
    const startX = Math.random() * window.innerWidth;
    const startY = Math.random() * window.innerHeight;
    particle.style.left = `${startX}px`;
    particle.style.top  = `${startY}px`;

    // Adiciona a partícula à tela
    document.body.appendChild(particle);

    // Anima a partícula (subir e desaparecer)
    setTimeout(() => {
        particle.style.transform = `translateY(-200px) scale(10)`; // Move a partícula para cima e aumenta o tamanho
        particle.style.opacity   = "0"; // Faz a partícula desaparecer
    }, 10);

    // Remove a partícula após a animação
    setTimeout(() => {
        particle.remove();
    }, 1000);
}

// Reiniciar o jogo
function restartGame() {
    currentPlayer = "X";
    gameActive    = true;
    gameState     = ["", "", "", "", "", "", "", "", ""];
    celulas.forEach((celula) => (celula.textContent = ""));
}

// Adiciona eventos às células e ao botão reiniciar
celulas.forEach((celula) => celula.addEventListener("click", clickCell));
reiniciar.addEventListener("click", restartGame);