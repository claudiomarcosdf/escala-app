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

//Função para embaralhar/randomizar array coroinhas
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

//Função para ordenar o array coroinhas pelo horário
function getOrderedHorario(array) {
  return array.sort((a, b) =>
    a.horario > b.horario ? 1 : b.horario > a.horario ? -1 : 0
  );
}

function getLabelHorario(value) {
  switch (value) {
    case 'AHR':
      return '1º Horário';
    case 'BHR':
      return '2º Horário';
    case 'CHR':
      return '3º Horário';
    case 'DHR':
      return '4º Horário';
    case 'EHR':
      return '5º Horário';
    case 'FHR':
      return '6º Horário';
    case 'GHR':
      return '7º Horário';
    case 'HHR':
      return '8º Horário';
    case 'IHR':
      return '9º Horário';
    case 'JHR':
      return '10º Horário';
    default:
      return 'S/HR';
      break;
  }
}

export {
  getOnlyDateBr,
  getDataToFilterFirebase,
  shuffleArray,
  getLabelHorario,
  getOrderedHorario
};
