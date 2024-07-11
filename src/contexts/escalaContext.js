import { useEffect, createContext, useState } from 'react';
import firebase from '../firebaseConfig';

export const EscalaContext = createContext({});

function EscalaProvider({ children }) {
  const [coroinhas, setCoroinhas] = useState([]);
  const [escalaEncontrada, setEscalaEncontrada] = useState(false);
  const [building, setBuilding] = useState(false);
  const [finish, setFinish] = useState(false);

  useEffect(() => {
    async function getDados() {
      setCoroinhas([]);

      await firebase
        .database()
        .ref('coroinhas') //'coroinhas/1'
        .once('value', (snapshot) => {
          snapshot?.forEach((childItem) => {
            let data = {
              key: childItem.key,
              nome: childItem.val().nome,
              celular: childItem.val().celular
            };

            setCoroinhas((oldCoroinhas) => [...oldCoroinhas, data].reverse());
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }

    getDados();
  }, []);

  function montarArrayComVagasEHorarios(horariosDisponiveis) {
    const totalCoroinhas = coroinhas.length;
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

  async function gerarEscala(data, horarios) {
    //Verificar se a escala do dia já foi gerada
    setFinish(false);
    setBuilding(true);
    let existe = await Promise.all([escalaExiste(data)]);

    if (existe[0] == true) {
      alert('A escala para a data informada já foi gerada!');
      setBuilding(false);
      return;
    }

    const vagasHorarios = montarArrayComVagasEHorarios(horarios);
    const escalas = [];
    let vagasHorariosTemp = [...vagasHorarios];

    coroinhas.forEach((coroinha) => {
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
            hora: vagaHorarioFinded.horario
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
  }

  return (
    <EscalaContext.Provider
      value={{ gerarEscala, building, finish, setFinish }}
    >
      {children}
    </EscalaContext.Provider>
  );
}

export default EscalaProvider;