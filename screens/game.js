// Libraries
import React, { useEffect, useState } from 'react';
import { Alert, Text, TouchableHighlight, View, ImageBackground, Image, Pressable } from 'react-native';
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';

// Assets
import meadowBackground from '../assets/meadow-1x1.jpg';
import MineSvgImage from '../assets/icons/mine';
import FlagSvgImage from '../assets/icons/flag';
import NumberIcon from '../assets/icons/number-icons';
import { appStyleSheet } from '../styles';

// Game variables
let size = 8;                 // Board dimensions (n*n), defaults to 8
let minesToBePlaced = 10;     // Number of mines on the board (around 16%), defaults to 10
let uncoveredFields = 0;      // Subtracted from the size and mines placed to determine whether the game is won
let boardDone = false;        // Prepare board's backend only once a screen load
let minesConfigured = false;  // Place mines only at the first move
let gameplay = true;          // Variable that makes sure no game functions are being run when game's over

// Field properties array
let board = [];

// Component keys
let rows = [];
let flds = [];

// Timer
let startTimestamp;           // Will be assigned when gameplay starts
let isCounting = false;

// Field class with properties for each field
class Field {
  constructor(hasMine, isUncovered, minesNear, isFlagged, flagsNear) {
    this.hasMine = hasMine;
    this.isUncovered = isUncovered;
    this.minesNear = minesNear;
    this.isFlagged = isFlagged;
    this.flagsNear = flagsNear;
  }
};

// Game functionality
function prepareBoard() {
  for(let i = 0; i < size; i++) {
    rows.push(i);
    flds.push(i);

    board.push([]);
    for(let j = 0; j < size; j++) {
      board[i].push(new Field(false, false, 0, false, 0));
    }
  }
}

function placeMines(avoidX, avoidY) { // Using the arguments, we want to make sure that the player doesn't start with stepping on a mine (which would be frustrating)
  let minesPlaced = 0;
  
  // 1. Place mines
  while(minesPlaced < minesToBePlaced) {
    let rx = Math.floor(Math.random() * size); // Random X coordinate to place mine
    let ry = Math.floor(Math.random() * size); // Random Y ...

    // We don't want to overwrite mines with mines, which would make the amount of placed mines effectively less than expected.
    // Not the most optimal solution in terms of time & robustness, but it works.
    // This part of code also makes sure we don't start with stepping on a mine, using function's arguments.
    // (Also we don't want to impact the randomness)
    if(board[ry][rx].hasMine == false && ry != avoidY && rx != avoidX) {  
      board[ry][rx].hasMine = true;
      minesPlaced++;
    }
  }

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
}

function uncoverField(x, y, currenttime, original = false) {
  // currenttime - we pass the time value to alert the player if the uncovering is final & winning
  // original    - makes sure that if already uncovered fields (these with a number and a right amount of flags near)
  //               are called by this function, adjacent ones don't get uncovered (that one must be done by hand).
  //               Defaults to false, as more calls are done automatically in the code.

  if(gameplay) { // Don't let Player mess with the board after the game is finished!
    if(!minesConfigured) { // Check if it's the first move
      placeMines(x, y);
      minesConfigured = true;

      // Start counting time
      startTimestamp = Date.now();
      isCounting = true;
    }

    if(!board[y][x].isFlagged) { // Flagged fields are untouchable
      // Case 1: losing the game. Check if Player stepped on a mine
      if(board[y][x].hasMine) {
        gameplay = false;
        isCounting = false;

        // Show the entire board
        for(let i = 0; i < size; i++) {
          for(let j = 0; j < size; j++) {
            board[i][j].isUncovered = true;
          }
        }

        Alert.alert('Koniec gry', 'Spróbuj ponownie!');
      } else { 
        // Case 2: Pressing an uncovered field without a mine
        if(!board[y][x].isUncovered) {
          board[y][x].isUncovered = true;
          uncoveredFields++;

          // Case 2a: Uncovering the last empty field, thus winning the game
          if(uncoveredFields == (size * size) - minesToBePlaced) {
            
            gameplay = false;
            isCounting = false;

            // Show the entire board
            for(let i = 0; i < size; i++) {
              for(let j = 0; j < size; j++) {
                board[i][j].isUncovered = true;
              }
            }

            Alert.alert('Gratulacje!', `Twój czas: ${currenttime}.`);
          } else if(board[y][x].minesNear == 0) {
            // Case 2b: Uncovering a field that has no adjacent mines, thus uncovering the surrounding fields
            for(let nx = -1; nx <= 1; nx++) {
              for(let ny = -1; ny <= 1; ny++) {
                if(x + nx >= 0 && x + nx < size && y + ny >= 0 && y + ny < size) {
                  uncoverField(x + nx, y + ny, currenttime);
                }
              }
            }
          }
        }

        if (original && board[y][x].isUncovered && board[y][x].minesNear == board[y][x].flagsNear && board[y][x].minesNear != 0) {
          // Case 3: Pressing field with a number, when there is right amount of flags around

          // Zeroing the flagsNear value prevents exceeding the callstack (adjacent uncovered fields would call each other's uncover function into infinity)
          // Also it's not needed anymore as adjacent fields already get uncovered, we can't uncover anything anymore from this field
          board[y][x].flagsNear = 0;

          for(let nx = -1; nx <= 1; nx++) {
            for(let ny = -1; ny <= 1; ny++) {
              if(x + nx >= 0 && x + nx < size && y + ny >= 0 && y + ny < size && (nx != 0 || ny != 0)) {
                uncoverField(x + nx, y + ny, currenttime);
              }
            }
          }
        }
      }
    }
  }
}

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

const GenBoard = () => {
  const [stateIsUncovered, setStateIsUncovered] = useState(board.map((x) => x.map((y) => y.isUncovered)));  // These states are set so that the board rerenders each time a move is made
  const [stateIsFlagged, setStateIsFlagged] = useState(board.map((x) => x.map((y) => y.isFlagged)));        //
  const [statePrettyTime, setStatePrettyTime] = useState('0:00');                                           // Timer string state

  if (!boardDone) {
    prepareBoard();
    boardDone = true;
  }

  // Opacity value for a blue field cover (opacity gradually fades away when uncovered)
  const coverOpacity = board.map((row) => row.map(() => {return useSharedValue('rgba(47, 95, 255, 1)')}));
  
  // Update timer
  if(isCounting) {
    setInterval(() => {
      if(isCounting) {
        let seconds = Math.floor((Date.now() - startTimestamp) / 1000);

        // Some syntax formatting
        if (seconds > 59) {
          setStatePrettyTime(`${Math.floor((seconds - (seconds % 60)) / 60)}:${(seconds % 60) < 10 ? '0' : ''}${seconds % 60}`);
        } else {
          setStatePrettyTime(`0:${seconds < 10 ? '0' : ''}${seconds}`);
        }
      }
    }, 100); // Update every 100 miliseconds in order to prevent timer value lagging
  }

  // Press events for fields
  const handlePress = (x, y) => {
    uncoverField(y, x, statePrettyTime, true);
    const newBoard = board.map((x) => x.map((y) => y.isUncovered));

    // Make cover transparent
    for(let i = 0; i < size; i++) {
      for(let j = 0; j < size; j++) {
        if(board[i][j].isUncovered) {
          coverOpacity[i][j].value = withSpring('rgba(0, 0, 255, 0)');
        }
      }
    }

    setStateIsUncovered(newBoard);
  }

  const handleLongPress = (x, y) => { // flag/unflag field
    flagUnflag(y, x);
    const newBoard = board.map((x) => x.map((y) => y.isFlagged));

    setStateIsFlagged(newBoard);
  }

  // Press event for new game button
  const restartgame = () => {
    // Reset game counters
    board = [];
    rows = [];
    flds = [];
    uncoveredFields = 0;
    
    prepareBoard();

    // Reset other variables & time string
    minesConfigured = false;
    gameplay = true;
    setStatePrettyTime('0:00');

    // Cover every field
    const newFlds = board.map((x) => x.map((y) => y.isUncovered));

    for(let i = 0; i < size; i++) {
      for(let j = 0; j < size; j++) {
        if(!board[i][j].isUncovered) {
          coverOpacity[i][j].value = withSpring('rgba(47, 95, 255, 1)');
        }
      }
    }

    setStateIsUncovered(newFlds);

    // Reset flags
    const newFlags = board.map((x) => x.map((y) => y.isFlagged));
    setStateIsFlagged(newFlags);
  }

  return (
    <>
      <View style={appStyleSheet.board}>{
        rows.map((rowNumber) => <View style={appStyleSheet.row} key={rowNumber}>{
          flds.map((fldNumber) =>
            <TouchableHighlight
              style={board[rowNumber][fldNumber].hasMine ? [appStyleSheet.field, appStyleSheet.fieldWithMine] : appStyleSheet.field}
              onPress={() => handlePress(rowNumber, fldNumber)}
              onLongPress={() => handleLongPress(rowNumber, fldNumber)}
              key={fldNumber}
            >
              <View style={appStyleSheet.svgContainer}>
                <Text>{
                  board[rowNumber][fldNumber].hasMine
                    ? MineSvgImage()
                    : board[rowNumber][fldNumber].minesNear == 0
                      ? ''
                      : board[rowNumber][fldNumber].isUncovered
                        ? NumberIcon(null, board[rowNumber][fldNumber].minesNear)
                        : ''
                }</Text>
                <Animated.View
                  style={[appStyleSheet.cover, {backgroundColor: coverOpacity[rowNumber][fldNumber]}]}
                >
                  <Text>{
                    board[rowNumber][fldNumber].isFlagged
                      ? FlagSvgImage()
                      : ''
                  }</Text>
                </Animated.View>
              </View>
            </TouchableHighlight>
        )}</View>
      )}</View>
      
      <View style={appStyleSheet.restartcontainer}>{
        gameplay
          ? <View style={appStyleSheet.restartbutton}>
              <Text style={appStyleSheet.restarttext}>{statePrettyTime}</Text>
            </View>
          : <TouchableHighlight style={appStyleSheet.restartbutton} onPress={() => restartgame()}>
              <Text style={appStyleSheet.restarttext}>Od nowa</Text>
            </TouchableHighlight>
      }</View>
    </>
  )
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
            if(isTheLogoCool == 9) {
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
      let boardSize = await AsyncStorage.getItem("BoardSize");
      if (boardSize == null) {
        boardSize = 8;
        try {
          await AsyncStorage.setItem("BoardSize", '8');
        } catch(err_set) {
          alert(err_set);
        }
      }
      size = Number(boardSize);
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
        // minesPlaced = 0;
        uncoveredFields = 0;
        minesConfigured = false;
        boardDone = false;
        isCounting = false;
        gameplay = true;
        
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
