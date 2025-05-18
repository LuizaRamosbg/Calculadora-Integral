const termoLimpo = {
  sinalCoeficiente: "+",  // Guarda o sinal do coeficiente do termo
  valorCoeficiente: "",   // Guarda o valor do coeficiente do termo
  temX: false,            // Guarda se o termo tem um x ou não]
  temParenteses: false,   // Guarda se o termo tem um parênteses ou não
  conteudoParenteses: '', // Gurda o conteúdo de um parênteses encontrado
  temPotencia: false,     // Guarda se o termo tem uma potência ou não
  sinalExpoente: "+",     // Guarda o sinal do expoente do termo
  valorExpoente: "",      // Guarda o valor do expoente do termo
  temProduto: false       // Guarda se o termo atual deve ter a regra doproduto aplicada
}

function calculadoraDerivadaIntegral() {
  const prompt = require("prompt-sync")() // Importa a biblioteca 'prompt-sync' para ler a entrada do usuário no terminal.

  /**
   * Obtém a função matemática inserida pelo usuário.
   * Retorna A função matemática como uma string.
   */
  function obterFuncaoDoUsuario() {
    const funcaoOriginal = prompt("Digite uma função (ex: 2x^3 + 5x - e^x): ") // Solicita ao usuário que digite uma função matemática e armazena a entrada na variável 'funcaoOriginal'.
    console.log(`Função digitada: ${funcaoOriginal}`) // Exibe a função que o usuário digitou no console.
    return funcaoOriginal // Retorna a string da função inserida pelo usuário.
  }

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
          if (funcaoLimpa[i-1] === '^' || funcaoLimpa[i-1] === '*') 
            break; // Se o ultimo caractere for um * ou ^ considera que o sinal é da multiplicação ou expoente, respectivamente
          if (termoAtual !== '') termos.push(dissecaTermo(termoAtual)) // adiciona o termoAtual como um termo dissecado.
          termoAtual = '' // Inicia o próximo termo vazio
          break;
        case 'x':
          if(dissecaTermo(termoAtual).temParenteses){ // Se o termo atual já tem um parenteses, considera que são dois termos distintos se multiplicando
            termos.push(dissecaTermo(termoAtual)) // adiciona o termoAtual como um termo dissecado.
            termoAtual = '*' // Inicia o próximo termo com '*'
          }
        break;
        case '(': // Ao encontrar o início de um parênteses colocorá todo o seu conteúdo em um único termo
          if(dissecaTermo(termoAtual).temX){ // Se o termo atual já tem um x, considera que são dois termos distintos se multiplicando
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
          if(funcaoLimpa[i-1] === 'x' || funcaoLimpa[i-1] === ')'){
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
   * Coleta todos os dados de um termo e os separa em um objeto 
   * @param {string} termo O termo que será dissecado
   * @returns {object}    Um objeto contendo todos os dados do termo
   */
  function dissecaTermo(termo) {
    let valsTermo = { ...termoLimpo } // Inicia valsTermo como um termo com todos os dados zerados baseado em termoLimpo
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

    if (termo[0] === '-' || termo[0] === '*' && termo[1] === '-') valsTermo.sinalCoeficiente = '-' // Se o termo começa com menos define o sinal como -

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
          if (valsTermo.temPotencia) valsTermo.sinalExpoente = charAtual // Ao encontrar um sinal após encontrar um ^ atualiza o sinal do expoente 
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

    if(isNaN(valsTermo.valorCoeficiente)) valsTermo.valorCoeficiente = '1' // Caso tenha algum erro no coeficiente, o reseta para 1
    if(isNaN(valsTermo.valorExpoente)) { // Caso tenha algum erro no expoente, o reseta para 0 e atualiza temPotencia para falso
      valsTermo.valorExpoente = '0' 
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
    termoMontado = termo.valorCoeficiente // Inicia o termo com o valor do coeficiente

    if (termo.temX) { // Caso tenha x, o adiciona no termo
      termoMontado += "x"
    } else if (termo.temParenteses) { // Caso tenha um parênteses o adiciona no termo 
      termoMontado += termo.conteudoParenteses
    }
    if (termo.temPotencia) { // Caso tenha uma potência, a adiciona no termo
      termoMontado += '^' + (termo.sinalExpoente === '-' ? '-' : '') + termo.valorExpoente
    }

    if (!primeiro && termo.sinalCoeficiente === '+' || termo.sinalCoeficiente === '-' && !parenteses) // Adiciona o sinal no termo, exceto quando o termo é positivo e é o primeiro na expressão(pode ser omitido)
      termoMontado = ` ${termo.sinalCoeficiente} ${termoMontado}`

    if (parenteses && termo.sinalCoeficiente === '-') // Adiciona o termo dentro de parênteses quando parenteses é verdadeiro e o termo é negativo 
      termoMontado = '(' + termo.sinalCoeficiente + termoMontado + ')'

    return termoMontado // Retorna o termo montado
  }

  /**
   * Deriva um único termo da função (considerando a regra do tombo para polinômios) sem usar métodos restritos.
   * @param {object} termo O termo a ser derivado.
   * @returns {string} Rtorna a derivada do termo
   */
  function derivarTermo(termo) {
    let coeficienteOriginal = parseFloat(termo.sinalCoeficiente + (termo.valorCoeficiente === '' ? '1' : termo.valorCoeficiente)) // Adiciona o sinal e valor do coeficiente em uma váriável nova
    if (isNaN(coeficienteOriginal)) coeficienteOriginal = termo.sinalCoeficiente === '-' ? -1 : 1 // Caso algo errado tenha sido inserido reseta coeficienteOriginal para 1 ou -1

    expoenteOriginal = parseInt(termo.sinalExpoente + (termo.valorExpoente === '' ? '1' : termo.valorExpoente)) // Adiciona o sinal e valor do expoente em uma váriável nova
    if (isNaN(expoenteOriginal)) expoenteOriginal = 0 // Caso algo errado tenha sido inserido reseta expoenteOriginal para 0

    // A regra do tombo é aplicada utilizando coeficienteOriginal e expoenteOriginal
    const novoCoeficiente = coeficienteOriginal * expoenteOriginal
    const novoExpoente = expoenteOriginal - 1

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
    let produto // Guarda o produto de duas derivadas
    let i

    for (i = 0; i < termos.length; i++) { // Loop através de cada termo.
      if (termos[i].temProduto) { // Caso o termo atual(g(x)) começe com um '*' aplica a regra do produdo com ele e o termo anterior(f(x))
        produto = `(${derivadas[i - 1]} * ${montaTermo(termos[i], true, true)}${montaTermo(termos[i - 1])} * ${derivarTermo(termos[i])})` // produto recebe "(f'(x) * g(x) + f(x) * g'(x))
        derivadas[i - 1] = '' // Zera a derivada anterior para que não seja repetida
        termos[i] = dissecaTermo(`(${montaTermo(termos[i - 1], true)}${montaTermo(termos[i])})`) // Transforma o termo atual em f(x) * g(x) para corresponder com sua derivada
        derivadas.push(produto) // Adiciona a nova derivada de f(x) * g(x) em derivadas
      } else {
        derivadas.push(derivarTermo(termos[i])) // Deriva o termo atual e adiciona a derivada ao array 'derivadas'.
      }
    }

    let resultado = "" // Inicializa uma string vazia para construir a string da derivada resultante.
    for (i = 0; i < derivadas.length; i++) { // Loop através de cada derivada no array 'derivadas'.
      if (derivadas[i] !== '') { // Disseca e monta cada termo derivado para correções na digitação
        if (resultado === '')
          resultado += montaTermo(dissecaTermo(derivadas[i]), true) // Primeiro termo e sem parênteses
        else
          resultado += montaTermo(dissecaTermo(derivadas[i])) // Não é o primeiro termo
          //resultado += montaTermo(dissecaTermo(derivadas[i]), false, true) // Não é o primeiro termo e com parênteses
      }
    }
    return resultado === "" ? "0" : resultado // Retorna a string da derivada resultante (ou "0" se todas as derivadas forem zero).
  }

  /**
   * 
   * @param {*} expr 
   * @param {*} x 
   * @returns 
   */
  function avaliarExpressao(expr, x) {
    let expressaoComValor = ''

    let char
    let anterior
    for (let i = 0; i < expr.length; i++) {
      char = expr[i]

      switch (char) {
        case 'x':
          if (i > 0) {
            anterior = expr[i - 1]

            // Verifica se o caractere anterior é um número ou ')'
            if (anterior >= '0' && anterior <= '9' || anterior === ')') {
              expressaoComValor += `*(${x})`
            }
            else if (anterior === '(') {
              expressaoComValor += `${x}`
            } else {
              expressaoComValor += `(${x})`
            }
          }
          break;
        case '^':
          expressaoComValor += '**' + expr[i + 1]
          i++
          break;
        case '(':
          anterior = expr[i - 1]

          if (anterior >= '0' && anterior <= '9' || anterior === ')' || anterior === 'x')
            expressaoComValor += '*('
          else
            expressaoComValor += char
          break;
        default:
          expressaoComValor += char
      }
    }
    return eval(expressaoComValor)
  }

  /**
   * 
   * @param {*} primeiraDerivada 
   * @returns 
   */
  function pontoCritico(primeiraDerivada) {
    if (Number(primeiraDerivada) === 0) return console.log("Ponto crítico indefinido")

    let pontosCriticos = []
    let temCritico = false
    let existe
    // Esse Loop procura a troca de sinal das funções
    let f1, f2
    for (let i = -10; i < 10; i += 0.1) {
      f1 = avaliarExpressao(primeiraDerivada, i)
      f2 = avaliarExpressao(primeiraDerivada, i + 0.1)

      if (Math.abs(f1) < 0.00001) {
        existe = false
        for (let j = 0; j < pontosCriticos.length; j++) {// Verifica se o ponto no intervalo i. ja foi adicionado
          if (Math.abs(pontosCriticos[j] - Number(i.toFixed(4))) < 0.0001) {
            existe = true
            break;
          }
        }
        if (!existe) {
          pontosCriticos.push(Number(i.toFixed(4)))
          temCritico = true
        }


      }
      if (f1 * f2 < 0) {
        // Busca Binaria entre i e i+1
        let ini = i
        let fim = i + 0.1
        let meio
        let fa = f1
        let fb = f2
        let fm

        while ((fim - ini) > 0.00001) {
          meio = (ini + fim) / 2
          fm = avaliarExpressao(primeiraDerivada, meio)

          if (fa * fm < 0) {
            fim = meio
            fb = fm
          } else {
            ini = meio
            fa = fm
          }
        }

        existe = false
        for (let j = 0; j < pontosCriticos.length; j++) { // Verifica se o ponto meio já está muito próximo de algum ponto já encontrado se sim evita que seja adicionado o mesmo Ponto critico
          if (Math.abs(pontosCriticos[j] - Number(meio.toFixed(4))) < 0.0001) {
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


    if (temCritico) {
      console.log("Pontos Críticos:", pontosCriticos)
      return pontosCriticos
    }

    return console.log("Ponto crítico indefinido")
  }

  function MaxeMin(segundaDerivada, Xpc) {
    let maximos = []
    let minimos = []
    let inflexao = []
    if (!Xpc) {
      return null
    }
    for (let i = 0; i < Xpc.length; i++) {
      let valor = Number(avaliarExpressao(segundaDerivada, Xpc[i]))
      if (valor > 0) {
        minimos.push(Xpc[i])
      }
      else if (valor < 0) {
        maximos.push(Xpc[i])
      }
      else {
        inflexao.push(Xpc[i])
      }

    }

    return { maximos, minimos, inflexao }
  }
  /**
   * Calcula a derivada de primeira ordem da função inserida sem usar métodos restritos.
   * Retorna A string representando a primeira derivada.
   */
  function calcularDerivadaPrimeiraOrdem(funcaoOriginal) {
    return "Ainda não implementado" // Retorna uma mensagem indicando que a derivação de primeira ordem ainda não foi implementada.
  }

  /**
   * Calcula a derivada de segunda ordem da função, baseada na primeira derivada.
   * @param {string} primeiraDerivada A string representando a primeira derivada.
   * Retorna Uma mensagem indicando que a funcionalidade não está implementada.
   */
  function calcularDerivadaSegundaOrdem(primeiraDerivada) {
    return "Ainda não implementado" // Retorna uma mensagem indicando que a derivação de segunda ordem ainda não foi implementada.
  }

  /**
   * Função principal que coordena o processo.
   */
  function main() {
    const funcao = obterFuncaoDoUsuario() // Obtém a função inserida pelo usuário.
    const primeiraDerivada = calcularDerivada(funcao) // Calcula a primeira derivada da função.
    console.log(`A primeira derivada é: ${primeiraDerivada}`) // Exibe a primeira derivada no console.
    const Xpc = pontoCritico(primeiraDerivada) // Exibe o ponto crítico da função da função.
    const segundaDerivada = calcularDerivada(primeiraDerivada)
    console.log(`A segunda derivada é: ${segundaDerivada}`) // Exibe a segunda derivada da função.
    const MaxMin = MaxeMin(segundaDerivada, Xpc)
    if (MaxMin) {
      MaxMin.minimos.length > 0 ? console.log(`Ponto min: ${MaxMin.minimos}`) : null
      MaxMin.inflexao.length > 0 ? console.log(`Ponto de inflexão: ${MaxMin.inflexao}`) : null
      MaxMin.maximos.length > 0 ? console.log(`Ponto max: ${MaxMin.maximos}`) : null
    }
    /*
      console.log(separarFuncao(primeiraDerivada))
      const segundaDerivada = calcularDerivada(primeiraDerivada) // Calcula a segunda derivada da função.
      console.log(`A segunda derivada é: ${segundaDerivada}`) // Exibe a segunda derivada no console.
    */

  }

  main() // Chama a função principal para iniciar o programa.
}

calculadoraDerivadaIntegral() // Chama a função principal da calculadora.