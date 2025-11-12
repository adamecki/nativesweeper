import React from 'react';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableHighlight, View, ImageBackground, Image, Pressable } from 'react-native';
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';

import meadowBackground from '../assets/meadow-1x1.jpg';

import MineSvgImage from '../assets/icons/mine';
import FlagSvgImage from '../assets/icons/flag';
import NumberIcon from '../assets/icons/number-icons';
import { appStyleSheet } from '../styles';

let size = 8; // Size of the board (a * a) [temporary solution]
let minesToBePlaced = 10; // Amount of mines to incorporate in the board [temporary solution]

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

// Timer variables
let startTimestamp; // Will be assigned on when gameplay starts
let isCounting = false; // I wonder if it's necessary. I'll Let it be right now.

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
    boxShadow: '2px 2px blue',
  },
  fieldWithMine: {
    flex: 1,
    aspectRatio: 1/1,
    backgroundColor: '#DD0000',
    margin: '0.5%',
    boxShadow: '2px 2px blue',
  }, 
  aContainer: {
    position: 'relative',
  },
  cover: {
    position: 'absolute',
    flex: '1',
    width: '100%',
    aspectRatio: 1 / 1,
    backgroundColor: 'rgba(47, 95, 255, 1)',
  },
  restartcontainer: {
    width: '100%',
    height: '10%',
    padding: '3%',
  }, 
  restartbutton: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgb(47, 95, 255)',
    boxShadow: '2px 2px blue',
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
  const [statePrettyTime, setStatePrettyTime] = useState('0:00');

  const prepareBoard = () => {
    for (let i = 0; i < size; i++) {
      rows.push(i); // Push frontend rows
      flds.push(i); // Push frontend fields

      board.push([]); // Push backend rows
      for (let j = 0; j < size; j++) {
        board[i].push(new Field(false, false, 0, false, 0)); // Push backend fields
      }
    }
  }

  if (!boardDone) {
    prepareBoard();
    boardDone = true;
  }
  
  const anim = board.map((row) => row.map(() => {return useSharedValue('rgba(47, 95, 255, 1)')}));
  
  if(isCounting) {
    setInterval(() => {
      if(isCounting) {
        let seconds = Math.floor((Date.now() - startTimestamp) / 1000);

        if (seconds > 59) {
          setStatePrettyTime(`${Math.floor((seconds - (seconds % 60)) / 60)}:${(seconds % 60) < 10 ? '0' : ''}${seconds % 60}`);
        } else {
          setStatePrettyTime(`0:${seconds < 10 ? '0' : ''}${seconds}`);
        }
      }
    }, 100); // Update every 100 miliseconds in order to prevent timer value lagging
  }

  const handlePress = (x, y) => {
    uncoverField(y, x, statePrettyTime);
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
    setStatePrettyTime('0:00');

    const newFlds = board.map((x) => x.map((y) => y.isUncovered));

    // Animate every field change in anim
    for(let i = 0; i < size; i++) {
      for(let j = 0; j < size; j++) {
        if(!board[i][j].isUncovered) {
          anim[i][j].value = withSpring('rgba(47, 95, 255, 1)');
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
            <Text style={styles.restarttext}>{statePrettyTime}</Text>
          </View>
          :
          <TouchableHighlight style={styles.restartbutton} onPress={() => restartgame()}>
            <Text style={styles.restarttext}>Od nowa</Text>
          </TouchableHighlight>}
      </View>
    </>
  )
}

function placeMines(notHereX, notHereY) { // Using the arguments, we want to make sure that the player doesn't start with stepping on a mine (which would be frustrating)
  // console.log('Placing mines...');
  // console.log(`${minesToBePlaced - minesPlaced} mines left to place.`);

  // 1. Actually place mines
  while(minesPlaced < minesToBePlaced) {
    let rx = Math.floor(Math.random() * size); // Random X coordinate to place mine
    let ry = Math.floor(Math.random() * size); // Random Y coordinate to place mine

    if(board[ry][rx].hasMine == false && ry != notHereY && rx != notHereX) {  // We don't want to overwrite mines with mines, which would make the amount of placed mines less than expected.
                                                                              // Not the most optimal solution in terms of time & robustness, but it works.
                                                                              // This part of code also actually makes sure we don't start with stepping on a mine, using earlier arguments.
      board[ry][rx].hasMine = true;
      minesPlaced++;

      // console.log(`${minesToBePlaced - minesPlaced} mines left to place.`);
    }
  }

  // console.log('Mines placed. Setting up information about nearest mines.');

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

  // console.log('Mines information has been set up.');
}

function uncoverField(x, y, currenttime, original = true) { // Restructurize these nested ifs
if(gameplay) {
  if(!minesConfigured) {
    placeMines(x, y);
    minesConfigured = true;

    // start counting
    startTimestamp = Date.now();
    isCounting = true;
  }

  if(board[y][x].hasMine) { // Lost (optimize this stuff)
    if(!board[y][x].isFlagged) {
      gameplay = false;
      isCounting = false;

      // Uncover the whole board?
      for(let i = 0; i < size; i++) {
        for(let j = 0; j < size; j++) {
          board[i][j].isUncovered = true;
        }
      }

      Alert.alert('Koniec gry', 'Spróbuj ponownie!');
    }
  } else {
    if (original && board[y][x].isUncovered && board[y][x].minesNear == board[y][x].flagsNear && board[y][x].minesNear != 0) {
      board[y][x].flagsNear = 0; // This won't be needed anymore as we have uncovered everything around the field
                                 // But it prevents exceeding the call stack.
      // rebuild them ifs. They can be optimized. Bun dem! wtfffff
      for(let nx = -1; nx <= 1; nx++) {
        for(let ny = -1; ny <= 1; ny++) {
          if(x + nx >= 0 && x + nx < size && y + ny >= 0 && y + ny < size && (nx != 0 || ny != 0)) {
            uncoverField(x + nx, y + ny, currenttime, false);
          }
        }
      }
    }
    if(!board[y][x].isUncovered && !board[y][x].isFlagged) {
      board[y][x].isUncovered = true;
      uncoveredFields++;
      // console.log(uncoveredFields);

      if(uncoveredFields == (size * size) - minesToBePlaced) {
        // Won
        gameplay = false;
        isCounting = false;

        // Uncover the whole board?
        for(let i = 0; i < size; i++) {
          for(let j = 0; j < size; j++) {
            board[i][j].isUncovered = true;
          }
        }

        Alert.alert('Gratulacje!', `Twój czas: ${currenttime}.`); // if it's best, announce it
      } else if(board[y][x].minesNear == 0) {
        for(let nx = -1; nx <= 1; nx++) {
          for(let ny = -1; ny <= 1; ny++) {
            if(x + nx >= 0 && x + nx < size && y + ny >= 0 && y + ny < size) {
              uncoverField(x + nx, y + ny, currenttime);
            }
          }
        }
      }
    }
  }
}}

function flagUnflag(x, y) {
  if(minesConfigured) {
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
}

const ReadyGameView = () => {
  const [isTheLogoCool, setIsTheLogoCool] = useState(0);

  return (
    <View style={appStyleSheet.container}>
      <ImageBackground
        source={meadowBackground} resizeMode='cover' style={appStyleSheet.appBackground}
      >
        <Pressable style={[appStyleSheet.logoContainer, {activeOpacity: 0}]} onPress={() => {
            setIsTheLogoCool(isTheLogoCool + 1)
            if(isTheLogoCool > 8) {
              Alert.alert('Odkryłeś cool logo', 'O kurczaki, logo jest teraz cool!\nSprawdź cooltext.com');
            }
          }}>
          {isTheLogoCool > 9
          ? <Image style={appStyleSheet.logo} source={require('../assets/cool-logo.gif')}/>
          : <Image style={appStyleSheet.logo} source={require('../assets/logo-wide.png')}/>
          }
        </Pressable>
        <GenBoard/>
        <View style={appStyleSheet.logoContainer}></View>
      </ImageBackground>
    </View>
  );
}

export default function gameView() {
  const [isReady, setIsReady] = useState(false);
  const route = useRoute();
  const navigation = useNavigation();

  const loadMode = async() => {
    try {
      let boardSize = Number(await AsyncStorage.getItem("BoardSize"));
      if (isNaN(boardSize)) {
        boardSize = 8;
        try {
          await AsyncStorage.setItem("BoardSize", '8');
        } catch(err_set) {
          alert(err_set);
        }
      }
      size = boardSize;
      minesToBePlaced = Math.floor((size * size) * 0.15625);
      setIsReady(true);
    } catch(err) {
      alert(err);
    }
  }

  useEffect(() => {
    loadMode();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (route.params?.refresh) {
        navigation.setParams({ refresh: undefined });

        board = [];
        rows = [];
        flds = [];
        minesPlaced = 0;
        uncoveredFields = 0;
        minesConfigured = false;
        boardDone = false;
        isCounting = false;
        
        setIsReady(false);
        loadMode();
      }
    }, [route.params?.refresh])
  )

  if(!isReady) {
    return <></>;
  } else {
    return <ReadyGameView/>;
  }
}
