// Seleciona os elementos HTML
const display = document.querySelector('.calculator-screen');
const keys = document.querySelector('.calculator-keys');

// Variáveis de estado da calculadora
let displayValue = '0'; // O valor atual exibido na tela
let firstOperand = null; // O primeiro número da operação
let operator = null; // O operador selecionado (+, -, *, /)
let waitingForSecondOperand = false; // Indica se estamos esperando o segundo número

// Função para atualizar o display na tela
function updateDisplay() {
    display.value = displayValue;
}

// Inicializa o display com '0' quando a página carrega
updateDisplay();

// Adiciona um "ouvinte" de eventos para qualquer clique dentro da área das teclas
keys.addEventListener('click', (event) => {
    const { target } = event; // Pega o elemento HTML que foi clicado

    // Se o clique não foi em um botão (ex: clicou no espaço vazio), ignore.
    if (!target.matches('button')) {
        return;
    }

    // Pega o valor do botão clicado (ex: '7', '+', 'AC')
    const value = target.value;

    // Lógica para lidar com diferentes tipos de botões
    if (target.classList.contains('operator')) { // Botões de operador (+, -, *, /, =)
        handleOperator(value);
        updateDisplay();
        return; // Sai da função após lidar com o operador
    }

    if (target.classList.contains('decimal')) { // Botão de ponto decimal (.)
        inputDecimal(value);
        updateDisplay();
        return; // Sai da função após lidar com o decimal
    }

    if (target.classList.contains('clear')) { // Botão 'AC'
        resetCalculator();
        updateDisplay();
        return; // Sai da função após lidar com o clear
    }

    // Se não for nenhum dos acima, deve ser um dígito (número)
    inputDigit(value);
    updateDisplay(); // Atualiza o display depois de cada dígito
});


// Função para adicionar dígitos ao display
function inputDigit(digit) {
    if (waitingForSecondOperand === true) { // Se estamos esperando o 2º operando, o novo dígito inicia um novo número
        displayValue = digit;
        waitingForSecondOperand = false;
    } else {
        // Se o display está '0', substitui. Senão, concatena o novo dígito.
        displayValue = displayValue === '0' ? digit : displayValue + digit;
    }
}

// Função para adicionar o ponto decimal
function inputDecimal(dot) {
    // Impede múltiplos pontos decimais no mesmo número
    if (displayValue.includes(dot)) {
        return;
    }

    // Se estamos esperando o 2º operando, começa com '0.' para um decimal
    if (waitingForSecondOperand === true) {
        displayValue = '0.';
        waitingForSecondOperand = false;
        return;
    }

    displayValue += dot; // Adiciona o ponto ao número atual
}

// Função para lidar com a lógica dos operadores
function handleOperator(nextOperator) {
    const inputValue = parseFloat(displayValue); // Converte o valor do display para número

    // Se um operador já foi selecionado e estamos esperando o segundo operando,
    // significa que o usuário mudou o operador (ex: de '+' para '*').
    // Apenas atualiza o operador e retorna.
    if (operator && waitingForSecondOperand) {
        operator = nextOperator;
        return;
    }

    // Se é o primeiro operando sendo definido
    if (firstOperand === null) {
        firstOperand = inputValue;
    } else if (operator) {
        // Se já temos um firstOperand e um operador, realiza o cálculo anterior
        const result = performCalculation[operator](firstOperand, inputValue);
        displayValue = String(result); // Mostra o resultado
        firstOperand = result; // O resultado se torna o novo firstOperand para futuras operações
    }

    // Define que agora estamos esperando o segundo operando para a próxima operação
    waitingForSecondOperand = true;
    operator = nextOperator; // Armazena o operador clicado
}

// Objeto com as funções de cálculo para cada operador
const performCalculation = {
    '/': (firstNum, secondNum) => firstNum / secondNum,
    '*': (firstNum, secondNum) => firstNum * secondNum,
    '+': (firstNum, secondNum) => firstNum + secondNum,
    '-': (firstNum, secondNum) => firstNum - secondNum
};

// Função para resetar a calculadora (botão AC)
function resetCalculator() {
    displayValue = '0';
    firstOperand = null;
    operator = null;
    waitingForSecondOperand = false;
}