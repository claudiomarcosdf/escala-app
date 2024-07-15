import moment from 'moment-timezone';

function getOnlyDateBr() {
  //Data do dia
  let dataBr = moment.tz('America/Sao_Paulo');
  let dataAtual = dataBr.format().substring(0, 10);
  return dataAtual;
}

function getDataToFilterFirebase(dataAmericana) {
  let data = dataAmericana ? dataAmericana : getOnlyDateBr(); //2024-07-12
  let year = data.substring(0, 4);
  let month = data.substring(5, 7);
  let day = data.substring(8, 10);

  return day + '/' + month + '/' + year;
}

//Função para embaralhar/randomizar array
function shuffleArray(arr) {
  // Loop em todos os elementos
  for (let i = arr.length - 1; i > 0; i--) {
    // Escolhendo elemento aleatório
    const j = Math.floor(Math.random() * (i + 1));
    // Reposicionando elemento
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  // Retornando array com aleatoriedade
  return arr;
}

export { getOnlyDateBr, getDataToFilterFirebase, shuffleArray };
