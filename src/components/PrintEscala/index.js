import { useEffect, useState, useContext } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

import AppStyles from '../../appStyles';
import { AuthContext } from '../../contexts/authContext';

export default function PrintEscala({
  data,
  intervalDates,
  heightBottom,
  widthBottom,
  iconSize,
  iconColor
}) {
  const [selectedPrinter, setSelectedPrinter] = useState();
  const [html, setHtml] = useState();
  const [paroquiaconfigDefault, setParoquiaConfigDefault] = useState({
    nome: 'NOME DA PARÓQUIA',
    endereco: 'Endereço da Paróquia'
  });
  const { paroquiaconfig } = useContext(AuthContext);

  function getTdData(data) {
    return intervalDates ? `<td class="hora">${data}</td>` : '';
  }

  useEffect(() => {
    if (data.length != 0) {
      let subtitulo = `Escala de ajudantes do dia ${data && data[0].data}`;
      let thData = '';

      //significa que é requisição do relatório
      if (intervalDates) {
        subtitulo = `Escala de ajudantes do dia ${intervalDates}`;
        thData = '<th>Data</th>';
      }

      const html = `
        <!DOCTYPE html>
        <html lang="pt-br">
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0,         maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
            <title>Escala de Coroinhas</title>
            <style>
              body{
              font-family: Arial;
              }
              .table, th, td{
                  border-collapse:collapse;
                  padding: 10px;
                  text-align: center;
                  border: 1px solid rgb(160 160 160);
              }th{
                  font-size: 14px;
                  background-color: lightgray;
              }
              .datatable{
                  border-collapse:collapse;
                  padding: 10px;
                  text-align: left;
                  border: 1px solid rgb(160 160 160);
              }
              .title{
                font-size: 30px;
                font-weight: 700;
                margin-bottom: 0px;
              }
              .subtitle{
                margin-top: 0px;
                font-size: 18px;
                font-style: italic;
              },
              .name{
                width: 300px;
              }
              .hora{
                font-weight: 700
              }
            </style>
          </head>
          <body style="text-align: center;">
              <span class="title">${
                paroquiaconfig
                  ? paroquiaconfig.nome
                  : paroquiaconfigDefault.nome
              }</span><br />
              <span class="subtitle">${
                paroquiaconfig
                  ? paroquiaconfig.endereco
                  : paroquiaconfigDefault.endereco
              }</span>
              <h3>${subtitulo}</h3>
              <br />
              <table style="margin: auto;" class="table">
                <thead>
                  <tr>
                    ${thData}
                    <th>Horário</th>
                    <th>Pessoa</th>
                    <th>Função</th>
                    <th>Atraso</th>
                    <th>Falta</th>
                  </tr>
                </thead>
                <tbody>
                  ${data
                    .map(
                      (escala) =>
                        `<tr class="list" key=${escala.key}>
                      ${getTdData(escala.data)}
                      <td class="hora">${escala.hora}</td>
                  <td style="text-align: left;" class="name">${
                    escala.pessoa
                  }</td>
                  <td style="text-align: left;">${escala.tipopessoa}</td>
                  <td style="text-align: left;">${getDescricao(
                    escala.atraso
                  )}</td>
                  <td style="text-align: left;">${getDescricao(
                    escala.falta
                  )}</td>
                  </tr>`
                    )
                    .join('')}
                </tbody>
              </table>
          </body>
        </html>
      `;

      setHtml(html);
    }
  }, [data]);

  async function print() {
    if (data.length == 0) return;

    await Print.printAsync({
      html,
      printerUrl: selectedPrinter?.url //iOS
    });
  }

  async function printToFile() {
    if (data.length == 0) return;

    const { uri } = await Print.printToFileAsync({ html });
    console.log('Arquivo salvo em: ', uri);
    await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
  }

  async function selectPrinter() {
    const printer = await Print.selecPrinterAsync(); //iOS
    setSelectedPrinter(printer);
  }

  return (
    <>
      <TouchableOpacity
        style={[
          styles.btnCompartilhar,
          { height: heightBottom, width: widthBottom }
        ]}
        onPress={print}
      >
        <Feather
          name='printer'
          size={iconSize}
          color={iconColor ? iconColor : AppStyles.color.primary}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.btnCompartilhar,
          { height: heightBottom, width: widthBottom }
        ]}
        onPress={printToFile}
      >
        <AntDesign
          name='sharealt'
          size={iconSize}
          color={iconColor ? iconColor : AppStyles.color.primary}
        />
      </TouchableOpacity>
    </>
  );
}

function getDescricao(value) {
  return value ? 'Sim' : '';
}

const styles = StyleSheet.create({
  btnCompartilhar: {
    marginLeft: 0,
    alignItems: 'center',
    justifyContent: 'center',
    height: 25,
    width: 25,
    paddingHorizontal: 0,
    borderRadius: 50
  }
});
