const {
    dissecaTermo,
    montaTermo
} = require("./termos")

/**
 * Remove os espaços em branco, corrige X -> x e remove parênteses inúteis de uma função.
 * @param {string} funcao A função a ser limpa.
 * Retorna a função corrigida.
 */
function limparFuncao(funcao) {
    let resultado = "" // Inicializa uma string vazia para armazenar o resultado limpo.

    if (funcao[0] === '(' && funcao[funcao.length - 1] === ')') { // Verifica se a função está em um parênteses
        let qtdParenteses = 1, i = 1
        do {
            if (funcao[i] === '(') qtdParenteses++ // Ao encontrar um ( considera que há mais um parênteses aberto
            if (funcao[i] === ')') qtdParenteses-- // Ao encontrar um ) considera que um parênteses foi fechado
            i++
        } while (qtdParenteses > 0) // Repete enquanto  ainda houver um parênteses aberto
        if (i === funcao.length) funcao = funcao.slice(1, -1) // Se sempre houve um parênteses aberto até chegar no fim da função, retira os ( e ) do início e fim
    }

    for (let i = 0; i < funcao.length; i++) { // Loop através de cada termo.
        charAtual = funcao[i] // Armazena o caractere atual.
        switch (charAtual) {
            case ' ': // Ignora espaços vazios
                break;
            case 'X': // Corrige X -> x
                resultado += 'x'
                break;
            default: // Guarda o caractere atual no resultado
                resultado += charAtual
        }
    }

    return resultado // Retorna a string 'resultado' que contém a função limpa.
}

/**
 * Separa uma função em um array de termos.
 * @param {string} funcaoOriginal A função matemática como uma string.
 * @returns {string[]} Um array contendo os termos da função.
 */
function separarFuncao(funcaoOriginal) {
    const termos = []         // Inicializa um array vazio para armazenar os termos separados.
    let termoAtual = ""       // Inicializa uma string vazia para construir o termo atual que está sendo lido.
    let qtdParenteses = 0     // Conta quantos parênteses estão abertos em um dado momento
    let charAtual             // Guarda o caractere atual.

    let funcaoLimpa = limparFuncao(funcaoOriginal)
    for (let i = 0; i < funcaoLimpa.length; i++) { // Loop através de cada caractere da função original.
        charAtual = funcaoLimpa[i] // Obtém o caractere atual.

        switch (charAtual) {
            case '-':
            case '+':
                if (funcaoLimpa[i - 1] === '^' || funcaoLimpa[i - 1] === '*')
                    break; // Se o ultimo caractere for um * ou ^ considera que o sinal é da multiplicação ou expoente, respectivamente
                if (termoAtual !== '') termos.push(dissecaTermo(termoAtual)) // adiciona o termoAtual como um termo dissecado.
                termoAtual = '' // Inicia o próximo termo vazio
                break;
            case 'x':
                if (funcaoLimpa[i - 1] === ')') { // Se o termo atual já tem um parenteses, considera que são dois termos distintos se multiplicando
                    termos.push(dissecaTermo(termoAtual)) // adiciona o termoAtual como um termo dissecado.
                    termoAtual = '*' // Inicia o próximo termo com '*'
                }
                break;
            case '(': // Ao encontrar o início de um parênteses colocorá todo o seu conteúdo em um único termo
                if (funcaoLimpa[i - 1] === 'x') { // Se o termo atual já tem um x, considera que são dois termos distintos se multiplicando
                    termos.push(dissecaTermo(termoAtual)) // adiciona o termoAtual como um termo dissecado.
                    termoAtual = '*' // Inicia o próximo termo com '*'
                }
                qtdParenteses++ // Incrementa a quantidade de parênteses
                do {
                    termoAtual += funcaoLimpa[i]                // Adciona o próximo termo do parênteses
                    i++                                         // Incrementa i para continuar verificar o próximo termo
                    if (funcaoLimpa[i] === '(') qtdParenteses++ // Ao encontrar um ínicio de um novo parênteses incrementa a quantidade de parênteses
                    if (funcaoLimpa[i] === ')') qtdParenteses-- // Ao encontrar o fim de um  parênteses decrementa a quantidade de parênteses
                } while (qtdParenteses > 0) // Repete enquanto tiver algum parênteses aberto
                charAtual = funcaoLimpa[i]
                break;
            case '^':
                break;
            case '*':
                if (termoAtual !== '') termos.push(dissecaTermo(termoAtual)) // adiciona o termoAtual como um termo dissecado.
                termoAtual = '' // Inicia o próximo termo vazio
                break;
            default:
                if (funcaoLimpa[i - 1] === 'x' || funcaoLimpa[i - 1] === ')') {
                    termos.push(dissecaTermo(termoAtual)) // adiciona o termoAtual como um termo dissecado.
                    termoAtual = '*' // Inicia o próximo termo com '*'
                }
        }
        termoAtual += charAtual // Adiciona o caratere encontrado ao termo atual
    }
    termos.push(dissecaTermo(termoAtual)) // adiciona o termoAtual como um termo dissecado.

    return termos // Retorna o array 'termos' contendo os termos separados da função em forma de termo dissecado.
}

/**
 * 
 * @param {*} funcao 
 * @param {*} separado 
 */
function simplificaFuncao(funcao, separado = false){
    let termos, resultado, termoAtual
    let i, j

    if(!separado) {
        termos = separarFuncao(funcao)
    } else {
        termos = funcao
    }

    for(i = 0; i < termos.length; i++){
        termoAtual = termos[i]
        for(j = i+1; j < termos.length; j++){
            
        }
    }

}

module.exports = {
    limparFuncao,
    separarFuncao,
    simplificaFuncao
}