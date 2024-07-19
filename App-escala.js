import { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Button } from 'react-native';
import Login from './src/components/Login';

// Função para randomizar array
// function shuffleArray(arr) {
//   // Loop em todos os elementos
// for (let i = arr.length - 1; i > 0; i--) {
//       // Escolhendo elemento aleatório
//   const j = Math.floor(Math.random() * (i + 1));
//   // Reposicionando elemento
//   [arr[i], arr[j]] = [arr[j], arr[i]];
// }
// // Retornando array com aleatoriedade
// return arr;
// }
// var arrA = [1, 2, 3, 4, 5];
// console.log(shuffleArray(arrA)); // [4, 2, 1, 5, 3]
// console.log(shuffleArray(arrA)); // [5, 3, 4, 2, 1]
// console.log(shuffleArray(arrA)); // [5, 1, 3, 4, 2]

const pessoas = [
  { nome: 'CLAUDIO', celular: '99976-3779' },
  { nome: 'ALE', celular: '99935-9982' },
  { nome: 'NATHAN', celular: '99988-4455' },
  { nome: 'THIAGO', celular: '99944-1177' },
  { nome: 'LETÍCIA', celular: '99933-1172' },
  { nome: 'WASHINGTON', celular: '99955-0001' },
  { nome: 'JOÃO', celular: '99909-1199' },
  { nome: 'MARCELA', celular: '99976-1111' },
  { nome: 'ANA FELIPA', celular: '98979-9900' }
];

export default function escalaapp() {
  const [user, setUuser] = useState('Claudio');
  const [horariosDisponiveis, setHorariosDisponiveis] = useState([
    '09:00',
    '11:00',
    '17:00',
    '19:00'
  ]);
  const [vagasHorarios, setVagasHorarios] = useState([]);
  const [concluido, setConcluido] = useState(false);
  const [escala, setEscala] = useState([]);

  // useMemo(() => {

  // }, vagasHorarios)

  useEffect(() => {
    montarArrayComVagasEHorarios();
  }, []);

  useEffect(() => {
    //atualizar o array com a SOBRA de pessoas
    if (concluido) atualizarArrayDeVagasEHorariosComSobras();
  }, [concluido]);

  if (!user) {
    return <Login />;
  }

  function montarArrayComVagasEHorarios() {
    const totalPessoas = pessoas.length;
    const qtdHorariosDisponiveis = horariosDisponiveis.length;
    const pessoasPorHorario = Math.floor(totalPessoas / qtdHorariosDisponiveis); //parte inteira
    const sobraPessoas = totalPessoas % qtdHorariosDisponiveis; //ini

    //montar o array vagasHorarios
    for (var i = 0; i < qtdHorariosDisponiveis; i++) {
      const itemVagaHorario = {
        horario: horariosDisponiveis[i],
        vagas: pessoasPorHorario
      };
      setVagasHorarios((oldItem) => [...oldItem, itemVagaHorario]);
    }

    setConcluido(true);
  }

  function atualizarArrayDeVagasEHorariosComSobras() {
    setConcluido(false);

    const totalPessoas = pessoas.length;
    const qtdHorariosDisponiveis = horariosDisponiveis.length;
    const pessoasPorHorario = Math.floor(totalPessoas / qtdHorariosDisponiveis); //parte inteira
    const sobraPessoas = totalPessoas % qtdHorariosDisponiveis;

    if (vagasHorarios.length !== 0) {
      adicionaVagasRestantes(sobraPessoas);
    }
  }

  function adicionaVagasRestantes(sobraPessoas) {
    const newArrayVagasHorarios = [...vagasHorarios];

    for (var i = 0; i < sobraPessoas; i++) {
      newArrayVagasHorarios[i].vagas = newArrayVagasHorarios[i].vagas + 1;
    }
    setVagasHorarios(newArrayVagasHorarios);
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

  function escalar() {
    let vagasHorariosTemp = [...vagasHorarios];

    pessoas.forEach((pessoa) => {
      let pessoaJaEscalada = false;

      horariosDisponiveis.forEach((horario) => {
        //
        const vagaHorarioFinded = vagasHorariosTemp.find(
          (vagaHorario) => vagaHorario.horario == horario
        );
        if (!vagaHorarioFinded) return;

        if (vagaHorarioFinded.vagas > 0 && !pessoaJaEscalada) {
          //incluir pessoa na escala no referido horário
          const newEscala = {
            coroinha: pessoa.nome,
            celular: pessoa.celular,
            data: '',
            hora: vagaHorarioFinded.horario
          };

          setEscala((oldEscala) => [...oldEscala, newEscala]);
          // const temVagaIndexOf = vagasHorarios.findIndex(
          //   (item) => item.horario == horario
          // );

          vagasHorariosTemp = subtraiVaga(
            vagasHorariosTemp,
            vagaHorarioFinded.horario
          );
          pessoaJaEscalada = true;
        }
      });
    }); //end forEach
    console.log(vagasHorariosTemp);
  }

  function onClickButton() {
    setEscala([]);
    escalar();
    //console.log(vagaHorarioToFind);
  }

  console.log(vagasHorarios);
  console.log(escala);
  return (
    <SafeAreaView style={styles.container}>
      <Text>HOME</Text>
      <Button title='Gerar escala' onPress={onClickButton} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 35,
    paddingHorizontal: 10,
    backgroundColor: '#F2f6fc'
  }
});
