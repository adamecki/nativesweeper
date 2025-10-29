import React, {useState} from 'react';
import { Alert } from 'react-native';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';

const size = 8; // Size of the board (a * a) [temporary solution]
const minesToBePlaced = 10; // Amount of mines to incorporate in the board [temporary solution]
let minesPlaced = 0; // Amount of mines already placed (why is this global?)

class Field {
  constructor(hasMine, isUncovered, minesNear) {
    this.hasMine = hasMine;
    this.isUncovered = isUncovered;
    this.minesNear = minesNear;
  }
};

const board = []; // board containing mine values for the algorithm (backend?)

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
    padding: '3%',
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
    rows.push(i); // Push frontend rows
    flds.push(i); // Push frontend fields

    board.push([]); // Push backend rows
    for (let j = 0; j < size; j++) {
      board[i].push(new Field(false, false, 0)); // Push backend fields
    }
  }

  placeMines(0, 0); // this should be invoked on first uncover

  // console.log(board);

  return (
    <>
      {rows.map((rowNumber) => <View style={styles.row} key={rowNumber}>
        {flds.map((fldNumber) =>
          // <TouchableHighlight style={styles.field} onPress={() => {Alert.alert(`x: ${fldNumber}, y: ${rowNumber}`)}} key={fldNumber}>
          //   <View></View>
          // </TouchableHighlight>

          <View style={styles.field} key={fldNumber}><Text>{board[rowNumber][fldNumber].hasMine ? `*` : `${board[rowNumber][fldNumber].minesNear ? `${board[rowNumber][fldNumber].minesNear}` : `-`}`}</Text></View>
          
          // <FrontField key={fldNumber} />
        )}
      </View>)}
    </>
  )
}

function placeMines(notHereX, notHereY) { // Using the arguments, we want to make sure that the player doesn't start with stepping on a mine (which would be frustrating)
  console.log('Placing mines...');
  console.log(`${minesToBePlaced - minesPlaced} mines left to place.`);

  // 1. Actually place mines
  while(minesPlaced < minesToBePlaced) {
    let rx = Math.floor(Math.random() * size); // Random X coordinate to place mine
    let ry = Math.floor(Math.random() * size); // Random Y coordinate to place mine

    if(!board[ry][rx].hasMine) { // We don't want to overwrite mines with mines, effectively making the amount of placed mines less than expected. Not the most optimal solution in terms of time & robustness, but it works
      board[ry][rx].hasMine = true;
      minesPlaced++;

      console.log(`${minesToBePlaced - minesPlaced} mines left to place.`);
    }
  }

  console.log('Mines placed. Setting up information about nearest mines.');

  // 2. Determine, how many mines are adjacent to each field (ugly nested for-s and if-s but I have no other idea right now)
  for(let x = 0; x < size; x++) {
    for(let y = 0; y < size; y++) {
      for(let nx = -1; nx <= 1; nx++) {
        for(let ny = -1; ny <= 1; ny++) {
          if (x + nx >= 0 && x + nx < size && y + ny >= 0 && y + ny < size) { // Skip incorrect values, like -1 or 8* (* - assuming the board size is 8x8 and we count coordinates from 0)
            if(board[y + ny][x + nx].hasMine) {
              board[y][x].minesNear++;
            }
          }
        }
      }
    }
  }

  console.log('Mines information has been set up.');
}
