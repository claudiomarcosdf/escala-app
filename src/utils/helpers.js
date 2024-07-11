import moment from 'moment-timezone';

function getOnlyDateBr() {
  let dataBr = moment.tz('America/Sao_Paulo');
  let dataAtual = dataBr.format().substring(0, 10);
  return dataAtual;
}

export { getOnlyDateBr };
