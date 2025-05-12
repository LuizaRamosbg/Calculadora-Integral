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
    const termos = [];    // Inicializa um array vazio para armazenar os termos separados.
    let termoAtual = "";  // Inicializa uma string vazia para construir o termo atual que está sendo lido.
    let expoente = false  // Utilizado para impedir que um sinal digitado em um expoente seja visto como um novo termo
    let qtdParenteses = 0 // Conta quantos parênteses estão abertos em um dado momento
    let charAtual         // Guarda o caractere atual.

    for (let i = 0; i < funcaoOriginal.length; i++) { // Loop através de cada caractere da função original.
      while (funcaoOriginal[0] === '(' && funcaoOriginal[funcaoOriginal.length-1] === ')')
        funcaoOriginal = funcaoOriginal.slice(1, -1) //remove redundâncias como (((2x^2))) -> 2x^2

      charAtual = funcaoOriginal[i]; // Obtém o caractere atual.

      switch (charAtual) {
        case '+':
        case '-':
          if (expoente) {
            expoente = false; // Quando um sinal foi encontrado no expoente não inicia um termo novo
            break;
          }
        case '*':
          if (termoAtual !== '') termos.push(limparTermo(termoAtual)); // ...adiciona o 'termoAtual' (removendo quaisquer espaços no ínicio e fim) ao array 'termos'.
          termoAtual = '' // Inicia o próximo termo vazio
          break;
        case '(': // Ao encontrar o início de um parênteses colocorá todo o seu conteúdo em um único termo
          qtdParenteses++ // Incrementa a quantidade de parênteses
          do {
            termoAtual += funcaoOriginal[i] // Adciona o próximo termo do parênteses
            i++                             // Incrementa i para continuar verificar o próximo termo
            if (funcaoOriginal[i] === '(') qtdParenteses++ // Ao encontrar um ínicio de um novo parênteses incrementa a quantidade de parênteses
            if (funcaoOriginal[i] === ')') qtdParenteses-- // Ao encontrar o fim de um  parênteses decrementa a quantidade de parênteses
          } while (qtdParenteses > 0); // Repete enquanto tiver algum parênteses aberto
          charAtual = funcaoOriginal[i]
          expoente = false 
          break;
        case '^':
          expoente = true; 
          break;
        default:
          expoente = false; 
      }
      termoAtual += charAtual; // Adiciona o caratere encontrado ao termo atual

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
    /*
    while(termo[0] === '(' && termo[termo.length-1] === ')') 
      termo = termo.slice(1, -1)*/

    let sinalCoeficiente = "" // Guarda o sinal do coeficiente do termo
    let coeficienteStr = ""   // Guarda o valor do coeficiente do termo
    let temX = false          // Guarda se o termo tem um x ou não
    let temPotencia = false   // Guarda se o termo tem uma potência ou não
    let sinalExpoente = ""    // Guarda o sinal do expoente do termo
    let expoenteStr = ""      // Guarda o valor do expoente do termo
    let temParenteses = false // Guarda se o termo tem um parênteses ou não
    let conteudoParenteses = ''       // Gurda o conteúdo de um parênteses encontrado
    let qtdParenteses = 0     // Guarda quantos parênteses estão abertos

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

    if (termo[0] === '-') sinalCoeficiente = '-' // Se o termo começa com menos define o sinal como -
    else sinalCoeficiente = '+'                  // Senão define o sinal como +
    sinalExpoente = '+' // Inicia o sinal do expoente como +

    let charAtual // Guarda o caractere atual
    for (i = 0; i < termo.length; i++) {
      charAtual = termo[i] // Obtém o caractere atual

      switch (charAtual) {
        case 'x':
        case 'X':
          temX = true // Ao encontrar um x atualiza temX
          break;
        case '+':
        case '-':
          if (temPotencia) sinalExpoente = charAtual // Ao encontrar um sinal após um ^ atualiza o sinal do expoente 
          break;
        case '^':
          if (temX || temParenteses) temPotencia = true // Ao encontrar uma potência atualiza temPotencia
          break;
        case '(': // Ao encontrar o início de um parênteses colocorá seu conteúdo na variável conteudoParenteses
          temParenteses = true // Atualiza temParenteses
          qtdParenteses++      // Inicia a contagem de quantos parênteses estão abertos
          conteudoParenteses = charAtual
          do {
            i++                                   // Avança para o próximo termo
            conteudoParenteses += termo[i]        // Insere o termo atual em conteudoParenteses
            if (termo[i] === '(') qtdParenteses++ // Ao encontrar um ínicio de um novo parênteses incrementa a quantidade de parênteses
            if (termo[i] === ')') qtdParenteses-- // Ao encontrar o fim de um  parênteses decrementa a quantidade de parênteses
          } while (qtdParenteses > 0); // Repete enquanto tiver algum parênteses aberto
          break;
        case '*':
        case ' ':
          break; // Ignora '*' e espaços vazios
        default: // qualquer outro caractere será adicionado em coeficienteStr ou expoenteStr
          if (!temX && !temParenteses) coeficienteStr += charAtual // Enquanto um x ou parênteses não tiver sido encontrado, adiciona em coeficienteStr
          if (temPotencia) expoenteStr += charAtual                // Após encontrar uma potência adiciona em expoenteStr
      }
    }

    let coeficienteOriginal = parseFloat(sinalCoeficiente + (coeficienteStr === '' ? '1' : coeficienteStr)); // Adiciona o sinal e valor do coeficiente em uma váriável nova
    if (isNaN(coeficienteOriginal)) coeficienteOriginal = sinalCoeficiente === '-' ? -1 : 1; // Caso algo errado tenha sido inserido reseta coeficienteOriginal para 1 ou -1

    let expoenteOriginal = parseInt(sinalExpoente + (expoenteStr === '' ? '1' : expoenteStr)); // Adiciona o sinal e valor do expoente em uma váriável nova
    if (isNaN(expoenteOriginal)) expoenteOriginal = 0; // Caso algo errado tenha sido inserido reseta expoenteOriginal para 0

    // A regra do tombo é aplicada utilizando coeficienteOriginal e expoenteOriginal
    const novoCoeficiente = coeficienteOriginal * expoenteOriginal; 
    const novoExpoente = expoenteOriginal - 1; 

    if (temX) { // Tratamento para quando o termo tem um x
      if (novoExpoente === 0) {
        return novoCoeficiente === 0 ? '0' : '' + novoCoeficiente; // Se o novo expoente for 0 (x vai sumir) retorna somente o novo coeficiente
      } else if (novoExpoente === 1) {
        return novoCoeficiente === 0 ? '0' : '' + novoCoeficiente + 'x'; // Se o novo expoente for 1 (pode ser omitido) retorna somente o novo coeficiente seguido de x
      } else {
        return novoCoeficiente === 0 ? '0' : '' + novoCoeficiente + 'x^' + novoExpoente; // Senão retorna o novo coeficiente seguido de x seguido do expoente
      }
    } else if (temParenteses) { // Tratamento para quando o termo tem um parênteses
      let res; // Variável para guarda o conteúdo do resultado f'(g(x)) * g'(x)

      if (novoExpoente === 0) {
        res = novoCoeficiente === 0 ? '0' : '' + novoCoeficiente; // Se o novo expoente for 0 (parenteses vai sumir) guarda somente o novo coeficiente
      } else if (novoExpoente === 1) {
        res = novoCoeficiente === 0 ? '0' : '' + novoCoeficiente + conteudoParenteses; // Se o novo expoente for 1 (pode ser omitido) guarda somente o novo coeficiente seguido do parênteses
      } else {
        res = novoCoeficiente === 0 ? '0' : '' + novoCoeficiente + conteudoParenteses + '^' + novoExpoente; // Senão guarda o novo coeficiente seguido do parênteses seguido do expoente
      }
      if (res === '1') res = '' // Se o resultado do tombo do parênteses for 1 (pode ser omitido) limpa res para que fique somente g'(x)

      if (conteudoParenteses.charAt(0) === '+') conteudoParenteses.slice(1); // Se o conteúdo do parenteses começar com um + (pode ser omitido), o retira

      let derivadaParenteses = calcularDerivadaPrimeiraOrdem(conteudoParenteses) // Guarda o valor da derivada do parênteses(g'(x))
      if (separarFuncao(derivadaParenteses).length > 1 || res !== '') derivadaParenteses = '(' + derivadaParenteses + ')' // Caso a derivada do parênteses tenha mais de um termo ou f(g(x)) não seja vazio, adiciona coloca a derivada do parênteses em um parênteses

      if (temPotencia) res += ' * ' // Caso não haja potência, ou seja, o resultado é somente um número, não e adicionado o ' * ' para que a vizualização fique melhor
      res += derivadaParenteses // Adiciona a derivada do parênteses no resultado

      return res;
    }

    return '0';
  }

  /**
   * Calcula a derivada de da função inserida sem usar métodos restritos.
   * Retorna A string representando a derivada.
   */
  function calcularDerivada(funcaoOriginal) {
    const termos = separarFuncao(funcaoOriginal); // Separa a função original em um array de termos.
    const derivadas = []; // Inicializa um array para armazenar as derivadas de cada termo.
    let produto // Guarda o produto de duas derivadas
    let i

    for (i = 0; i < termos.length; i++) { // Loop através de cada termo.
      if (termos[i].charAt(0) === '*') { // Caso o termo atual(g(x)) começe com um '*' aplica a regra do produdo com ele e o termo anterior(f(x))
        produto = '' // Inicia produto vazio
        produto += `(${derivadas[i - 1]} ${termos[i]} + ${termos[i - 1]} * ${derivarTermo(termos[i])})` // produto recebe "(f'(x) * g(x) + f(x) * g'(x))
        derivadas[i - 1] = '0' // Zera a derivada anterior para que não seja repetida
        termos[i] = termos[i - 1] + ' ' + termos[i] // Transforma o termo atual em f(x) * g(x) para corresponder com sua derivada
        derivadas.push(produto) // Adiciona a nova derivada de f(x) * g(x) em derivadas
      } else {
        derivadas.push(derivarTermo(termos[i])); // Deriva o termo atual e adiciona a derivada ao array 'derivadas'.
      }
    }

    let resultado = ""; // Inicializa uma string vazia para construir a string da derivada resultante.
    for (i = 0; i < derivadas.length; i++) { // Loop através de cada derivada no array 'derivadas'.
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

    function pontoCritico(primeiraDerivada) {
    const pontosCriticos = [];
    let expressaoComValor = '';
    let primeiroX = false;
    let temCritico = false;
    let temMulti = false;


    for (let i = -10; i <= 10; i++) { // intervalo de busca
        expressaoComValor = '';
        if(primeiraDerivada[0] === 'x'){
            primeiroX = true
        }
       

        for (let j = 0; j < primeiraDerivada.length; j++) {
            const char = primeiraDerivada[j];
            if(primeiraDerivada[j] === '*'){
              temMulti = true;
            }

            if (char === 'x') {
                if (primeiroX) {
                    expressaoComValor += '('+i+')';// se começar com x faz a troca
                    primeiroX = false;
                } else if(!temMulti){
                    expressaoComValor += '*' + '('+i+')';// se tiver algum numero atras, faz a troca com o sinal de multiplicação
                }
                else{
                  expressaoComValor += i
                }
            } else if (char === '^') {// troca o sinal '^' para '**' potencia
                expressaoComValor += '**' + primeiraDerivada[j + 1];
                j++;
            } else {
                expressaoComValor += char;
            }
        }

        const resultado = eval(expressaoComValor);
        if (Math.abs(resultado) < 0.00001) {// compara o resultado da conta com um valor bem proximo de 0;
            let pontoCriticoArredondado = Math.trunc(i)// arredonda o valor
            pontosCriticos.push(pontoCriticoArredondado);
            temCritico = true;
        }
    }
  if(temCritico){
    console.log("Pontos Críticos:", pontosCriticos);
    return pontosCriticos;
  }
  return console.log("Ponto critico Indefinido");
}

  /**
   * Calcula a derivada de primeira ordem da função inserida sem usar métodos restritos.
   * Retorna A string representando a primeira derivada.
   */
  function calcularDerivadaPrimeiraOrdem(funcaoOriginal) {
    return "Ainda não implementado"; // Retorna uma mensagem indicando que a derivação de primeira ordem ainda não foi implementada.
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
    const primeiraDerivada = calcularDerivada(funcao); // Calcula a primeira derivada da função.
    console.log(`A primeira derivada é: ${primeiraDerivada}`); // Exibe a primeira derivada no console.
    const Xpc = pontoCritico(primeiraDerivada);
    /*
      console.log(separarFuncao(primeiraDerivada))
      const segundaDerivada = calcularDerivada(primeiraDerivada); // Calcula a segunda derivada da função.
      console.log(`A segunda derivada é: ${segundaDerivada}`); // Exibe a segunda derivada no console.
    */

  }

  main(); // Chama a função principal para iniciar o programa.
}

calculadoraDerivadaIntegral(); // Chama a função principal da calculadora.