import { createContext, useContext, useState } from 'react';
import { Alert } from 'react-native';
import firebase from '../firebaseConfig';
import { shuffleArray, getOrderedHorario } from '../utils/helpers';
import { AuthContext } from './authContext';

export const EscalaContext = createContext({});

function EscalaProvider({ children }) {
  const [escalaEncontrada, setEscalaEncontrada] = useState(false);
  const [escalas, setEscalas] = useState([]);
  const [loadingEscalas, setLoadingEscalas] = useState(false);
  const [building, setBuilding] = useState(false);
  const [finish, setFinish] = useState(false);

  const { paroquiaconfig } = useContext(AuthContext);

  function getQtdeVagasPorTipoPessoa(tipoPessoa) {
    //obter das confgs do APP
    switch (tipoPessoa) {
      case 'Coroinha':
        return paroquiaconfig ? paroquiaconfig?.qtdeCoroinhasPorHorario : 3;
        break;
      case 'Acólito':
        return paroquiaconfig ? paroquiaconfig?.qtdeAcolitosPorHorario : 2;
        break;
      case 'Cerimoniário':
        return paroquiaconfig ? paroquiaconfig?.qtdeCerimoniariosPorHorario : 2;
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

    console.log(newArrayVagasPreenchidas);
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

    let horariosOrdenados = [];
    embaralhar
      ? (horariosOrdenados = shuffleArray(horarios))
      : (horariosOrdenados = getOrderedHorario(horarios));

    const escalas = [];
    const tiposPessoa = ['Coroinha', 'Acólito', 'Cerimoniário'];

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

    horariosOrdenados.forEach(
      ({ keypessoa, nomepessoa: candidato, tipopessoa, horarios }) => {
        horarios.forEach((horario) => {
          const vagaPreenchidaFinded = vagasPreenchidas.find(
            (vagaHorario) =>
              vagaHorario.horario == horario &&
              vagaHorario.tipopessoa == tipopessoa
          );

          let totalVagasPreenchidasDoHorario =
            vagaPreenchidaFinded.totalPreenchidas;

          const qtdeVagasHorarioPorTipoPessoa =
            getQtdeVagasPorTipoPessoa(tipopessoa);

          if (totalVagasPreenchidasDoHorario < qtdeVagasHorarioPorTipoPessoa) {
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
        });
      }
    ); //end forEach

    for (var i = 0; i < escalas.length; i++) {
      await Promise.all([salvarEscala(escalas[i])]);
    }

    setBuilding(false);
    setFinish(true);
  }

  async function escalarPessoa(novaEscala) {
    //Pode escalar no mesmo dia, EXCETO no mesmo horário
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
        lancarFaltaAtraso
      }}
    >
      {children}
    </EscalaContext.Provider>
  );
}

export default EscalaProvider;
