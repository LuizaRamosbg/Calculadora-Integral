function calculadoraDerivadaIntegral() {
  const prompt = require("prompt-sync")(); // Importa a biblioteca 'prompt-sync' para ler a entrada do usuário no terminal.

  /**
   * Obtém a função matemática inserida pelo usuário.
   * Retorna A função matemática como uma string.
   */
  function obterFuncaoDoUsuario() {
    const funcaoOriginal = prompt("Digite uma função (ex: 2x^3 + 5x - e^x): "); // Solicita ao usuário que digite uma função matemática e armazena a entrada na variável 'funcaoOriginal'.
    console.log(`Função digitada: ${funcaoOriginal}`); // Exibe a função que o usuário digitou no console.
    return funcaoOriginal; // Retorna a string da função inserida pelo usuário.
  }

  /**
   * Remove os espaços em branco do início e do final de uma string manualmente.
   * @param {string} termo O termo a ser limpo.
   * Retorna O termo sem espaços em branco nas extremidades.
   */
  function limparTermo(termo) {
    let resultado = ""; // Inicializa uma string vazia para armazenar o resultado limpo.
    let inicio = 0; // Define o índice inicial para começar a busca por caracteres não-espaço.
    let fim = termo.length - 1; // Define o índice final para começar a busca por caracteres não-espaço a partir do final.

    while (inicio <= fim && termo[inicio] === ' ') { // Enquanto o índice inicial for menor ou igual ao final E o caractere no índice inicial for um espaço...
      inicio++; // ...avança o índice inicial para encontrar o primeiro caractere não-espaço.
    }

    while (fim >= inicio && termo[fim] === ' ') { // Enquanto o índice final for maior ou igual ao inicial E o caractere no índice final for um espaço...
      fim--; // ...retrocede o índice final para encontrar o último caractere não-espaço.
    }

    for (let i = inicio; i <= fim; i++) { // Loop através da string original, do primeiro caractere não-espaço ao último.
      resultado += termo[i]; // Adiciona cada caractere não-espaço à string 'resultado'.
    }

    return resultado; // Retorna a string 'resultado' que contém o termo sem espaços nas extremidades.
  }

  /**
   * Separa a string da função em um array de termos.
   * @param {string} funcaoOriginal A função matemática como uma string.
   * @returns {string[]} Um array contendo os termos da função.
   */
  function separarFuncao(funcaoOriginal) {
    const termos = []; // Inicializa um array vazio para armazenar os termos separados.
    let termoAtual = ""; // Inicializa uma string vazia para construir o termo atual que está sendo lido.
    let expoente = false
    let qtdParenteses = 0

    for (let i = 0; i < funcaoOriginal.length; i++) { // Loop através de cada caractere da função original.
      const char = funcaoOriginal[i]; // Obtém o caractere atual.

      switch (char) {
        case '+':
        case '-':
        case '*':
          if (qtdParenteses > 0) break;
          if (expoente) {
            expoente = false;
          } else {
            if (termoAtual !== '') termos.push(limparTermo(termoAtual)); // ...adiciona o 'termoAtual' (removendo quaisquer espaços internos) ao array 'termos'.
            termoAtual = ''
          }
          break;
        case '(':
          qtdParenteses++
          break;
        case ')':
          qtdParenteses--
          break;
        case '^':
          expoente = true;
          break;
        default:
          expoente = false;
      }
      termoAtual += char; // Se o caractere não for um separador de termo, adiciona-o ao 'termoAtual'.
      //termoAtual = char; // Começa um novo 'termoAtual' com o sinal ('+' ou '-').
    }
    termos.push(limparTermo(termoAtual)); // ...adiciona o 'termoAtual' (removendo quaisquer espaços internos) ao array 'termos'.

    return termos; // Retorna o array 'termos' contendo os termos separados da função.
  }
  /**
   * Deriva um único termo da função (considerando a regra do tombo para polinômios) sem usar métodos restritos.
   * @param {string} termo O termo a ser derivado.
   * Retorna A derivada do termo.
   */
  function derivarTermo(termo) {
    let coeficienteStr = "";
    let expoenteStr = "";
    let temX = false;
    let encontrouPotencia = false;
    let sinalCoeficiente = "";
    let sinalExpoente
    let temParenteses = false
    let parenteses = ''
    let qtdParenteses = 0

    // Identificando o padrão e^(bx)
    let i = 0;
    let achouE = false;
    let coefStr = "";
    while (i < termo.length) {
      const c = termo[i];
      if (c === 'e' && i + 1 < termo.length && termo[i + 1] === '^') {
        achouE = true;
        break;
      }
      coefStr += c;
      i++;
    }

    if (achouE) {
      let coef = parseFloat(coefStr);
      if (isNaN(coef)) {
        coef = 1; // Se não há coeficiente explícito, consideramos 1.
      }

      // Agora, extraímos o expoente
      i += 2; // Pula o "e^"
      let bStr = "";
      let sinalExpoente = 1;
      if (i < termo.length && (termo[i] === '-' || termo[i] === '+')) {
        sinalExpoente = (termo[i] === '-') ? -1 : 1;
        i++;
      }
      while (i < termo.length && termo[i] !== 'x') {
        bStr += termo[i];
        i++;
      }

      let b = parseFloat(bStr);
      if (isNaN(b)) b = 1;
      b = b * sinalExpoente; // Considera o sinal negativo.

      let derivadaCoef = coef * b; // A derivada de e^(bx) é b * e^(bx)
      let sinalFinal = derivadaCoef < 0 ? '-' : '';
      let coefFinal = Math.abs(derivadaCoef) === 1 ? '' : Math.abs(derivadaCoef);

      let parteExp = 'e^' + (b < 0 ? '(' + b + 'x)' : b === 1 ? 'x' : b + 'x');
      return sinalFinal + coefFinal + parteExp;
    }

    if (termo[0] === '-') sinalCoeficiente = '-'
    else sinalCoeficiente = '+'
    sinalExpoente = '+'

    for (i = 0; i < termo.length; i++) {
      atual = termo[i]

      switch (atual) {
        case 'x':
        case 'X':
          temX = true
          break;
        case '+':
        case '-':
          if (encontrouPotencia) sinalExpoente = atual
          break;
        case '^':
          if (temX || temParenteses) encontrouPotencia = true
          break;
        case '(':
          temParenteses = true
          qtdParenteses++
          parenteses = atual
          do {
            i++
            parenteses += termo[i]
            if (termo[i] === '(') qtdParenteses++
            if (termo[i] === ')') qtdParenteses--
          } while (qtdParenteses > 0);
          break;
        case ' ':
          break;
        default:
          if (!temX && !temParenteses) coeficienteStr += atual
          if (encontrouPotencia) expoenteStr += atual
      }
    }

    let coeficiente = parseFloat(sinalCoeficiente + (coeficienteStr === '' ? '1' : coeficienteStr));
    if (isNaN(coeficiente)) coeficiente = sinalCoeficiente === '-' ? -1 : 1;

    let expoente = parseInt(expoenteStr === '' ? '1' : expoenteStr);
    if (isNaN(expoente)) expoente = 0;
    if (sinalExpoente === '-') expoente *= -1;

    const novoCoeficiente = coeficiente * expoente;
    const novoExpoente = expoente - 1;

    if (temX) {
      if (novoExpoente === 0) {
        return novoCoeficiente === 0 ? '0' : '' + novoCoeficiente;
      } else if (novoExpoente === 1) {
        return novoCoeficiente === 0 ? '0' : '' + novoCoeficiente + 'x';
      } else {
        return novoCoeficiente === 0 ? '0' : '' + novoCoeficiente + 'x^' + novoExpoente;
      }
    } else if (temParenteses) {
      let res;

      if (novoExpoente === 0) {
        res = novoCoeficiente === 0 ? '0' : '' + novoCoeficiente;
      } else if (novoExpoente === 1) {
        res = novoCoeficiente === 0 ? '0' : '' + novoCoeficiente + parenteses;
      } else {
        res = novoCoeficiente === 0 ? '0' : '' + novoCoeficiente + parenteses + '^' + novoExpoente;
      }
      if (res === '1') res = ''

      parenteses = parenteses.slice(1, -1)
      if (parenteses.charAt(0) === '+') parenteses.slice(1);

      let derivadaParenteses = calcularDerivadaPrimeiraOrdem(parenteses)
      if (separarFuncao(derivadaParenteses).length > 1 || res !== '') derivadaParenteses = '(' + derivadaParenteses + ')'

      if (encontrouPotencia) res += ' * '
      res += derivadaParenteses

      return res;
    }

    return '0';
  }


  /**
   * Calcula a derivada de primeira ordem da função inserida sem usar métodos restritos.
   * Retorna A string representando a primeira derivada.
   */
  function calcularDerivadaPrimeiraOrdem(funcaoOriginal) {
    const termos = separarFuncao(funcaoOriginal); // Separa a função original em um array de termos.
    const derivadas = []; // Inicializa um array para armazenar as derivadas de cada termo.

    termos.push('')
    for (let i = 0; i < termos.length - 1; i++) { // Loop através de cada termo.
      if (termos[i + 1].charAt(0) === '*') {
        derivadas.push(derivarTermo(termos[i]))
        derivadas.push(termos[i + 1])
        derivadas.push(termos[i])
        derivadas.push(`* ${derivarTermo(termos[i + 1])}`)
        i++
      } else {
        derivadas.push(derivarTermo(termos[i])); // Deriva o termo atual e adiciona a derivada ao array 'derivadas'.
      }

    }

    let resultado = ""; // Inicializa uma string vazia para construir a string da derivada resultante.
    for (let i = 0; i < derivadas.length; i++) { // Loop através de cada derivada no array 'derivadas'.
      const derivada = derivadas[i]; // Obtém a derivada atual.
      if (derivada !== '0') { // Se a derivada não for zero...
        if (resultado.length > 0) { // E se já houver algo na string 'resultado' (não é o primeiro termo não-zero)...
          if (derivada[0] === '*') {
            resultado += ' ' + derivada; // ...adiciona a derivada à string 'resultado'.
          } else {
            if (derivada[0] === '-') { // Se a derivada começa com um sinal de menos...
              resultado += ' - '; // ...adiciona " - " à string 'resultado'.
              resultado += derivada.substring(1);
            } else { // Se a derivada for positiva...
              resultado += ' + '; // ...adiciona " + " à string 'resultado'.
              resultado += derivada; // ...adiciona a derivada à string 'resultado'.
            }
          }
        } else { // Se for o primeiro termo não-zero...
          resultado += derivada; // ...adiciona a derivada diretamente à string 'resultado'.
        }
      }
    }
    return resultado === "" ? "0" : resultado; // Retorna a string da derivada resultante (ou "0" se todas as derivadas forem zero).
  }

  /**
   * Calcula a derivada de segunda ordem da função, baseada na primeira derivada.
   * @param {string} primeiraDerivada A string representando a primeira derivada.
   * Retorna Uma mensagem indicando que a funcionalidade não está implementada.
   */
  function calcularDerivadaSegundaOrdem(primeiraDerivada) {
    return "Ainda não implementado"; // Retorna uma mensagem indicando que a derivação de segunda ordem ainda não foi implementada.
  }

  /**
   * Função principal que coordena o processo.
   */
  function main() {
    const funcao = obterFuncaoDoUsuario(); // Obtém a função inserida pelo usuário.
    const primeiraDerivada = calcularDerivadaPrimeiraOrdem(funcao); // Calcula a primeira derivada da função.
    console.log(`A primeira derivada é: ${primeiraDerivada}`); // Exibe a primeira derivada no console.
    /*
      console.log(separarFuncao(primeiraDerivada))
      const segundaDerivada = calcularDerivadaPrimeiraOrdem(primeiraDerivada); // Calcula a segunda derivada da função.
      console.log(`A segunda derivada é: ${segundaDerivada}`); // Exibe a segunda derivada no console.
    */

  }

  main(); // Chama a função principal para iniciar o programa.
}

calculadoraDerivadaIntegral(); // Chama a função principal da calculadora.