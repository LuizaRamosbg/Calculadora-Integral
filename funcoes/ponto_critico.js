
/**
 * 
 * @param {*} expr 
 * @param {*} x 
 * @returns 
 */

function avaliarExpressao(expr, x) {
    let expressaoComValor = ''// Inicializa uma string vazia para montar a expressão com 'x' substituído.
    let char // Variável para armazenar o caractere atual da expressão.
    let anterior // Variável para armazenar o caractere anterior para decisões contextuais.
    for (let i = 0; i < expr.length; i++) {// Percorre cada caractere da expressão original.
        char = expr[i]

        switch (char) {
            case 'x': // Caso o caractere seja 'x', substitui pelo valor passado (x)
                if (i > 0) {
                    anterior = expr[i - 1]
                    if (anterior >= '0' && anterior <= '9' || anterior === ')') { // Se antes do 'x' tem número ou fechamento de parênteses, adiciona operador '*'
                        expressaoComValor += `*(${x})`
                    }
                    else if (anterior === '(') {  // Se antes do 'x' tem um parêntese aberto, apenas adiciona o valor de x
                        expressaoComValor += `${x}`
                    } else { // Caso contrário, adiciona o valor de x entre parênteses para garantir precedência
                        expressaoComValor += `(${x})`
                    }
                }
                break;
            case 'e': // Trata a constante matemática 'e'
                anterior = expr[i - 1]
                if (anterior >= '0' && anterior <= '9' || anterior === ')') {  // Se antes tem número ou parênteses fechado, insere multiplicação
                    expressaoComValor += '*' + Math.E.toFixed(5);
                } else { // Caso contrário, apenas adiciona o valor de 'e' com cinco casas decimais
                    expressaoComValor += Math.E.toFixed(5);
                }
                break;
            case '^': // Substitui operador '^' pela sintaxe JavaScript '**' para potência
                expressaoComValor += '**' + expr[i + 1]
                i++ // Avança um índice para pular o expoente já inserido
                break;
            case '(': // Se abre parênteses, verifica se deve adicionar '*' antes (ex: 2(x+1) vira 2*(x+1))
                anterior = expr[i - 1]

                if (anterior >= '0' && anterior <= '9' || anterior === ')' || anterior === 'x')
                    expressaoComValor += '*('
                else
                    expressaoComValor += char
                break;
            default: // Para demais caracteres, apenas adiciona diretamente na nova string
                expressaoComValor += char
        }
    }
    //console.log(expressaoComValor + '=' + eval(expressaoComValor))
    return eval(expressaoComValor) // Avalia a expressão montada e retorna o resultado numérico
}

/**
 * 
 * @param {*} primeiraDerivada 
 * @returns 
 */
function pontoCritico(primeiraDerivada, intervaloMin = "-10", intervaloMax = "10") {
    if (Number(primeiraDerivada) === 0) {
        return console.log("Ponto crítico indefinido") // Se a derivada for constante zero (não é uma função válida para pontos críticos), retorna mensagem
    }
    let pontosCriticos = [] // Armazena pontos críticos encontrados
    let temCritico = false // Flag para indicar se encontrou algum ponto crítico
    let existe // Variável auxiliar para evitar duplicatas de ponto crítico
    let f1, f2 // Valores da função derivada nos pontos i e i+0.1 para verificar troca de sinal

    for (let i = Number(intervaloMin); i < Number(intervaloMax); i += 0.1) {
        f1 = avaliarExpressao(primeiraDerivada, i) // Avalia derivada em i
        f2 = avaliarExpressao(primeiraDerivada, i + 0.1) // Avalia derivada em i + 0.1

        if (Math.abs(f1) < 1e-7) {
            // Verifique valores da derivada um pouco antes e um pouco depois do ponto i
            let delta = 0.0005; 
            let fAntes = avaliarExpressao(primeiraDerivada, i - delta); // Avalia a derivada em i - delta 
            let fDepois = avaliarExpressao(primeiraDerivada, i + delta); // Avalia a derivada em  + delta

            // Se a derivada antes e depois estiver perto de zero (ex: e^(3x)), ignora (não é ponto crítico real)
            if (Math.abs(fAntes) < 1e-7 && Math.abs(fDepois) < 1e-7) {
                // provável falso positivo, não adiciona ponto crítico
                continue;  // pula para próxima iteração do for
            }

            // Se a derivada troca de sinal ou não, adiciona ponto crítico, pois pode ser de ordem par (mínimo/máximo plano)
            // Ou seja, aceita ponto crítico mesmo sem troca de sinal
            existe = false;
            for (let j = 0; j < pontosCriticos.length; j++) {
                if (Math.abs(pontosCriticos[j] - Number(i.toFixed(4))) < 1e-7) {
                    existe = true;
                    break;
                }
            }
            if (!existe) {
                pontosCriticos.push(Number(i.toFixed(4)));
                temCritico = true;
            }
        }
        if (f1 * f2 < 0) {  // Verifica troca de sinal entre f1 e f2 (indica zero entre i e i+0.1)

            // Busca binária para refinar a posição do ponto crítico entre i e i+0.1
            let ini = i // Define o início do intervalo como o ponto i atual no loop
            let fim = i + 0.1 // Define o fim do intervalo como i + 0.1 (o próximo ponto no loop)
            let meio  // Inicializa a variável que armazenará o ponto médio do intervalo
            let fa = f1 // Armazena o valor da função no ponto ini (f1)
            let fb = f2 // Armazena o valor da função no ponto fim (f2)
            let fm // Inicializa a variável que armazenará o valor da função no ponto médio

            while ((fim - ini) > 1e-7) { // Enquanto a distância entre fim e ini for maior que uma precisão desejada (1e-7)

                meio = (ini + fim) / 2 // Calcula o ponto médio entre ini e fim
                fm = avaliarExpressao(primeiraDerivada, meio) // Avalia a função no ponto médio

                if (fa * fm < 0) { // Verifica se o zero está entre ini e meio (testando se o produto dos valores é negativo)
                    fim = meio // Atualiza o fim do intervalo para o meio, reduzindo o intervalo para a metade esquerda
                    fb = fm // Atualiza o valor no fim para o valor no meio
                } else {
                    ini = meio // Caso contrário, atualiza o início para o meio, reduzindo o intervalo para a metade direita
                    fa = fm // Atualiza o valor no início para o valor no meio
                }
            }
            existe = false
            for (let j = 0; j < pontosCriticos.length; j++) { // Verifica se o ponto meio já está muito próximo de algum ponto já encontrado se sim evita que seja adicionado o mesmo Ponto critico
                if (Math.abs(pontosCriticos[j] - Number(meio.toFixed(4))) < 1e-7) {
                    existe = true
                    break;
                }
            }
            if (!existe) {
                pontosCriticos.push(Number(meio.toFixed(4)))// toFixed(4) pra melhorar a busca por numeros muito proximos
                temCritico = true
            }
        }
    }
    for (let i = 0; i < pontosCriticos.length; i++) {// Evita aparecer [-0] no ponto critico
        if (pontosCriticos[i] === 0) {
            pontosCriticos[i] = 0
        }
    }


    if (temCritico) { // Se tem ponto crítico, retorna eles
        console.log("Pontos Críticos:", pontosCriticos)
        return pontosCriticos
    }

    return console.log("Ponto crítico indefinido") // se não tem ponto crítico, retorna mensagem
}

function MaxeMin(segundaDerivada, Xpc) {
    let maximos = [] // Armazena pontos críticos classificados como máximos locais
    let minimos = [] // Armazena pontos críticos classificados como mínimos locais
    let inflexao = [] // Armazena pontos críticos classificados como pontos de inflexão
    if (!Xpc) { // Se não houver pontos críticos, retorna null
        return null
    }
    for (let i = 0; i < Xpc.length; i++) { // Para cada ponto crítico, avalia a segunda derivada e classifica
        let valor = Number(avaliarExpressao(segundaDerivada, Xpc[i]))
        if (valor > 0) { // Segunda derivada positiva indica mínimo local
            minimos.push(Xpc[i])
        }
        else if (valor < 0) { // Segunda derivada negativa indica máximo local
            maximos.push(Xpc[i])
        }
        else {  // Segunda derivada zero indica ponto de inflexão
            inflexao.push(Xpc[i])
        }

    }

    return { maximos, minimos, inflexao } // Retorna objeto com as classificações
}

module.exports = {
    avaliarExpressao,
    pontoCritico,
    MaxeMin
}