const {
  derivarTermo,
  calcularDerivada
} = require("./funcoes/derivadas")

const {
  avaliarExpressao,
  pontoCritico,
  MaxeMin
} = require("./funcoes/ponto_critico")

const {
  regradoTrapezio,
  regradoSimpson
} = require("./funcoes/integral")

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

  function intervaloBusca() {
    let intervaloMin = (prompt("Digite o intervalo minimo da busca: "))
    let intervaloMax = (prompt("Digite o intervalo maximo da busca: "))

    if(isNaN(intervaloMin) || isNaN(intervaloMax) || intervaloMin === '' || intervaloMax === ''){
      console.log("Valor inválido ou vazio para o intervalo mínimo ou máximo. Usando -10 a 10 como padrão.");
      intervaloMin = "-10"
      intervaloMax = "10"
    }

    return { intervaloMin, intervaloMax }
  }

    function pontoInicial_e_Final() {
    let inicio = (prompt("Digite o ponto inicial da integral: "))
    let fim = (prompt("Digite o ponto final da integral: "))

    if(isNaN(inicio) || isNaN(fim) || inicio === '' || fim === ''){
      console.log("Valor inválido ou vazio para o ponto inical ou final. Usando 0 a 10 como padrão.");
      inicio = "0"
      fim = "10"
    }

    return { inicio, fim }
  }

  function numDivisoesIntegral(){
    let quantidade = (prompt("Digite a quantidade de divisões da integral: "))
    
    if(isNaN(quantidade) || quantidade === ''){
    console.log("Valor inválido ou vazio para o número de divisões. 10 como padrão.");
    quantidade = "10"
    }
    return quantidade
  }

  /**
   * Função principal que coordena o processo.
   */
  function main() {
    const funcao = obterFuncaoDoUsuario() // Obtém a função inserida pelo usuário.
    const primeiraDerivada = calcularDerivada(funcao) // Calcula a primeira derivada da função.
    console.log(`A primeira derivada é: ${primeiraDerivada}`) // Exibe a primeira derivada no console.
    const segundaDerivada = calcularDerivada(primeiraDerivada)
    console.log(`A segunda derivada é: ${segundaDerivada}`) // Exibe a segunda derivada da função.
    const intervalo = intervaloBusca()
    const Xpc = pontoCritico(primeiraDerivada, intervalo.intervaloMin, intervalo.intervaloMax) // Exibe o ponto crítico da função da função.
    const MaxMin = MaxeMin(segundaDerivada, Xpc)
    if (MaxMin) {
      MaxMin.minimos.length > 0 ? console.log(`Ponto min: ${MaxMin.minimos}`) : null
      MaxMin.inflexao.length > 0 ? console.log(`Ponto de inflexão: ${MaxMin.inflexao}`) : null
      MaxMin.maximos.length > 0 ? console.log(`Ponto max: ${MaxMin.maximos}`) : null
    }
    const trapezio = numDivisoesIntegral()
    const inicioFim = pontoInicial_e_Final()
    const trap = regradoTrapezio(funcao, inicioFim.inicio, inicioFim.fim, trapezio)
    console.log(`A integral por Trapézio é aproximadamente: ${trap}`)
    const simpson = regradoSimpson(funcao, inicioFim.inicio, inicioFim.fim, trapezio)
    console.log(`A integral por Simpson é aproximadamente: ${simpson}`)
    /*
      console.log(separarFuncao(primeiraDerivada))
      const segundaDerivada = calcularDerivada(primeiraDerivada) // Calcula a segunda derivada da função.
      console.log(`A segunda derivada é: ${segundaDerivada}`) // Exibe a segunda derivada no console.
    */

  }

  main() // Chama a função principal para iniciar o programa.
}

calculadoraDerivadaIntegral() // Chama a função principal da calculadora.
// 2(3e^(2x+3x^2))^5x