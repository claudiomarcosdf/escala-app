import { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';

import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

export default function PrintEscala({ data }) {
  const [selectedPrinter, setSelectedPrinter] = useState();
  const [html, setHtml] = useState();

  useEffect(() => {
    if (data.length != 0) {
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
                font-size: 20px;
              }
              .name{
                width: 300px;
              }
              .hora{
                font-weight: 700
              }
            </style>
          </head>
          <body style="text-align: center;">
              <h1 class="title">Escala do dia ${data && data[0].data}</h1>
              <table style="margin: auto;" class="table">
                <thead>
                  <tr>
                    <th>Horário</th>
                    <th>Coroinha</th>
                    <th>Celular</th>
                  </tr>
                </thead>
                <tbody>
                  ${data.map(
                    (escala) =>
                      `<tr class="list" key=${escala.key}>
                  <td class="hora">${escala.hora}</td>
                  <td style="text-align: left;" class="name">${escala.coroinha}</td>
                  <td style="text-align: left;">${escala.celular}</td>
                  </tr>`
                  )}
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
      <TouchableOpacity style={styles.btnCompartilhar} onPress={print}>
        <Feather name='printer' size={15} color='#2f3640' />
      </TouchableOpacity>
      <TouchableOpacity style={styles.btnCompartilhar} onPress={printToFile}>
        <AntDesign name='sharealt' size={15} color='#2f3640' />
      </TouchableOpacity>
    </>
  );
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
