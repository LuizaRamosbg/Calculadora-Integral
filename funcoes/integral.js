const {
    avaliarExpressao
} = require("./ponto_critico")

function regradoTrapezio(funcao, inicial, final, numeroDivisoes){
    let h = (final - inicial) / numeroDivisoes
    let soma = avaliarExpressao(funcao, inicial) + avaliarExpressao(funcao, final)
    let resultado = 0

    for(let i = 1; i < numeroDivisoes; i++){
        let x = Number(inicial + (i * h))
        soma += 2 * avaliarExpressao(funcao, x)
    }
    resultado = soma *(h / 2)

    return resultado.toFixed(4)
}

function regradoSimpson(funcao, inicial, final, numeroDivisoes){
    if(numeroDivisoes % 2 !=0)
        numeroDivisoes += 1
    let h = (final - inicial) / numeroDivisoes
    let soma = avaliarExpressao(funcao, inicial) + avaliarExpressao(funcao, final)
    let resultado = 0

    for(let i = 1; i < numeroDivisoes; i++){
        let x = Number(inicial + (i * h))
        let peso = (i % 2 === 0) ? 2 : 4
        soma += peso * avaliarExpressao(funcao, x)
    }
    resultado = soma *(h / 3)

    return resultado.toFixed(4)
}

module.exports = {
    regradoTrapezio,
    regradoSimpson
}