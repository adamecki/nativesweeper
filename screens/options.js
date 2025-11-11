import { View, Text, ImageBackground, TouchableHighlight } from 'react-native';

import { GestureHandlerRootView, GestureDetector, Gesture, TextInput } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, useAnimatedProps } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { appStyleSheet } from '../styles';
import meadowBackground from '../assets/meadow-1x1.jpg';

const initial_size = 50; // 0 to 5
const slider_width = 300;

const BoardSizeView = Animated.createAnimatedComponent(TextInput);

const optionsView = () => {
    const navigation = useNavigation();

    const saveBoardSize = async () => {
        try {
            await AsyncStorage.setItem("BoardSize", `${sharedSize.value}`);
        } catch(err) {
            alert(err);
        }

        navigation.navigate('Gra', { refresh: Date.now() });
    };

    const fetchBoardSize = async () => {
        try {
            sharedSize.value = await AsyncStorage.getItem("BoardSize");
            offset.value = (await AsyncStorage.getItem("BoardSize") - 8) * 62;
        } catch(err) {
            alert(err);
        }
    }

    const offset = useSharedValue(0);
    const sharedSize = useSharedValue(8);
    fetchBoardSize();
    const max_value = slider_width - initial_size;

    const pan = Gesture.Pan().onChange((event) => {
        offset.value = Math.abs(offset.value) <= max_value
            ? offset.value + event.changeX <= 0
                ? 0
                : offset.value + event.changeX >= max_value
                    ? max_value
                    : offset.value + event.changeX
            : offset.value;
    }).onEnd(() => {
        const newSize = Math.round(offset.value / 62);
        offset.value = newSize * 62;
        sharedSize.value = 8 + newSize;
    });

    const sliderStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: offset.value }],
        }
    });

    const boardSizeDescriptor = useAnimatedProps(() => {
        return {
            text: `${sharedSize.value} na ${sharedSize.value}`,
            defaultValue: `${sharedSize.value} na ${sharedSize.value}`
        };
    });

    return (
        <ImageBackground source={meadowBackground} resizeMode='cover' style={appStyleSheet.appBackground}>
            <GestureHandlerRootView style={appStyleSheet.container}>
                <View style={appStyleSheet.settingsContainer}>
                    <View>
                        <Text style={appStyleSheet.optionHeader}>Rozmiar planszy</Text>
                    </View>
                    <View style={appStyleSheet.sliderTrack}>
                        <GestureDetector gesture={pan}>
                            <Animated.View style={[appStyleSheet.sliderHandle, sliderStyle]} />
                        </GestureDetector>
                    </View>
                    <BoardSizeView animatedProps={boardSizeDescriptor} style={appStyleSheet.optionDescriptor} editable={false}/>
                    <TouchableHighlight style={appStyleSheet.saveButton} onPress={saveBoardSize}>
                        <View>
                            <Text style={appStyleSheet.optionDescriptor}>Zapisz (zrestartuje grę!)</Text>
                        </View>
                    </TouchableHighlight>

                    {/* <View>
                        <Text style={appStyleSheet.optionHeader}>Ilość min</Text> // set how many percent is mines; maybe in the future?
                    </View> */}
                </View>
            </GestureHandlerRootView>
            <View style={appStyleSheet.footerSignature}>
                <Text style={appStyleSheet.optionDescriptor}>2025 | Nativesweeper by Adam Łukasik</Text>
            </View>
        </ImageBackground>
    );
};

export default optionsView;
