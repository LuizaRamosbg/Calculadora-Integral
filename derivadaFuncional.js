const {
  derivarTermo,
  calcularDerivada
} = require("./funcoes/derivadas")

const {
  avaliarExpressao,
  pontoCritico,
  MaxeMin
} = require("./funcoes/ponto_critico")

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