import { createContext, useContext, useState } from 'react';
import { Alert } from 'react-native';
import firebase from '../firebaseConfig';
import { shuffleArray, getOrderedHorario } from '../utils/helpers';
import { CoroinhaContext } from './coroinhaContext';

export const EscalaContext = createContext({});

function EscalaProvider({ children }) {
  const [coroinhasSelecionados, setCoroinhasSelecionados] = useState([]);
  const [escalaEncontrada, setEscalaEncontrada] = useState(false);
  const [escalas, setEscalas] = useState([]);
  const [loadingEscalas, setLoadingEscalas] = useState(false);
  const [building, setBuilding] = useState(false);
  const [finish, setFinish] = useState(false);

  const { coroinhas } = useContext(CoroinhaContext);

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
            coroinha: childItem.val().coroinha,
            celular: childItem.val().celular,
            falta: childItem.val().falta,
            atraso: childItem.val().atraso
          };

          escalasTemp.push(data);
          //setEscalas((oldEscalas) => [...oldEscalas, data]);
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

  function montarArrayComVagasEHorarios(horariosDisponiveis) {
    const totalCoroinhas = coroinhasSelecionados.length;
    const qtdHorariosDisponiveis = horariosDisponiveis.length;
    const coroinhasPorHorario = Math.floor(
      totalCoroinhas / qtdHorariosDisponiveis
    ); //parte inteira
    const sobraCoroinhas = totalCoroinhas % qtdHorariosDisponiveis;

    //montar o array vagasHorarios
    const vagasHorarios = [];
    for (var i = 0; i < qtdHorariosDisponiveis; i++) {
      const itemVagaHorario = {
        horario: horariosDisponiveis[i],
        vagas: coroinhasPorHorario
      };
      vagasHorarios.push(itemVagaHorario);
    }

    if (vagasHorarios.length !== 0) {
      const newArrayVagasHorarios = [...vagasHorarios];

      for (var i = 0; i < sobraCoroinhas; i++) {
        newArrayVagasHorarios[i].vagas = newArrayVagasHorarios[i].vagas + 1;
      }
      return newArrayVagasHorarios;
    }

    return vagasHorarios;
  }

  function subtraiVaga(vagasHorariosTemp, horario) {
    const newArrayVagasHorarios = [...vagasHorariosTemp];
    const arrayVagasHorariosUpdated = newArrayVagasHorarios.map(
      (vagaHorarioObj) => {
        if (vagaHorarioObj.horario == horario && vagaHorarioObj.vagas > 0) {
          return {
            horario: vagaHorarioObj.horario,
            vagas: vagaHorarioObj.vagas - 1
          };
        }
        return { ...vagaHorarioObj };
      }
    );

    return arrayVagasHorariosUpdated;
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

  async function gerarEscala(data, horarios, embaralhar) {
    //Verificar se a escala do dia já foi gerada
    setFinish(false);
    setBuilding(true);
    let existe = await Promise.all([escalaExiste(data)]);

    if (existe[0] == true) {
      Alert.alert('Atenção', 'A escala para a data informada já foi gerada!');
      setBuilding(false);
      return;
    }

    let coroinhasOrdenados = [];
    embaralhar
      ? (coroinhasOrdenados = shuffleArray(coroinhasSelecionados))
      : (coroinhasOrdenados = getOrderedHorario(coroinhasSelecionados));

    const vagasHorarios = montarArrayComVagasEHorarios(horarios);
    const escalas = [];
    let vagasHorariosTemp = [...vagasHorarios];

    coroinhasOrdenados.forEach((coroinha) => {
      let coroinhaJaEscalado = false;

      horarios.forEach((horario) => {
        const vagaHorarioFinded = vagasHorariosTemp.find(
          (vagaHorario) => vagaHorario.horario == horario
        );
        if (!vagaHorarioFinded) return;

        if (vagaHorarioFinded.vagas > 0 && !coroinhaJaEscalado) {
          //incluir coroinha na escala no referido horário
          const newEscala = {
            coroinha: coroinha.nome,
            celular: coroinha.celular,
            data: data,
            hora: vagaHorarioFinded.horario,
            atraso: false,
            falta: false
          };

          escalas.push(newEscala);
          vagasHorariosTemp = subtraiVaga(
            vagasHorariosTemp,
            vagaHorarioFinded.horario
          );
          coroinhaJaEscalado = true;
        }
      });
    }); //end forEach

    for (var i = 0; i < escalas.length; i++) {
      await Promise.all([salvarEscala(escalas[i])]);
      //await salvarEscala(escalas[i]);
    }

    setBuilding(false);
    setFinish(true);
    listaCoroinhasUnchecked();
  }

  function listaCoroinhasUnchecked() {
    setCoroinhasSelecionados([]);
    if (coroinhas && coroinhas?.length != 0) {
      const listSelected = coroinhas.map((coroinha) => {
        return {
          key: coroinha.key,
          nome: coroinha.nome,
          celular: coroinha.celular,
          horario: coroinha.horario,
          checked: false
        };
      });

      const coroinhasOrdenados = getOrderedHorario(listSelected);
      setCoroinhasSelecionados(coroinhasOrdenados);
    }
  }

  async function escalarCoroinha(novaEscala) {
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
      //busca se coroinha está nas escalas da data e hora informadas
      const encontrouCoroinha = escalasList.some(
        (escala) =>
          escala.coroinha == novaEscala.coroinha &&
          escala.hora == novaEscala.hora
      );

      if (encontrouCoroinha) {
        Alert.alert(
          'Atenção',
          'O coroinha já está escalado nesta data e horário!'
        );
        setBuilding(false);
        return false;
      }
    }

    await salvarEscala(novaEscala);
    Alert.alert('Sucesso', 'O coroinha escalado com sucesso!');

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
        escalasClone[escalaIndex].coroinha = escala.coroinha;
        escalasClone[escalaIndex].celular = escala.celular;
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
        escalarCoroinha,
        coroinhasSelecionados,
        setCoroinhasSelecionados,
        listaCoroinhasUnchecked,
        lancarFaltaAtraso
      }}
    >
      {children}
    </EscalaContext.Provider>
  );
}

export default EscalaProvider;
