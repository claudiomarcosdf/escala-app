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

function getAmericanDate(dataBrasil) {
  //31/07/2024
  let day = dataBrasil.substring(0, 2);
  let month = dataBrasil.substring(3, 5);
  let year = dataBrasil.substring(6, 10);

  return year + '-' + month + '-' + day;
}

function getFullDateBR(dataBR) {
  //sabado, 01 de janeiro de 2087
  const dateString = getAmericanDate(dataBR);
  const date = new Date(dateString);

  return date.toLocaleString('pt-BR', {
    dateStyle: 'full'
  });
}

//Função para embaralhar/randomizar array pessoas
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

//Função não utilizada
function getOrderedHorario(array) {
  return array.sort((a, b) =>
    a.horario > b.horario ? 1 : b.horario > a.horario ? -1 : 0
  );
}

function getStatus(value) {
  return value ? 'Ativo' : 'Inativo';
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

function capitalizeFullName(value) {
  var splitStr = value.toLowerCase().split(' ');
  for (var i = 0; i < splitStr.length; i++) {
    splitStr[i] =
      splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  return splitStr.join(' ');
}

function getNomeSobrenome(value) {
  const fullUsername = capitalizeFullName(value);

  if (fullUsername.length <= 24) return fullUsername;

  const userNameArray = fullUsername.split(' ');
  const lastName =
    userNameArray.length > 1 ? userNameArray[userNameArray.length - 1] : '';
  return userNameArray[0] + ' ' + lastName;
}

export {
  getOnlyDateBr,
  getDataToFilterFirebase,
  shuffleArray,
  getLabelHorario,
  getOrderedHorario,
  getAmericanDate,
  getFullDateBR,
  getStatus,
  getNomeSobrenome
};
