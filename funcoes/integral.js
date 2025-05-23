function regradoTrapézio(funcao, a, b, numeroDivisoes){
    let h = (b - a) / numeroDivisoes
    let soma = funcao(a) + funcao(b)
    let resultado = 0

    for(let i = 0; i < numeroDivisoes; i++){
        let x = a + (i * h)
        soma =+ 2 * funcao(x)
    }
    resultado = soma *(h / 2)

    return resultado
}

module.exports = {
    resultado
}