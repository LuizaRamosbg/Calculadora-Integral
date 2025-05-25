const {
    avaliarExpressao
} = require("./ponto_critico")

// Calcula a integral pela regra do trapézio
function regradoTrapezio(funcao, inicial, final, numeroDivisoes){
    let h = (final - inicial) / numeroDivisoes // Calcula o valor de H(a base de x no gráfico)
    let soma = avaliarExpressao(funcao, inicial) + avaliarExpressao(funcao, final) // Calcula a soma do ponto inicial + final
    let resultado = 0

    // Calcula o ponto entre todos os trapézios
    for(let i = 1; i < numeroDivisoes; i++){
        let x = Number(inicial + (i * h))   // Calcula os pontos de cada trapézio
        soma += 2 * avaliarExpressao(funcao, x) // multiplica o calculo dos trapézios por 2 e acumulam eles na variavel soma
    }
    resultado = soma *(h / 2)

    return resultado.toFixed(4)
}

// Calcula a integral pela regra de Simpson
function regradoSimpson(funcao, inicial, final, numeroDivisoes){
    if(numeroDivisoes % 2 !=0) // Checa se o número de divisões é par, se não for, adiciona 1
        numeroDivisoes++
    let h = (final - inicial) / numeroDivisoes  // Calcula o valor de H(a base de x no gráfico)
    let soma = avaliarExpressao(funcao, inicial) + avaliarExpressao(funcao, final) // Calcula a soma do ponto inicial + final
    let resultado = 0

    // Calcula o ponto entre todas as parábolas
    for(let i = 1; i < numeroDivisoes; i++){
        let x = Number(inicial + (i * h))   // Calcula os pontos de cada parábola
        let peso = (i % 2 === 0) ? 2 : 4    // Calcula o peso do número, 2 para impar e 4 para par
        soma += peso * avaliarExpressao(funcao, x) // multiplica o calculo das parábolas pelo peso e acumulam eles na variavel soma
    }
    resultado = soma *(h / 3)

    return resultado.toFixed(4)
}

module.exports = {
    regradoTrapezio,
    regradoSimpson
}