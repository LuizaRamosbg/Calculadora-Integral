
/**
 * Coleta todos os dados de um termo e os separa em um objeto 
 * @param {string} termo O termo que será dissecado
 * @returns {object}    Um objeto contendo todos os dados do termo
 */
function dissecaTermo(termo) {
    let sinalCoeficiente = "+",  // Guarda o sinal do coeficiente do termo
        sinalExpoente = "+"     // Guarda o sinal do expoente do termo

    let valsTermo = { // Inicia valsTermo como um termo com todos os dados zerados 
        valorCoeficiente: "",   // Guarda o valor do coeficiente do termo
        temX: false,            // Guarda se o termo tem um x ou não]
        temParenteses: false,   // Guarda se o termo tem um parênteses ou não
        conteudoParenteses: '', // Gurda o conteúdo de um parênteses encontrado
        temPotencia: false,     // Guarda se o termo tem uma potência ou não
        valorExpoente: "",      // Guarda o valor do expoente do termo
        temProduto: false       // Guarda se o termo atual deve ter a regra doproduto aplicada
    }
    if (termo === '' || termo === undefined) return { ...valsTermo }
    /*
    // Identificando o padrão e^(bx)
    let i = 0
    let achouE = false
    let coefStr = ""
    while (i < termo.length) {
      const c = termo[i]
      if (c === 'e' && i + 1 < termo.length && termo[i + 1] === '^') {
        achouE = true
        break;
      }
      coefStr += c
      i++
    }

    if (achouE) {
      let coef = parseFloat(coefStr)
      if (isNaN(coef)) {
        coef = 1 // Se não há coeficiente explícito, consideramos 1.
      }

      // Agora, extraímos o expoente
      i += 2 // Pula o "e^"
      let bStr = ""
      let sinalExpoente = 1
      if (i < termo.length && (termo[i] === '-' || termo[i] === '+')) {
        sinalExpoente = (termo[i] === '-') ? -1 : 1
        i++
      }
      while (i < termo.length && termo[i] !== 'x') {
        bStr += termo[i]
        i++
      }

      let b = parseFloat(bStr)
      if (isNaN(b)) b = 1
      b = b * sinalExpoente // Considera o sinal negativo.

      let derivadaCoef = coef * b // A derivada de e^(bx) é b * e^(bx)
      let sinalFinal = derivadaCoef < 0 ? '-' : ''
      let coefFinal = Math.abs(derivadaCoef) === 1 ? '' : Math.abs(derivadaCoef)

      let parteExp = 'e^' + (b < 0 ? '(' + b + 'x)' : b === 1 ? 'x' : b + 'x')
      return sinalFinal + coefFinal + parteExp
    }*/

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
                valsTermo.temX = true // Ao encontrar um x atualiza temX
                break;
            case '+':
            case '-':
                if (valsTermo.temPotencia) sinalExpoente = charAtual // Ao encontrar um sinal após encontrar um ^ atualiza o sinal do expoente 
                break;
            case '^':
                if (valsTermo.temX || valsTermo.temParenteses) valsTermo.temPotencia = true // Ao encontrar uma potência atualiza temPotencia
                break;
            case '(': // Ao encontrar o início de um parênteses colocorá seu conteúdo na variável conteudoParenteses
                valsTermo.temParenteses = true // Atualiza temParenteses
                qtdParenteses++                // Inicia a contagem de quantos parênteses estão abertos
                valsTermo.conteudoParenteses = charAtual
                do {
                    i++                                      // Avança para o próximo termo
                    valsTermo.conteudoParenteses += termo[i] // Insere o termo atual em conteudoParenteses
                    if (termo[i] === '(') qtdParenteses++    // Ao encontrar um ínicio de um novo parênteses incrementa a quantidade de parênteses
                    if (termo[i] === ')') qtdParenteses--    // Ao encontrar o fim de um  parênteses decrementa a quantidade de parênteses
                } while (qtdParenteses > 0) // Repete enquanto tiver algum parênteses aberto
                break;
            case ' ':
            case '/':
                break; // Ignora / e espaços vazios
            default: // qualquer outro caractere será adicionado em valorCoeficiente ou valorExpoente
                if (!valsTermo.temX && !valsTermo.temParenteses) valsTermo.valorCoeficiente += charAtual // Enquanto um x ou parênteses não tiver sido encontrado, adiciona em valorCoeficiente
                if (valsTermo.temPotencia) valsTermo.valorExpoente += charAtual                          // Após encontrar uma potência adiciona em valorExpoente
        }
    }

    valsTermo.valorCoeficiente = parseFloat(sinalCoeficiente + (valsTermo.valorCoeficiente === '' ? 1 : valsTermo.valorCoeficiente)) // Adiciona o sinal ao valor do coeficiente
    if (isNaN(valsTermo.valorCoeficiente)) valsTermo.valorCoeficiente = sinalCoeficiente === '-' ? -1 : 1 // Caso tenha algum erro no coeficiente, o reseta para 1 ou -1
    
    valsTermo.valorExpoente = parseInt(sinalExpoente + (valsTermo.valorExpoente === '' ? 1 : valsTermo.valorExpoente)) // Adiciona o sinal ao valor do expoente
    if (isNaN(valsTermo.valorExpoente)) { // Caso tenha algum erro no expoente, o reseta para 0 e atualiza temPotencia para falso
        valsTermo.valorExpoente = 0
        valsTermo.temPotencia = false
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

    if(termo.temParenteses && !termo.temPotencia && termo.valorCoeficiente === 1){
        if(!primeiro) termoMontado += " + "
        termoMontado += `${termo.conteudoParenteses}`
        if (termo.temProduto) termoMontado = " * " + termoMontado
        return termoMontado.replace("  ", " ").replace("+  *", "*")
    }

    if (!((termo.temParenteses || termo.temX) && termo.valorCoeficiente === 1))
        termoMontado += `${Math.abs(termo.valorCoeficiente)}` // Inicia o termo com o valor do coeficiente

    if (termo.temX) { // Caso tenha x, o adiciona no termo
        termoMontado += "x"
    } else if (termo.temParenteses) { // Caso tenha um parênteses o adiciona no termo 
        termoMontado += termo.conteudoParenteses
    }
    if (termo.temPotencia) { // Caso tenha uma potência, a adiciona no termo
        termoMontado += '^' + termo.valorExpoente
    }

    if(termo.valorCoeficiente < 0)
        if(primeiro)
            termoMontado = `-${termoMontado}`
        else
            termoMontado = ` - ${termoMontado}`

    if (!primeiro && termo.valorCoeficiente > 0 && !termo.temProduto) // Adiciona o sinal no termo, exceto quando o termo é positivo e é o primeiro na expressão(pode ser omitido)
        termoMontado = ` + ${termoMontado}`
    
    if (parenteses && termo.valorCoeficiente < 0) // Adiciona o termo dentro de parênteses quando parenteses é verdadeiro e o termo é negativo 
        termoMontado = '(' + termoMontado.replace(" - ", "-") + ')'

    if (termo.temProduto)
        termoMontado = ` * ${termoMontado}`

    return termoMontado.replace("  ", " ") // Retorna o termo montado
}

module.exports = {
    dissecaTermo,
    montaTermo
}