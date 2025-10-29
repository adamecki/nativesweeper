import React from 'react';
import { Alert } from 'react-native';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';

const size = 8; // Size of the board (a * a) [temporary solution]

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.board}>
        <GenBoard />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#60AAFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  board: {
    width: '100%',
    aspectRatio: 1 / 1,
    padding: '5px',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  field: {
    flex: 1,
    aspectRatio: 1 / 1,
    backgroundColor: '#DDDDDD',
    margin: '0.5%',
    boxShadow: '2px 2px teal'
  },
});

function GenBoard() {
  const rows = [];
  const flds = [];

  for (let i = 0; i < size; i++) {
    rows.push(i);
    flds.push(i);
  }

  return (
    <>
      {rows.map((rowNumber) => <View style={styles.row} key={rowNumber}>
        {flds.map((fldNumber) => <TouchableHighlight style={styles.field} onPress={() => {Alert.alert(`x: ${fldNumber}, y: ${rowNumber}`)}} key={fldNumber}><View><Text>{rowNumber}{fldNumber}</Text></View></TouchableHighlight>)}
      </View>)}
    </>
  )
}
