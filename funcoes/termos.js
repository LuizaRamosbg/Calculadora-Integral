
/**
 * Coleta todos os dados de um termo e os separa em um objeto 
 * @param {string} termo O termo que será dissecado
 * @returns {object}    Um objeto contendo todos os dados do termo
 */
function dissecaTermo(termo) {
    let sinalCoeficiente = "+",  // Guarda o sinal do coeficiente do termo
        sinalExpoente = "+"     // Guarda o sinal do expoente do termo

    let i
    
    let valsTermo = { // Inicia valsTermo como um termo com todos os dados zerados 
        coeficiente: "",        // Guarda o valor do coeficiente do termo
        temX: false,            // Guarda se o termo tem um x ou não]
        temParenteses: false,   // Guarda se o termo tem um parênteses ou não
        conteudoParenteses: '', // Gurda o conteúdo de um parênteses encontrado
        temPotencia: false,     // Guarda se o termo tem uma potência ou não
        temE: false,
        temParentesesPot: false,
        expoente: "",           // Guarda o valor do expoente do termo
        temProduto: false       // Guarda se o termo atual deve ter a regra do produto aplicada
    }
    if (termo === '' || termo === undefined) return { ...valsTermo }

    let qtdParenteses = 0 // Guarda quantos parênteses estão abertos

    if (termo[0] === '-' || termo[0] === '*' && termo[1] === '-') sinalCoeficiente = '-' // Se o termo começa com menos define o sinal como -
    
    let charAtual // Guarda o caractere atual
    for (i = 0; i < termo.length; i++) {
        charAtual = termo[i] // Obtém o caractere atual

        switch (charAtual) {
            case '*':
                valsTermo.temProduto = true // Ao encontrar um * atualiza temProduto
                break;
            case 'x':
                if (!valsTermo.temPotencia){
                    valsTermo.temX = true // Ao encontrar um x atualiza temX
                } else {
                    valsTermo.expoente += 'x'
                    valsTermo.temParentesesPot = true
                }
                break;
            case '+':
            case '-':
                if (valsTermo.temPotencia) sinalExpoente = charAtual // Ao encontrar um sinal após encontrar um ^ atualiza o sinal do expoente 
                break;
            case '^':
                if (valsTermo.temX || valsTermo.temParenteses || valsTermo.temE) valsTermo.temPotencia = true // Ao encontrar uma potência atualiza temPotencia
                break;
            case 'e':
                valsTermo.temE = true
                break;
            case '(': // Ao encontrar o início de um parênteses colocorá seu conteúdo na variável conteudoParenteses
                if (!valsTermo.temPotencia) {
                    valsTermo.temParenteses = true // Atualiza temParenteses
                    qtdParenteses++                // Inicia a contagem de quantos parênteses estão abertos
                    valsTermo.conteudoParenteses = charAtual
                    do {
                        i++                                      // Avança para o próximo termo
                        valsTermo.conteudoParenteses += termo[i] // Insere o termo atual em conteudoParenteses
                        if (termo[i] === '(') qtdParenteses++    // Ao encontrar um ínicio de um novo parênteses incrementa a quantidade de parênteses
                        if (termo[i] === ')') qtdParenteses--    // Ao encontrar o fim de um  parênteses decrementa a quantidade de parênteses
                    } while (qtdParenteses > 0) // Repete enquanto tiver algum parênteses aberto
                } else {
                    valsTermo.temParentesesPot = true // Atualiza temParenteses
                    qtdParenteses++                // Inicia a contagem de quantos parênteses estão abertos
                    valsTermo.expoente += charAtual
                    do {
                        i++                                      // Avança para o próximo termo
                        valsTermo.expoente += termo[i] // Insere o termo atual em conteudoParenteses
                        if (termo[i] === '(') qtdParenteses++    // Ao encontrar um ínicio de um novo parênteses incrementa a quantidade de parênteses
                        if (termo[i] === ')') qtdParenteses--    // Ao encontrar o fim de um  parênteses decrementa a quantidade de parênteses
                    } while (qtdParenteses > 0) // Repete enquanto tiver algum parênteses aberto
                }
                break;
            case ' ':
            case '/':
                break; // Ignora / e espaços vazios
            default: // qualquer outro caractere será adicionado no coeficiente ou no expoente
                if (!valsTermo.temX && !valsTermo.temParenteses && !valsTermo.temE) valsTermo.coeficiente += charAtual // Enquanto um x ou parênteses não tiver sido encontrado, adiciona no coeficiente
                if (valsTermo.temPotencia) valsTermo.expoente += charAtual                          // Após encontrar uma potência adiciona no expoente
        }
    }

    valsTermo.coeficiente = parseFloat(sinalCoeficiente + (valsTermo.coeficiente === '' ? 1 : valsTermo.coeficiente)) // Adiciona o sinal ao valor do coeficiente
    if (isNaN(valsTermo.coeficiente)) valsTermo.coeficiente = sinalCoeficiente === '-' ? -1 : 1 // Caso tenha algum erro no coeficiente, o reseta para 1 ou -1

    if(!valsTermo.temParentesesPot){
        valsTermo.expoente = parseInt(sinalExpoente + (valsTermo.expoente === '' ? 1 : valsTermo.expoente)) // Adiciona o sinal ao valor do expoente
        if (isNaN(valsTermo.expoente)) { // Caso tenha algum erro no expoente, o reseta para 0 e atualiza temPotencia para falso
            valsTermo.expoente = 0
            valsTermo.temPotencia = false
        }
    } 
    
    return valsTermo // Retorna o objeto contendo o termo dissecado
}

/**
 * Recebe um objeto termo dissecado e o monta em forma de texto
 * @param {object} termo Um termo em forma de termo dissecado
 * @param {boolean} primeiro   Define se o termo é o primeiro da expressão
 * @param {boolean} parenteses Define se o termo estará dentro de um parênteses
 * @returns {string} O termo montado em forma de texto
 */
function montaTermo(termo, primeiro = false, parenteses = false) {
    let termoMontado = ""

    if (termo.temParenteses && !termo.temPotencia && termo.coeficiente === 1) {
        if (!primeiro) termoMontado += " + "
        termoMontado += `${termo.conteudoParenteses}`
        if (termo.temProduto) termoMontado = " * " + termoMontado
        return termoMontado.replace("  ", " ").replace("+  *", "*")
    }
    if (!((termo.temParenteses || termo.temX || termo.temE) && termo.coeficiente === 1))
        termoMontado += `${Math.abs(termo.coeficiente)}` // Inicia o termo com o valor do coeficiente

    if (termo.temX) { // Caso tenha x, o adiciona no termo
        termoMontado += "x"
    } else if(termo.temE) {
        termoMontado += "e"
    } else if (termo.temParenteses) { // Caso tenha um parênteses o adiciona no termo 
        termoMontado += termo.conteudoParenteses
    }
    if (termo.temPotencia) { // Caso tenha uma potência, a adiciona no termo
        termoMontado += '^' + termo.expoente
    }

    if (termo.coeficiente < 0)
        if (primeiro)
            termoMontado = `-${termoMontado}`
        else
            termoMontado = ` - ${termoMontado}`

    if (!primeiro && termo.coeficiente > 0 && !termo.temProduto) // Adiciona o sinal no termo, exceto quando o termo é positivo e é o primeiro na expressão(pode ser omitido)
        termoMontado = ` + ${termoMontado}`

    if (parenteses && termo.coeficiente < 0) // Adiciona o termo dentro de parênteses quando parenteses é verdadeiro e o termo é negativo 
        termoMontado = '(' + termoMontado.replace(" - ", "-") + ')'

    if (termo.temProduto)
        termoMontado = ` * ${termoMontado}`

    return termoMontado.replace("  ", " ") // Retorna o termo montado
}

module.exports = {
    dissecaTermo,
    montaTermo
}