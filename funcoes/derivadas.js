const {
    dissecaTermo,
    montaTermo
} = require("./termos")

const {
    limparFuncao,
    separarFuncao
} = require("./funcoes")
/**
 * Deriva um único termo da função (considerando a regra do tombo para polinômios) sem usar métodos restritos.
 * @param {object} termo O termo a ser derivado.
 * @returns {string} Rtorna a derivada do termo
 */
function derivarTermo(termo) {
    // A regra do tombo é aplicada utilizando coeficienteOriginal e expoenteOriginal
    const novoCoeficiente = termo.valorCoeficiente * termo.valorExpoente
    const novoExpoente = termo.valorExpoente - 1

    if (termo.temX) { // Tratamento para quando o termo tem um x
        if (novoExpoente === 0) {
            return novoCoeficiente === 0 ? '0' : '' + novoCoeficiente // Se o novo expoente for 0 (x vai sumir) retorna somente o novo coeficiente
        } else if (novoExpoente === 1) {
            return novoCoeficiente === 0 ? '0' : '' + novoCoeficiente + 'x' // Se o novo expoente for 1 (pode ser omitido) retorna somente o novo coeficiente seguido de x
        } else {
            return novoCoeficiente === 0 ? '0' : '' + novoCoeficiente + 'x^' + novoExpoente // Senão retorna o novo coeficiente seguido de x seguido do expoente
        }
    } else if (termo.temParenteses) { // Tratamento para quando o termo tem um parênteses
        let res // Variável para guarda o conteúdo do resultado f'(g(x)) * g'(x)

        if (novoExpoente === 0) {
            res = novoCoeficiente === 0 ? '0' : '' + novoCoeficiente // Se o novo expoente for 0 (parenteses vai sumir) guarda somente o novo coeficiente
        } else if (novoExpoente === 1) {
            res = novoCoeficiente === 0 ? '0' : '' + novoCoeficiente + termo.conteudoParenteses // Se o novo expoente for 1 (pode ser omitido) guarda somente o novo coeficiente seguido do parênteses
        } else {
            res = novoCoeficiente === 0 ? '0' : '' + novoCoeficiente + termo.conteudoParenteses + '^' + novoExpoente // Senão guarda o novo coeficiente seguido do parênteses seguido do expoente
        }
        if (res === '1') res = '' // Se o resultado do tombo do parênteses for 1 (pode ser omitido) limpa res para que fique somente g'(x)

        if (termo.conteudoParenteses.charAt(0) === '+') termo.conteudoParenteses.slice(1) // Se o conteúdo do parenteses começar com um + (pode ser omitido), o retira

        let derivadaParenteses = calcularDerivada(termo.conteudoParenteses) // Guarda o valor da derivada do parênteses(g'(x))
        if (separarFuncao(derivadaParenteses).length > 1 || res !== '') derivadaParenteses = '(' + derivadaParenteses + ')' // Caso a derivada do parênteses tenha mais de um termo ou f(g(x)) não seja vazio, adiciona coloca a derivada do parênteses em um parênteses

        if (termo.temPotencia) res += ' * ' // Caso não haja potência, ou seja, o resultado é somente um número, não é adicionado o ' * ' para que a vizualização fique melhor
        res += derivadaParenteses // Adiciona a derivada do parênteses no resultado

        return res // Retorna o resultado da derivada completa
    }

    return '0'
}

/**
 * Calcula a derivada de da função inserida sem usar métodos restritos.
 * @param {string} funcaoOriginal Função que será derivada
 * @returns {string} Retorna A string representando a derivada.
 */
function calcularDerivada(funcaoOriginal) {
    const termos = separarFuncao(funcaoOriginal) // Separa a função original em um array de termos.
    const derivadas = [] // Inicializa um array para armazenar as derivadas de cada termo.
    const termosDerivadas = [] // Inicializa um array para armazenar os termos da derivada.
    let produto // Guarda o produto de duas derivadas
    let i

    for (i = 0; i < termos.length; i++) { // Loop através de cada termo.
        if (termos[i].temProduto) { // Caso o termo atual(g(x)) começe com um '*' aplica a regra do produdo com ele e o termo anterior(f(x))
            produto = `(${derivadas[i - 1]}${montaTermo(termos[i], true, true)}${montaTermo(termos[i - 1])} * ${derivarTermo(termos[i])})` // produto recebe "(f'(x) * g(x) + f(x) * g'(x))
            derivadas[i - 1] = '' // Zera a derivada anterior para que não seja repetida
            termos[i] = dissecaTermo(`(${montaTermo(termos[i - 1], true)}${montaTermo(termos[i])})`) // Transforma o termo atual em f(x) * g(x) para corresponder com sua derivada
            derivadas.push(produto) // Adiciona a nova derivada de f(x) * g(x) em derivadas
        } else {
            derivadas.push(derivarTermo(termos[i])) // Deriva o termo atual e adiciona a derivada ao array 'derivadas'.
        }
    }
    for (i = 0; i < derivadas.length; i++) {
        if (derivadas[i] !== '' && derivadas[i] !== '0')
            termosDerivadas.push(...separarFuncao(derivadas[i]))
    }
    let resultado = "" // Inicializa uma string vazia para construir a string da derivada resultante.
    for (i = 0; i < termosDerivadas.length; i++) { // Loop através de cada derivada no array 'derivadas'.
        if (resultado === '')
            resultado += montaTermo(termosDerivadas[i], true) // Primeiro termo 
        else
            resultado += montaTermo(termosDerivadas[i]) // Não é o primeiro termo
    }
    resultado = resultado.replaceAll("* +", "*")
    return resultado === "" ? "0" : resultado // Retorna a string da derivada resultante (ou "0" se todas as derivadas forem zero).
}

module.exports = {
    derivarTermo,
    calcularDerivada
}