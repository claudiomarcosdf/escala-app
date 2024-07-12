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

export { getOnlyDateBr, getDataToFilterFirebase };
