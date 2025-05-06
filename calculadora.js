const prompt = require("prompt-sync")();

function separarFuncao(){
    let termos = [];
    let parenteses = [];
    let termoAtual = "";
    let caractere;
    let funcaoOriginal = obterFuncao()
    
    for(let i = 0; i < funcaoOriginal.length; i++){
      caractere = funcaoOriginal[i];
      if(caractere == 0) { //o zero é para ser na verdade o botão que fica a raiz
        let raiz = Math.sqrt(caractere);
        }
        else if(caractere[i] === '(') {
            if (parenteses.length === 0) {
              termoAtual = i;
            }
            parenteses.push('(');
          } else if (caractere[i] === ')') {
            parenteses.pop();
            if (parenteses.length === 0 && termoAtual !== -1) {
                termos.push(caractere.substring(termoAtual + 1, i));
              termoAtual = -1;
            }
          }
      else if(caractere === '+' || caractere === '-'){
        if(termoAtual.length > 0){
          termos.push(termoAtual);
        }
        termoAtual = caractere;
      }
      else{
      termoAtual = number(termoAtual.concat(caractere));
    }
    termos.push(termoAtual);
    return termos;
  }

function derivada1ordem(f, x, h = 1e-5) {
  return (f(x + h) - f(x - h)) / (2 * h);
}

function derivada2ordem(f, x, h = 1e-5) {
  return (f(x + h) - 2 * f(x) + f(x - h)) / (h * h);
}

function minmax(){
  
}

function ptcritco(){

}

function integral(){

}
}
