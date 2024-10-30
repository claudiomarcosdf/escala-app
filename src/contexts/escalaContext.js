import { createContext, useContext, useState } from 'react';
import { Alert } from 'react-native';
import firebase from '../firebaseConfig';
import { shuffleArray, transformToDate } from '../utils/helpers';
import { AuthContext } from './authContext';

export const EscalaContext = createContext({});

function EscalaProvider({ children }) {
  const [escalaEncontrada, setEscalaEncontrada] = useState(false);
  const [escalas, setEscalas] = useState([]);
  const [loadingEscalas, setLoadingEscalas] = useState(false);
  const [building, setBuilding] = useState(false);
  const [finish, setFinish] = useState(false);
  const [loading, setLoading] = useState(false);
  const [escalasPessoa, setEscalasPessoa] = useState([]);
  const [escalasRelatorio, setEscalasRelatorio] = useState([]);

  const { paroquiaconfig } = useContext(AuthContext);

  function getQtdeVagasPorTipoPessoa(tipoPessoa) {
    //obter das confgs do APP
    switch (tipoPessoa) {
      case 'Coroinha':
        return paroquiaconfig
          ? parseInt(paroquiaconfig?.qtdeCoroinhasPorHorario)
          : 3;
        break;
      case 'Mesce':
        return paroquiaconfig
          ? parseInt(paroquiaconfig?.qtdeMescesPorHorario)
          : 2;
        break;
      case 'Cerimoniário':
        return paroquiaconfig
          ? parseInt(paroquiaconfig?.qtdeCerimoniariosPorHorario)
          : 2;
        break;
      default:
        break;
    }
  }

  async function getEscalas(data) {
    setLoadingEscalas(true);
    setEscalas([]);
    let escalasTemp = [];

    await firebase
      .database()
      .ref('escalas')
      .orderByChild('data')
      .equalTo(data)
      .once('value', (snapshot) => {
        snapshot?.forEach((childItem) => {
          let data = {
            key: childItem.key,
            data: childItem.val().data,
            hora: childItem.val().hora,
            pessoa: childItem.val().pessoa,
            tipopessoa: childItem.val().tipopessoa,
            falta: childItem.val().falta,
            atraso: childItem.val().atraso
          };

          escalasTemp.push(data);
        });
        setEscalas(
          escalasTemp.sort((a, b) =>
            a.hora > b.hora ? 1 : b.hora > a.hora ? -1 : 0
          )
        );
        setLoadingEscalas(false);
      })
      .catch((err) => {
        setLoadingEscalas(false);
        console.log(err);
      });
  }

  async function excluirEscala(key) {
    await firebase
      .database()
      .ref('escalas')
      .child(key)
      .remove()
      .then(() => {
        const newEscalaList = escalas.filter((item) => item.key !== key);
        setEscalas(newEscalaList);
      });
  }

  async function escalaExiste(data) {
    let retorno = false;
    await firebase
      .database()
      .ref('escalas')
      .orderByChild('data')
      .equalTo(data)
      .once('value')
      .then(function (snapshot) {
        if (snapshot.val() != null) retorno = true;
      });

    return retorno;
  }

  async function salvarEscala(dadosNovaEscala) {
    let escala = firebase.database().ref('escalas');
    let chave = escala.push().key;

    await escala
      .child(chave)
      .set(dadosNovaEscala)
      .then(() => {
        //salvo com sucesso
      });
  }

  function atualizaVagasPreenchidas(tipopessoa, vagasPreenchidasTemp, horario) {
    const newArrayVagasPreenchidas = [...vagasPreenchidasTemp];
    const vagasPreenchidasIndex = newArrayVagasPreenchidas.findIndex(
      (element) =>
        element.horario == horario && element.tipopessoa == tipopessoa
    );

    newArrayVagasPreenchidas[vagasPreenchidasIndex].totalPreenchidas += 1;

    //console.log('Atualização de vagas', newArrayVagasPreenchidas);
    return newArrayVagasPreenchidas;
  }

  /**
   *
   * @param {*} data : 01/01/2087
   * @param {*} horarios : [{data, horarios:[], keypessoa, nomepessoa, tipopessoa}]
   * @param {*} horariosdoDia : ['00:00', '00:00']
   * @param {*} embaralhar : true or false
   * @returns
   */
  async function gerarEscala(data, horariosDoDia, horarios, embaralhar) {
    //Verificar se a escala do dia já foi gerada
    setFinish(false);
    setBuilding(true);
    let existe = await Promise.all([escalaExiste(data)]);

    if (existe[0] == true) {
      Alert.alert('Atenção', 'A escala para a data informada já foi gerada!');
      setBuilding(false);
      return;
    }

    let horariosPessoaOrdenados = [];
    embaralhar
      ? (horariosPessoaOrdenados = shuffleArray(horarios)) //embaralhado
      : (horariosPessoaOrdenados = horarios); //ordem do lançamento

    const escalas = [];
    const tiposPessoa = ['Cerimoniário', 'Coroinha', 'Mesce'];

    let vagasPreenchidas = [];
    tiposPessoa.forEach((tipopessoa) => {
      horariosDoDia.map((horario) => {
        //[{ tipopessoa: '', horario: '', totalPreenchidas: 0}]
        vagasPreenchidas.push({
          tipopessoa,
          horario,
          totalPreenchidas: 0
        });
      });
    });

    horariosDoDia.forEach((hora) => {
      horariosPessoaOrdenados.forEach(
        ({ keypessoa, nomepessoa: candidato, tipopessoa, horarios }) => {
          horarios.forEach((horario) => {
            if (horario == hora) {
              const vagaPreenchidaFinded = vagasPreenchidas.find(
                (vagaHorario) =>
                  vagaHorario.horario == horario &&
                  vagaHorario.tipopessoa == tipopessoa
              );

              let totalVagasPreenchidasDoHorario =
                vagaPreenchidaFinded.totalPreenchidas;

              const qtdeVagasHorarioPorTipoPessoa =
                getQtdeVagasPorTipoPessoa(tipopessoa);

              if (
                totalVagasPreenchidasDoHorario < qtdeVagasHorarioPorTipoPessoa
              ) {
                //incluir pessoa na escala no referido horário
                const newEscala = {
                  keypessoa,
                  pessoa: candidato,
                  tipopessoa,
                  data,
                  hora: horario,
                  atraso: false,
                  falta: false
                };
                escalas.push(newEscala);
                vagasPreenchidas = atualizaVagasPreenchidas(
                  tipopessoa,
                  vagasPreenchidas,
                  horario
                );
              }
            }
          }); //for horarios
        }
      ); //for horariospessoa
    }); //end forEach

    for (var i = 0; i < escalas.length; i++) {
      await Promise.all([salvarEscala(escalas[i])]);
    }

    setBuilding(false);
    setFinish(true);
  }

  async function escalarPessoa(novaEscala) {
    //Pode escalar no mesmo dia, EXCETO no mesmo horário

    console.log(novaEscala);
    setBuilding(true);
    let retorno = [];
    await firebase
      .database()
      .ref('escalas')
      .orderByChild('data')
      .equalTo(novaEscala.data)
      .once('value')
      .then(function (snapshot) {
        if (snapshot.val() != null) retorno = snapshot.val();
      });

    if (retorno.length !== 0) {
      //converte obj em lista
      const escalasList = Object.keys(retorno).map((key) => ({
        id: key,
        ...retorno[key]
      }));
      //busca se pessoa está nas escalas da data e hora informadas
      const encontrouPessoa = escalasList.some(
        (escala) =>
          escala.pessoa == novaEscala.pessoa && escala.hora == novaEscala.hora
      );

      if (encontrouPessoa) {
        Alert.alert('Atenção', 'Pessoa já escalada nesta data e horário!');
        setBuilding(false);
        return false;
      }
    }

    await salvarEscala(novaEscala);
    Alert.alert('Sucesso', 'Pessoa escalada com sucesso!');

    setBuilding(false);
    return true;
  }

  async function lancarFaltaAtraso(escala) {
    await firebase
      .database()
      .ref('escalas')
      .child(escala.key)
      .update({
        ...escala
      })
      .then(() => {
        const escalaIndex = escalas.findIndex(
          (item) => item.key === escala.key
        );
        let escalasClone = escalas;
        escalasClone[escalaIndex].keypessoa = escala.keypessoa;
        escalasClone[escalaIndex].pessoa = escala.pessoa;
        escalasClone[escalaIndex].tipopessoa = escala.tipopessoa;
        escalasClone[escalaIndex].data = escala.data;
        escalasClone[escalaIndex].hora = escala.hora;
        escalasClone[escalaIndex].falta = escala.falta;
        escalasClone[escalaIndex].atraso = escala.atraso;

        setEscalas([...escalasClone]);
      });
  }

  async function getEscalasPessoa(userkey, dataInicioBR) {
    //--> Retorna as escalas da pessoa desde a data de início informada
    setLoading(true);
    setEscalasPessoa([]);
    await firebase
      .database()
      .ref('escalas')
      .orderByChild('keypessoa')
      .equalTo(userkey)
      .once('value', (snapshot) => {
        if (snapshot.val() != null) {
          const escalasPessoa = Object.keys(snapshot.val()).map((key) => ({
            key: key,
            ...snapshot.val()[key]
          }));

          const escalasPessoaFilter = escalasPessoa.filter(
            (objHorario) =>
              transformToDate(objHorario.data) >= transformToDate(dataInicioBR)
          );

          if (escalasPessoaFilter.length != 0) {
            const orderedEscalas = [...escalasPessoaFilter].sort(
              ({ data: a }, { data: b }) => (a > b ? -1 : a < b ? 1 : 0)
            );
            setEscalasPessoa(orderedEscalas);
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  }

  async function getEscalasRelatorio(dataInicioBR, dataFinalBR, tipoPessoa) {
    //--> Retorna as escalas no intervalo de dastas informadas
    setLoading(true);
    setEscalasRelatorio([]);
    await firebase
      .database()
      .ref('escalas')
      .orderByChild('data')
      .startAt(dataInicioBR)
      .endAt(dataFinalBR)
      .once('value', (snapshot) => {
        if (snapshot.val() != null) {
          const escalas = Object.keys(snapshot.val()).map((key) => ({
            key: key,
            ...snapshot.val()[key]
          }));

          let escalasFilter = escalas;

          if (tipoPessoa) {
            escalasFilter = escalas.filter(
              (escala) => escala.tipopessoa == tipoPessoa
            );
          }

          if (escalasFilter.length != 0) {
            const orderedEscalas = [...escalasFilter].sort(
              ({ data: a }, { data: b }) => (a > b ? -1 : a < b ? 1 : 0)
            );
            //console.log(orderedEscalas);
            setEscalasRelatorio(orderedEscalas);
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  }

  return (
    <EscalaContext.Provider
      value={{
        gerarEscala,
        building,
        finish,
        setFinish,
        getEscalas,
        escalas,
        setEscalas,
        loadingEscalas,
        excluirEscala,
        escalarPessoa,
        lancarFaltaAtraso,
        loading,
        getEscalasPessoa,
        escalasPessoa,
        setEscalasPessoa,
        getEscalasRelatorio,
        escalasRelatorio,
        setEscalasRelatorio
      }}
    >
      {children}
    </EscalaContext.Provider>
  );
}

export default EscalaProvider;
