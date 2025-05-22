
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
            case 'e':
                anterior = expr[i - 1]
                if (anterior >= '0' && anterior <= '9' || anterior === ')') {

                    expressaoComValor += '*' + Math.E.toFixed(2);
                } else {

                    expressaoComValor += Math.E.toFixed(2);
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
function pontoCritico(primeiraDerivada, intervalo = { intervaloMin: "-10", intervaloMax: "10" }) {
    if (Number(primeiraDerivada) === 0) return console.log("Ponto crítico indefinido")

    let pontosCriticos = []
    let temCritico = false
    let existe
    // Esse Loop procura a troca de sinal das funções
    let f1, f2
    for (let i = Number(intervalo.intervaloMin); i < Number(intervalo.intervaloMax); i += 0.1) {
        f1 = avaliarExpressao(primeiraDerivada, i)
        f2 = avaliarExpressao(primeiraDerivada, i + 0.1)

        if (Math.abs(f1) < 0.00001) {
            existe = false
            for (let j = 0; j < pontosCriticos.length; j++) {// Verifica se o ponto no intervalo i. ja foi adicionado
                if (Math.abs(pontosCriticos[j] - Number(i.toFixed(4))) < 0.000001) {
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

            while ((fim - ini) > 0.000001) {
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
                if (Math.abs(pontosCriticos[j] - Number(meio.toFixed(4))) < 0.000001) {
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

module.exports = {
    avaliarExpressao,
    pontoCritico,
    MaxeMin
}