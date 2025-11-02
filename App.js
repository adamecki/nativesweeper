import {useState} from 'react';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import Animated, { useSharedValue, withSpring } from 'react-native-reanimarted';

const size = 8; // Size of the board (a * a) [temporary solution]
const minesToBePlaced = 10; // Amount of mines to incorporate in the board [temporary solution]

let minesPlaced = 0; // Amount of mines already placed (why is this global?)
let uncoveredFields = 0; // Subtracted from the size and mines placed to determine whether the game is won

// Additional variables to make sure the game places mines and configures the board only once
let boardDone = false;
let minesConfigured = false; 

// Arrays containing frontend field keys from 0 to n-1, n being size of the board
const rows = [];
const flds = [];

// Field class containing its state: does it contain a mine? Is it already uncovered? How many mines are adjacent to it?
class Field {
  constructor(hasMine, isUncovered, minesNear) {
    this.hasMine = hasMine;
    this.isUncovered = isUncovered;
    this.minesNear = minesNear;
  }
};

const board = []; // board containing mine values for the algorithm (backend?)

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
    boxShadow: '2px 2px teal',
  },
  uncoveredField: {
    flex: 1,
    aspectRatio: 1 / 1,
    backgroundColor: '#808080',
    margin: '0.5%',
    boxShadow: '2px 2px teal',
  },
  aContainer: {
    position: 'relative',
  },
  cover: {
    position: 'absolute',
    flex: '1',
    width: '100%',
    aspectRatio: 1 / 1,
    backgroundColor: 'rgba(0, 0, 255, 0.5)',
  },
  noCover: {
    position: 'absolute',
    flex: '1',
    width: '0%',
    aspectRatio: 1 / 1,
    backgroundColor: 'rgba(0, 0, 255, 0.5)',
  },
});

const GenBoard = () => {
  const [stateIsUncovered, setStateIsUncovered] = useState(board.map((x) => x.map((y) => y.isUncovered)));

  if(!boardDone) {
    prepareBoard();
    boardDone = true;
  }

  const handlePress = (x, y) => {
    uncoverField(y, x);
    const newBoard = board.map((x) => x.map((y) => y.isUncovered));

    setStateIsUncovered(newBoard);
  }

  return (
    <>
      {rows.map((rowNumber) => <View style={styles.row} key={rowNumber}>
        {flds.map((fldNumber) =>
          <TouchableHighlight style={styles.field} onPress={() => handlePress(rowNumber, fldNumber)} key={fldNumber}>
            <View style={styles.aContainer}>
              <>
              <Text>{board[rowNumber][fldNumber].hasMine ? '*' : `${board[rowNumber][fldNumber].minesNear}`}</Text>
              </>
              <Animated.View style={board[rowNumber][fldNumber].isUncovered ? styles.noCover : styles.cover}></Animated.View>
            </View>
          </TouchableHighlight>
        )}
      </View>)}
    </>
  )
}

function prepareBoard() {
  for (let i = 0; i < size; i++) {
    rows.push(i); // Push frontend rows
    flds.push(i); // Push frontend fields

    board.push([]); // Push backend rows
    for (let j = 0; j < size; j++) {
      board[i].push(new Field(false, false, 0)); // Push backend fields
    }
  }
}

function placeMines(notHereX, notHereY) { // Using the arguments, we want to make sure that the player doesn't start with stepping on a mine (which would be frustrating)
  console.log('Placing mines...');
  console.log(`${minesToBePlaced - minesPlaced} mines left to place.`);

  // 1. Actually place mines
  while(minesPlaced < minesToBePlaced) {
    let rx = Math.floor(Math.random() * size); // Random X coordinate to place mine
    let ry = Math.floor(Math.random() * size); // Random Y coordinate to place mine

    if(board[ry][rx].hasMine == false && ry != notHereY && rx != notHereX) {  // We don't want to overwrite mines with mines, which would make the amount of placed mines less than expected.
                                                                              // Not the most optimal solution in terms of time & robustness, but it works.
                                                                              // This part of code also actually makes sure we don't start with stepping on a mine, using earlier arguments.
      board[ry][rx].hasMine = true;
      minesPlaced++;

      console.log(`${minesToBePlaced - minesPlaced} mines left to place.`);
    }
  }

  console.log('Mines placed. Setting up information about nearest mines.');

  // 2. Determine, how many mines are adjacent to each field
  for(let x = 0; x < size; x++) {
    for(let y = 0; y < size; y++) {
      for(let nx = -1; nx <= 1; nx++) {
        for(let ny = -1; ny <= 1; ny++) {
          if (x + nx >= 0 && x + nx < size && y + ny >= 0 && y + ny < size) { // Skip incorrect values, like -1 or n, n being the size of the board
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

function uncoverField(x, y) {
  if(!minesConfigured) {
    placeMines(x, y);
    minesConfigured = true;
  }

  if(board[y][x].hasMine) {
    // Losing game mechanism
  } else {
    if(!board[y][x].isUncovered) {
      board[y][x].isUncovered = true;
      uncoveredFields++;

      if(board[y][x].minesNear == 0) {
        for(let nx = -1; nx <= 1; nx++) {
          for(let ny = -1; ny <= 1; ny++) {
            if(x + nx >= 0 && x + nx < size && y + ny >= 0 && y + ny < size) {
              uncoverField(x + nx, y + ny);
            }
          }
        }
      }
    }
  }
}

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.board}>
        <GenBoard />
      </View>
    </View>
  );
}
