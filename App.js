import {useState} from 'react';
import { Alert, StyleSheet, Text, TouchableHighlight, View, Button, ImageBackground } from 'react-native';
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';

import meadowBackground from "./assets/meadow-1x1.jpg";

import MineSvgImage from './assets/icons/mine';
import FlagSvgImage from './assets/icons/flag';
import NumberIcon from './assets/icons/number-icons';

const size = 8; // Size of the board (a * a) [temporary solution]
const minesToBePlaced = 10; // Amount of mines to incorporate in the board [temporary solution]

let minesPlaced = 0; // Amount of mines already placed (why is this global?)
let uncoveredFields = 0; // Subtracted from the size and mines placed to determine whether the game is won

// Additional variables to make sure the game places mines and configures the board only once
let boardDone = false;
let minesConfigured = false; 
let gameplay = true; // Variable that makes sure no game functions are being run when game's over

// Arrays containing frontend field keys from 0 to n-1, n being size of the board
let rows = [];
let flds = [];

let board = []; // board containing mine values for the algorithm (backend?)

// Field class containing its state: does it contain a mine? Is it already uncovered? How many mines are adjacent to it?
class Field {
  constructor(hasMine, isUncovered, minesNear, isFlagged, flagsNear) {
    this.hasMine = hasMine;
    this.isUncovered = isUncovered;
    this.minesNear = minesNear;
    this.isFlagged = isFlagged;
    this.flagsNear = flagsNear;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    backgroundColor: '#EEEEEE',
    margin: '0.5%',
    boxShadow: '2px 2px darkgreen',
  },
  fieldWithMine: {
    flex: 1,
    aspectRatio: 1/1,
    backgroundColor: '#DD0000',
    margin: '0.5%',
    boxShadow: '2px 2px darkgreen',
  }, 
  aContainer: {
    position: 'relative',
  },
  cover: {
    position: 'absolute',
    flex: '1',
    width: '100%',
    aspectRatio: 1 / 1,
    backgroundColor: 'rgba(0, 0, 255, 1)',
  },
  image: {
    height: '100%',
    width: '100%',
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  restartcontainer: {
    width: '100%',
    height: '10%',
    padding: '3%',
  }, 
  restartbutton: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgb(0, 0, 255)',
    boxShadow: '2px 2px darkgreen',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  restarttext: {
    color: 'white',
    fontSize: 28,
  },
});

const GenBoard = () => {
  const [stateIsUncovered, setStateIsUncovered] = useState(board.map((x) => x.map((y) => y.isUncovered)));
  const [stateIsFlagged, setStateIsFlagged] = useState(board.map((x) => x.map((y) => y.isFlagged)));

  if(!boardDone) {
    prepareBoard();
    boardDone = true;
  }
  
  const anim = board.map((row) => row.map(() => {return useSharedValue('rgba(0, 0, 255, 1)')})); // Tak jakby działa?

  const handlePress = (x, y) => {
    uncoverField(y, x);
    const newBoard = board.map((x) => x.map((y) => y.isUncovered));

    // Animate every field change in anim
    for(let i = 0; i < size; i++) {
      for(let j = 0; j < size; j++) {
        if(board[i][j].isUncovered) {
          anim[i][j].value = withSpring('rgba(0, 0, 255, 0)');
        }
      }
    }

    setStateIsUncovered(newBoard);
  }

  const restartgame = () => {
    // Reset counters
    
    board = [];
    rows = [];
    flds = [];
    minesPlaced = 0;
    uncoveredFields = 0;
    prepareBoard();
    minesConfigured = false;

    gameplay = true;

    const newFlds = board.map((x) => x.map((y) => y.isUncovered));

    // Animate every field change in anim
    for(let i = 0; i < size; i++) {
      for(let j = 0; j < size; j++) {
        if(!board[i][j].isUncovered) {
          anim[i][j].value = withSpring('rgba(0, 0, 255, 1)');
        }
      }
    }

    setStateIsUncovered(newFlds);

    const newFlags = board.map((x) => x.map((y) => y.isFlagged));

    setStateIsFlagged(newFlags);
  }

  const handleLongPress = (x, y) => { // flag/unflag field
    flagUnflag(y, x);
    const newBoard = board.map((x) => x.map((y) => y.isFlagged));

    setStateIsFlagged(newBoard);
  }

  return (
    <>
      <View style={styles.board}>
      {rows.map((rowNumber) => <View style={styles.row} key={rowNumber}>
        {flds.map((fldNumber) =>
          <TouchableHighlight style={board[rowNumber][fldNumber].hasMine ? styles.fieldWithMine : styles.field}
            onPress={() => handlePress(rowNumber, fldNumber)}
            onLongPress={() => handleLongPress(rowNumber, fldNumber)}
            key={fldNumber}>
            <View style={styles.aContainer}>
              <>
              <Text>
                {board[rowNumber][fldNumber].hasMine ?
                  MineSvgImage()
                :
                  board[rowNumber][fldNumber].minesNear == 0 ?
                  '' : board[rowNumber][fldNumber].isUncovered ? 
                        NumberIcon(null, board[rowNumber][fldNumber].minesNear) : ''
                }
              </Text>
              </>
              <Animated.View style={[styles.cover, {backgroundColor: anim[rowNumber][fldNumber]}]}>
                <Text>
                  {board[rowNumber][fldNumber].isFlagged ?
                    FlagSvgImage() : ''
                  }
                </Text>
              </Animated.View>
            </View>
          </TouchableHighlight>
        )}
      </View>)}
      </View>
      <View style={styles.restartcontainer}>
        {gameplay ?
          <View style={styles.restartbutton}>
            <Text style={styles.restarttext}>0:00</Text>
          </View>
          :
          <TouchableHighlight style={styles.restartbutton} onPress={() => restartgame()}>
            <Text style={styles.restarttext}>Restart</Text>
          </TouchableHighlight>}
      </View>
    </>
  )
}

function prepareBoard() {
  for (let i = 0; i < size; i++) {
    rows.push(i); // Push frontend rows
    flds.push(i); // Push frontend fields

    board.push([]); // Push backend rows
    for (let j = 0; j < size; j++) {
      board[i].push(new Field(false, false, 0, false, 0)); // Push backend fields
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

function uncoverField(x, y, original = true) { // Restructurize these nested ifs
if(gameplay) {
  if(!minesConfigured) {
    placeMines(x, y);
    minesConfigured = true;
  }

  if(board[y][x].hasMine) { // Lost (optimize this stuff)
    if(!board[y][x].isFlagged) {
      gameplay = false;

      // Uncover the whole board?
      for(let i = 0; i < size; i++) {
        for(let j = 0; j < size; j++) {
          board[i][j].isUncovered = true;
        }
      }

      Alert.alert('Game over', 'Placeholder message');
    }
  } else {
    if (original && board[y][x].isUncovered && board[y][x].minesNear == board[y][x].flagsNear && board[y][x].minesNear != 0) {
      board[y][x].flagsNear = 0; // This won't be needed anymore as we have uncovered everything around the field
                                 // But it prevents exceeding the call stack.
      // rebuild them ifs. They can be optimized. Bun dem! wtfffff
      for(let nx = -1; nx <= 1; nx++) {
        for(let ny = -1; ny <= 1; ny++) {
          if(x + nx >= 0 && x + nx < size && y + ny >= 0 && y + ny < size && (nx != 0 || ny != 0)) {
            uncoverField(x + nx, y + ny, false);
          }
        }
      }
    }
    if(!board[y][x].isUncovered && !board[y][x].isFlagged) {
      board[y][x].isUncovered = true;
      uncoveredFields++;
      console.log(uncoveredFields);

      if(uncoveredFields == (size * size) - minesToBePlaced) {
        // Won
        gameplay = false;

        // Uncover the whole board?
        for(let i = 0; i < size; i++) {
          for(let j = 0; j < size; j++) {
            board[i][j].isUncovered = true;
          }
        }

        Alert.alert('Congrats', 'Placeholder message');
      } else if(board[y][x].minesNear == 0) {
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
}

function flagUnflag(x, y) {
  if(!board[y][x].isUncovered) {
    board[y][x].isFlagged = !board[y][x].isFlagged;

    for(let nx = -1; nx <= 1; nx++) {
      for(let ny = -1; ny <= 1; ny++) {
          if(x + nx >= 0 && x + nx < size && y + ny >= 0 && y + ny < size && (nx != 0 || ny != 0)) {
            if (board[y][x].isFlagged) { // add a flagnear
              board[y+ny][x+nx].flagsNear += 1;
            } else { //subtract a flagnear
              board[y+ny][x+nx].flagsNear -= 1;
            }
          }
      }
    }
  }
}

export default function App() {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={meadowBackground} resizeMode='cover' style={styles.image}
      >
        <GenBoard/>
      </ImageBackground>
    </View>
  );
}
